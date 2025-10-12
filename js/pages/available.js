/**
 * Available Books Page
 * Displays list of books available for borrowing
 */

import { api } from "../api.js";
import { Navigation } from "../components/Navigation.js";
import { BookList } from "../components/BookList.js";
import { BorrowForm } from "../components/BorrowForm.js";
import { Toast } from "../components/Toast.js";

const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      books: [],
      loading: true,
      error: null,
      selectedBook: null,
      borrowing: false,
      toastMessage: null,
      toastType: "success",
    };
  },
  async mounted() {
    await this.loadBooks();
  },
  methods: {
    async loadBooks() {
      this.loading = true;
      this.error = null;

      const result = await api.getAvailableBooks();

      if (result.success) {
        // API returns array directly
        const books = Array.isArray(result.data) ? result.data : [];
        // 按照書籍編號排序 (A01-1 格式)
        this.books = this.sortBooksByNumber(books);
      } else {
        this.error = result.error || "Failed to load books";
      }

      this.loading = false;
    },

    sortBooksByNumber(books) {
      return books.sort((a, b) => {
        // 如果沒有 number 欄位，放到最後
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
    showBorrowForm(book) {
      this.selectedBook = book;
    },
    async handleBorrow({ bookId, borrowerName }) {
      this.borrowing = true;

      const result = await api.borrowBook(bookId, borrowerName);

      if (result.success) {
        // Optimistic update: remove book from list
        this.books = this.books.filter((b) => b.id !== bookId);
        this.selectedBook = null;
        this.showToast("借閱成功！", "success");
      } else {
        this.showToast(result.error || "借閱失敗，請稍後再試", "error");
      }

      this.borrowing = false;
    },
    cancelBorrow() {
      this.selectedBook = null;
    },
    showToast(message, type = "success") {
      this.toastMessage = message;
      this.toastType = type;
    },
    closeToast() {
      this.toastMessage = null;
    },
  },
  template: `
    <div>
      <navigation current="available"></navigation>

      <main id="main-content" class="main-content">
        <div class="page-header">
          <h1>Available Books</h1>
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
          type="available"
          :loading="loading || borrowing"
          :error="error"
          @borrow="showBorrowForm"
        ></book-list>

        <borrow-form
          :book="selectedBook"
          :loading="borrowing"
          @confirm="handleBorrow"
          @cancel="cancelBorrow"
        ></borrow-form>

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
app.component("borrow-form", BorrowForm);
app.component("toast", Toast);

// Mount app
app.mount("#app");
