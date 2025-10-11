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
        this.books = Array.isArray(result.data) ? result.data : [];
      } else {
        this.error = result.error || "Failed to load books";
      }

      this.loading = false;
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
        this.showToast("Book borrowed successfully!", "success");
      } else {
        this.showToast(result.error || "Failed to borrow book", "error");
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
