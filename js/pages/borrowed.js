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
    };
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
        this.books = result.data;
      } else {
        this.error = result.error;
      }

      this.loading = false;
    },

    async retryLoad() {
      await this.loadBooks();
    },

    async handleReturn(book) {
      const confirmed = confirm(
        `Return book borrowed by ${book.borrowerName}?`,
      );

      if (!confirmed) {
        return;
      }

      const result = await api.returnBook(book.id);

      if (result.success) {
        // Optimistically remove from list
        this.books = this.books.filter((b) => b.id !== book.id);
        this.showToast("Book returned successfully!", "success");
      } else {
        this.showToast(result.error, "error");
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
