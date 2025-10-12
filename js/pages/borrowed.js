import { api } from "../api.js";
import { Navigation } from "../components/Navigation.js";
import { BookList } from "../components/BookList.js";
import { Toast } from "../components/Toast.js";

const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      books: [],
      loading: true,
      error: null,
      toastMessage: null,
      toastType: "success",
      isKeeperMode: false,
    };
  },

  created() {
    // 檢查 URL 查詢參數
    const urlParams = new URLSearchParams(window.location.search);
    this.isKeeperMode = urlParams.get("mode") === "keeper";
  },

  async mounted() {
    await this.loadBooks();
  },

  methods: {
    async loadBooks() {
      this.loading = true;
      this.error = null;

      const result = await api.getBorrowedBooks();

      if (result.success) {
        // API 回傳陣列格式，需要轉換欄位名稱
        const data = Array.isArray(result.data) ? result.data : [result.data];
        const books = data.map((record) => ({
          recordId: record.record_id, // 借閱記錄 ID (用於歸還)
          bookId: record.id, // 書籍 ID
          name: record.name || "未知書名",
          number: record.number || "",
          author: record.author || "",
          borrowerName: record.borrower_name,
          borrowedAt: record.borrow_date,
        }));
        // 按照書籍編號排序 (A01-1 格式)
        this.books = this.sortBooksByNumber(books);
      } else {
        this.error = result.error;
      }

      this.loading = false;
    },

    sortBooksByNumber(books) {
      return books.sort((a, b) => {
        // 先按借閱者姓名排序
        const aName = a.borrowerName || "";
        const bName = b.borrowerName || "";

        if (aName !== bName) {
          return aName.localeCompare(bName, "zh-TW");
        }

        // 姓名相同時，再按書籍編號排序
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

        // 第一部分相同，比較第二部分的數字
        const aNumber = parseInt(aParts[1]) || 0;
        const bNumber = parseInt(bParts[1]) || 0;

        return aNumber - bNumber;
      });
    },

    async retryLoad() {
      await this.loadBooks();
    },

    async handleReturn(book) {
      const confirmed = confirm(
        `確定要歸還 ${book.borrowerName} 借閱的書籍嗎？`,
      );

      if (!confirmed) {
        return;
      }

      // 使用借閱記錄 ID 來歸還書籍
      const result = await api.returnBook(book.recordId);

      if (result.success) {
        // Optimistically remove from list (用 recordId 來比對)
        this.books = this.books.filter((b) => b.recordId !== book.recordId);
        this.showToast("歸還成功！", "success");
      } else {
        this.showToast(result.error || "歸還失敗，請稍後再試", "error");
      }
    },

    showToast(message, type = "success") {
      this.toastMessage = message;
      this.toastType = type;
    },

    closeToast() {
      this.toastMessage = null;
    },
  },

  components: {
    Navigation,
    BookList,
    Toast,
  },

  template: `
    <div>
      <Navigation current="borrowed" />
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
        <BookList
          :books="books"
          type="borrowed"
          :loading="loading"
          :error="error"
          :showReturnButton="isKeeperMode"
          @return="handleReturn"
        />
      </main>
      <Toast
        :message="toastMessage"
        :type="toastType"
        @close="closeToast"
      />
    </div>
  `,
});

app.mount("#app");
