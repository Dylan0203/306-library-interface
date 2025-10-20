<template>
  <div>
    <main id="main-content" class="p-4 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1
          class="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white"
        >
          Available Books
        </h1>
        <button
          v-if="error"
          @click="loadBooks"
          :class="[BTN_BASE, BTN_SECONDARY]"
        >
          Retry
        </button>
      </div>

      <!-- Print Controls (only in keeper mode) -->
      <div
        v-if="isKeeperMode && !loading && !error && books.length > 0"
        class="flex gap-4 items-center mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex-wrap"
      >
        <div
          class="flex gap-4 items-center flex-1 max-sm:flex-col max-sm:items-stretch"
        >
          <!-- Toggle Print Mode -->
          <button
            @click="togglePrintMode"
            :class="[
              'px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              isPrintMode
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-blue-600',
            ]"
          >
            {{ isPrintMode ? "✓ 列印模式" : "列印模式" }}
          </button>

          <!-- Select All (only in print mode) -->
          <label
            v-if="isPrintMode"
            class="inline-flex items-center gap-2 cursor-pointer select-none font-medium text-gray-900 dark:text-white"
          >
            <input
              type="checkbox"
              class="peer absolute opacity-0 cursor-pointer h-0 w-0 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              :checked="allSelected"
              @change="toggleSelectAll"
            />
            <span
              class="relative h-[22px] w-[22px] bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded transition-all duration-200 peer-hover:border-blue-600 peer-hover:bg-blue-50 dark:peer-hover:bg-gray-600 peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:hidden after:left-[7px] after:top-[3px] after:w-[5px] after:h-[10px] after:border-white after:border-r-2 after:border-b-2 after:rotate-45 peer-checked:after:block"
            ></span>
            <span>全選</span>
          </label>

          <!-- Selection count -->
          <div
            v-if="isPrintMode"
            class="text-gray-500 dark:text-gray-400 text-sm"
          >
            已選擇
            <strong class="text-blue-600 dark:text-blue-400 font-semibold">{{
              selectionCount
            }}</strong>
            / {{ books.length }} 本書
          </div>
        </div>

        <div class="flex gap-2 max-sm:flex-col max-sm:w-full">
          <!-- Print Selected -->
          <button
            v-if="isPrintMode"
            @click="printSelected"
            :disabled="selectionCount === 0"
            class="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 border-0 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-blue-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 max-sm:w-full max-sm:justify-center"
          >
            🖨️ 列印已選 ({{ selectionCount }})
          </button>

          <!-- Print All -->
          <button
            @click="printAll"
            class="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 border-0 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 max-sm:w-full max-sm:justify-center"
          >
            🖨️ 列印全部
          </button>
        </div>
      </div>

      <BookList
        :books="books"
        type="available"
        :loading="loading || borrowing"
        :error="error"
        :showQRButton="isKeeperMode"
        :showCheckbox="isPrintMode"
        :selectedBooks="selectedBookIds"
        @borrow="handleBorrowClick"
        @show-qrcode="handleShowQRCode"
        @selection-change="handleSelectionChange"
      />

      <BorrowForm
        ref="borrowFormRef"
        :loading="borrowing"
        @confirm="handleBorrow"
        @cancel="closeBorrowForm"
      />

      <QRCodeModal :book="qrCodeBook" :show="showQRCode" @close="closeQRCode" />

      <Toast :message="toastMessage" :type="toastType" @close="closeToast" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { BTN_BASE, BTN_SECONDARY } from "~/constants/styles";
import { useUserStore } from "~/stores/user";

interface Book {
  id: string;
  name: string;
  number?: string;
  author?: string;
}

// Page metadata
useHead({
  title: "Available Books - Library System",
  meta: [
    {
      name: "description",
      content: "Browse and borrow books from the library system",
    },
  ],
});

const api = useApi();
const { currentUser, initGoogleAuth } = useAuth();
const userStore = useUserStore();

// Reactive state
const books = ref<Book[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const borrowing = ref(false);
const toastMessage = ref<string | null>(null);
const toastType = ref<"success" | "error">("success");
const showQRCode = ref(false);
const qrCodeBook = ref<Book | null>(null);
const isPrintMode = ref(false);
const selectedBookIds = ref<string[]>([]);
const borrowFormRef = ref<{ showForm: (book: Book) => Promise<void> } | null>(
  null,
);

// Computed
const isKeeperMode = computed(() => userStore.isKeeper);

const allSelected = computed(() => {
  return (
    books.value.length > 0 &&
    selectedBookIds.value.length === books.value.length
  );
});

const selectionCount = computed(() => {
  return selectedBookIds.value.length;
});

// Sort books by number (A01-1 format)
const sortBooksByNumber = (bookList: Book[]): Book[] => {
  return bookList.sort((a, b) => {
    if (!a.number && !b.number) return 0;
    if (!a.number) return 1;
    if (!b.number) return -1;

    const aParts = a.number.split("-");
    const bParts = b.number.split("-");

    const aPrefix = aParts[0] || "";
    const bPrefix = bParts[0] || "";

    if (aPrefix !== bPrefix) {
      return aPrefix.localeCompare(bPrefix);
    }

    const aNumber = parseInt(aParts[1]) || 0;
    const bNumber = parseInt(bParts[1]) || 0;
    return aNumber - bNumber;
  });
};

// Load books
const loadBooks = async () => {
  loading.value = true;
  error.value = null;

  const result = await api.getAvailableBooks();

  if (result.success) {
    const bookList = Array.isArray(result.data) ? result.data : [];
    books.value = sortBooksByNumber(bookList);
  } else {
    error.value = result.error || "Failed to load books";
  }

  loading.value = false;
};

// Print mode functions
const togglePrintMode = () => {
  isPrintMode.value = !isPrintMode.value;
  if (!isPrintMode.value) {
    selectedBookIds.value = [];
  }
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedBookIds.value = [];
  } else {
    selectedBookIds.value = books.value.map((book) => book.id);
  }
};

const handleSelectionChange = (selected: string[]) => {
  selectedBookIds.value = selected;
};

const printSelected = () => {
  if (selectedBookIds.value.length === 0) {
    showToast("請至少選擇一本書", "error");
    return;
  }
  const ids = selectedBookIds.value.join(",");
  window.open(`/print?ids=${ids}`, "_blank");
};

const printAll = () => {
  window.open("/print", "_blank");
};

// Borrow functions
const handleBorrowClick = async (book: Book) => {
  if (borrowFormRef.value) {
    await borrowFormRef.value.showForm(book);
  }
};

const handleBorrow = async ({ bookId }: { bookId: string }) => {
  borrowing.value = true;

  const borrowData = {
    name: currentUser.value?.name || "",
    email: currentUser.value?.email || "",
  };

  const result = await api.borrowBook(bookId, borrowData);

  if (result.success) {
    books.value = books.value.filter((b) => b.id !== bookId);
    showToast("借閱成功!", "success");
  } else {
    showToast(result.error || "借閱失敗,請稍後再試", "error");
  }

  borrowing.value = false;
};

const closeBorrowForm = () => {
  // Form handles its own internal state now
};

// QR Code functions
const handleShowQRCode = (book: Book) => {
  qrCodeBook.value = book;
  showQRCode.value = true;
};

const closeQRCode = () => {
  showQRCode.value = false;
  qrCodeBook.value = null;
};

// Toast functions
const showToast = (message: string, type: "success" | "error" = "success") => {
  toastMessage.value = message;
  toastType.value = type;
};

const closeToast = () => {
  toastMessage.value = null;
};

// Lifecycle
onMounted(async () => {
  try {
    await initGoogleAuth();
  } catch (err) {
    console.error("Failed to initialize Google Auth:", err);
  }

  await loadBooks();
});
</script>
