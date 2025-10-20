<template>
  <div>
    <main id="main-content" class="main-content">
      <div class="page-header">
        <h1>Available Books</h1>
        <button v-if="error" @click="loadBooks" class="btn btn-secondary">
          Retry
        </button>
      </div>

      <!-- Print Controls (only in keeper mode) -->
      <div
        v-if="isKeeperMode && !loading && !error && books.length > 0"
        class="print-controls"
      >
        <div class="print-controls-left">
          <!-- Toggle Print Mode -->
          <button
            @click="togglePrintMode"
            class="btn-mode-toggle"
            :class="{ active: isPrintMode }"
          >
            {{ isPrintMode ? "✓ 列印模式" : "列印模式" }}
          </button>

          <!-- Select All (only in print mode) -->
          <label v-if="isPrintMode" class="select-all-label">
            <input
              type="checkbox"
              class="select-all-checkbox"
              :checked="allSelected"
              @change="toggleSelectAll"
            />
            <span class="select-all-custom"></span>
            <span>全選</span>
          </label>

          <!-- Selection count -->
          <div v-if="isPrintMode" class="selection-count">
            已選擇 <strong>{{ selectionCount }}</strong> /
            {{ books.length }} 本書
          </div>
        </div>

        <div class="print-controls-right">
          <!-- Print Selected -->
          <button
            v-if="isPrintMode"
            @click="printSelected"
            class="btn-print"
            :disabled="selectionCount === 0"
          >
            🖨️ 列印已選 ({{ selectionCount }})
          </button>

          <!-- Print All -->
          <button @click="printAll" class="btn-print">🖨️ 列印全部</button>
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
        @borrow="showBorrowForm"
        @show-qrcode="handleShowQRCode"
        @selection-change="handleSelectionChange"
      />

      <BorrowForm
        :book="selectedBook"
        :loading="borrowing"
        @confirm="handleBorrow"
        @cancel="cancelBorrow"
      />

      <QRCodeModal :book="qrCodeBook" :show="showQRCode" @close="closeQRCode" />

      <Toast :message="toastMessage" :type="toastType" @close="closeToast" />
    </main>
  </div>
</template>

<script setup lang="ts">
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

const route = useRoute();
const api = useApi();
const { currentUser, initGoogleAuth, signInWithGoogle, isLoggedIn } = useAuth();

// Reactive state
const books = ref<Book[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const selectedBook = ref<Book | null>(null);
const borrowing = ref(false);
const toastMessage = ref<string | null>(null);
const toastType = ref<"success" | "error">("success");
const showQRCode = ref(false);
const qrCodeBook = ref<Book | null>(null);
const isKeeperMode = ref(false);
const isPrintMode = ref(false);
const selectedBookIds = ref<string[]>([]);

// Computed
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
const showBorrowForm = async (book: Book) => {
  if (!isLoggedIn.value) {
    try {
      await signInWithGoogle();
      selectedBook.value = book;
    } catch (err) {
      console.error("Login failed:", err);
      showToast("請先登入 306 員工 Google 帳號才能借書", "error");
    }
  } else {
    selectedBook.value = book;
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
    selectedBook.value = null;
    showToast("借閱成功!", "success");
  } else {
    showToast(result.error || "借閱失敗,請稍後再試", "error");
  }

  borrowing.value = false;
};

const cancelBorrow = () => {
  selectedBook.value = null;
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

// Check URL params for keeper mode
const checkKeeperMode = () => {
  isKeeperMode.value = route.query.mode === "keeper";
};

// Lifecycle
onMounted(async () => {
  checkKeeperMode();

  try {
    await initGoogleAuth();
  } catch (err) {
    console.error("Failed to initialize Google Auth:", err);
  }

  await loadBooks();
});
</script>
