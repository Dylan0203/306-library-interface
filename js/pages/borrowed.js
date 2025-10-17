/**
 * Borrowed Books Page
 * Displays list of borrowed books with return functionality
 * Using Vue 3 Composition API
 */
import { api } from "../api.js";
import { Navigation } from "../components/Navigation.js";
import { BookList } from "../components/BookList.js";
import { QRCodeModal } from "../components/QRCodeModal.js";
import { Toast } from "../components/Toast.js";

const { createApp, ref, onMounted, computed } = Vue;

const app = createApp({
  setup() {
    // Reactive state
    const books = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const toastMessage = ref(null);
    const toastType = ref("success");
    const isKeeperMode = ref(false);
    const showQRCode = ref(false);
    const qrCodeBook = ref(null);

    // Check URL params for keeper mode
    const checkKeeperMode = () => {
      const urlParams = new URLSearchParams(window.location.search);
      isKeeperMode.value = urlParams.get("mode") === "keeper";
    };

    // Sort books by borrower name, then by book number
    const sortBooksByNumber = (bookList) => {
      return bookList.sort((a, b) => {
        // 先按借閱者姓名排序
        const aName = a.borrowerName || "";
        const bName = b.borrowerName || "";

        if (aName !== bName) {
          return aName.localeCompare(bName, "zh-TW");
        }

        // 姓名相同時,,再按書籍編號排序
        if (!a.number && !b.number) return 0;
        if (!a.number) return 1;
        if (!b.number) return -1;

        // 分割編號 (例如 "A01-1" -> ["A01", "1"])
        const aParts = a.number.split("-");
        const bParts = b.number.split("-");

        // 先比較第一部分 (A01)
        const aPrefix = aParts[0] || "";
        const bPrefix = bParts[0] || "";

        if (aPrefix !== bPrefix) {
          return aPrefix.localeCompare(bPrefix);
        }

        // 第一部分相同,,比較第二部分的數字
        const aNumber = parseInt(aParts[1]) || 0;
        const bNumber = parseInt(bParts[1]) || 0;

        return aNumber - bNumber;
      });
    };

    // Load borrowed books from API
    const loadBooks = async () => {
      loading.value = true;
      error.value = null;

      const result = await api.getBorrowedBooks();

      if (result.success) {
        // API 回傳陣列格式,,需要轉換欄位名稱
        const data = Array.isArray(result.data) ? result.data : [result.data];
        const bookList = data.map((record) => ({
          recordId: record.record_id, // 借閱記錄 ID (用於歸還)
          bookId: record.id, // 書籍 ID
          id: record.id, // For QR Code generation
          name: record.name || "未知書名",
          number: record.number || "",
          author: record.author || "",
          borrowerName: record.borrower_name,
          borrowedAt: record.borrow_date,
        }));

        // 按照書籍編號排序 (A01-1 格式)
        books.value = sortBooksByNumber(bookList);
      } else {
        error.value = result.error;
      }

      loading.value = false;
    };

    // Retry loading books
    const retryLoad = async () => {
      await loadBooks();
    };

    // Handle return book
    const handleReturn = async (book) => {
      const confirmed = confirm(
        `確定要歸還 ${book.borrowerName} 借閱的書籍嗎??`,
      );

      if (!confirmed) {
        return;
      }

      // 使用借閱記錄 ID 來歸還書籍
      const result = await api.returnBook(book.recordId);

      if (result.success) {
        // Optimistically remove from list (用 recordId 來比對)
        books.value = books.value.filter((b) => b.recordId !== book.recordId);
        showToast("歸還成功!!", "success");
      } else {
        showToast(result.error || "歸還失敗,,請稍後再試", "error");
      }
    };

    // Show QR Code modal
    const handleShowQRCode = (book) => {
      qrCodeBook.value = book;
      showQRCode.value = true;
    };

    // Close QR Code modal
    const closeQRCode = () => {
      showQRCode.value = false;
      qrCodeBook.value = null;
    };

    // Show toast notification
    const showToast = (message, type = "success") => {
      toastMessage.value = message;
      toastType.value = type;
    };

    // Close toast
    const closeToast = () => {
      toastMessage.value = null;
    };

    // Lifecycle hook: on mounted
    onMounted(async () => {
      checkKeeperMode();
      await loadBooks();
    });

    // Expose to template
    return {
      books,
      loading,
      error,
      toastMessage,
      toastType,
      isKeeperMode,
      showQRCode,
      qrCodeBook,
      retryLoad,
      handleReturn,
      handleShowQRCode,
      closeQRCode,
      showToast,
      closeToast,
    };
  },
  template: `
    <div>
      <navigation current="borrowed"></navigation>
      <main id="main-content" class="main-content">
        <div class="page-header">
          <h1>Borrowed Books</h1>
          <button
            v-if="error"
            @click="retryLoad"
            class="btn btn-secondary"
          >
            Retry
          </button>
        </div>
        <book-list
          :books="books"
          type="borrowed"
          :loading="loading"
          :error="error"
          :showReturnButton="isKeeperMode"
          :showQRButton="isKeeperMode"
          @return="handleReturn"
          @show-qrcode="handleShowQRCode"
        ></book-list>
        <qrcode-modal
          :book="qrCodeBook"
          :show="showQRCode"
          @close="closeQRCode"
        ></qrcode-modal>
        <toast
          :message="toastMessage"
          :type="toastType"
          @close="closeToast"
        ></toast>
      </main>
    </div>
  `,
});

// Register components
app.component("navigation", Navigation);
app.component("book-list", BookList);
app.component("qrcode-modal", QRCodeModal);
app.component("toast", Toast);

// Mount app
app.mount("#app");
