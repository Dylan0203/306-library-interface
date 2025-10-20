<template>
  <div>
    <main id="main-content" class="main-content">
      <div class="page-header">
        <h1>Borrowed Books</h1>
        <button v-if="error" @click="loadBooks" class="btn btn-secondary">
          Retry
        </button>
      </div>

      <BookList
        :books="books"
        type="borrowed"
        :loading="loading || returning"
        :error="error"
        :showReturnButton="isKeeperMode"
        :showQRButton="isKeeperMode"
        @return="handleReturn"
        @show-qrcode="handleShowQRCode"
      />

      <QRCodeModal :book="qrCodeBook" :show="showQRCode" @close="closeQRCode" />

      <Toast :message="toastMessage" :type="toastType" @close="closeToast" />
    </main>
  </div>
</template>

<script setup lang="ts">
interface Book {
  recordId?: string;
  id: string;
  name: string;
  number?: string;
  author?: string;
  borrowerName?: string;
  borrowedAt?: string;
}

useHead({
  title: "Borrowed Books - Library System",
  meta: [
    {
      name: "description",
      content: "View and return borrowed books from the library system",
    },
  ],
});

const route = useRoute();
const api = useApi();

const books = ref<Book[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const returning = ref(false);
const toastMessage = ref<string | null>(null);
const toastType = ref<"success" | "error">("success");
const isKeeperMode = ref(false);
const showQRCode = ref(false);
const qrCodeBook = ref<Book | null>(null);

const sortBooks = (bookList: Book[]): Book[] => {
  return bookList.sort((a, b) => {
    const aName = a.borrowerName || "";
    const bName = b.borrowerName || "";
    if (aName !== bName) {
      return aName.localeCompare(bName, "zh-TW");
    }
    if (!a.number || !b.number) return 0;
    return a.number.localeCompare(b.number);
  });
};

const loadBooks = async () => {
  loading.value = true;
  error.value = null;

  const result = await api.getBorrowedBooks();

  if (result.success) {
    const data = Array.isArray(result.data) ? result.data : [result.data];
    const bookList = data.map((record: any) => ({
      recordId: record.record_id,
      bookId: record.id,
      id: record.id,
      name: record.name || "未知書名",
      number: record.number || "",
      author: record.author || "",
      borrowerName: record.borrower_name,
      borrowedAt: record.borrow_date,
    }));
    books.value = sortBooks(bookList);
  } else {
    error.value = result.error || "Failed to load borrowed books";
  }

  loading.value = false;
};

const handleReturn = async (book: Book) => {
  if (!book.recordId) {
    showToast("無法歸還此書籍", "error");
    return;
  }

  returning.value = true;
  const result = await api.returnBook(book.recordId);

  if (result.success) {
    books.value = books.value.filter((b) => b.recordId !== book.recordId);
    showToast("歸還成功!", "success");
  } else {
    showToast(result.error || "歸還失敗", "error");
  }

  returning.value = false;
};

const handleShowQRCode = (book: Book) => {
  qrCodeBook.value = book;
  showQRCode.value = true;
};

const closeQRCode = () => {
  showQRCode.value = false;
  qrCodeBook.value = null;
};

const showToast = (message: string, type: "success" | "error" = "success") => {
  toastMessage.value = message;
  toastType.value = type;
};

const closeToast = () => {
  toastMessage.value = null;
};

onMounted(async () => {
  isKeeperMode.value = route.query.mode === "keeper";
  await loadBooks();
});
</script>
