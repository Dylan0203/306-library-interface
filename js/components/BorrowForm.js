/**
 * BorrowForm Component
 * Modal form for borrowing a book with borrower name/ID input
 */

export const BorrowForm = {
  props: {
    book: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["confirm", "cancel"],
  data() {
    return {
      borrowerName: "",
      error: null,
    };
  },
  watch: {
    book(newBook) {
      if (newBook) {
        // Reset form when book changes
        this.borrowerName = "";
        this.error = null;
      }
    },
  },
  methods: {
    validateAndSubmit() {
      // Validate borrower name
      if (!this.borrowerName.trim()) {
        this.error = "Please enter your name or ID";
        return;
      }

      // Emit confirm event with book ID and borrower name
      this.$emit("confirm", {
        bookId: this.book.id,
        borrowerName: this.borrowerName.trim(),
      });
    },
    cancel() {
      this.borrowerName = "";
      this.error = null;
      this.$emit("cancel");
    },
  },
  template: `
    <div v-if="book" class="modal-overlay" @click.self="cancel">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Borrow Book</h2>
          <button @click="cancel" class="modal-close" aria-label="Close">
            ×
          </button>
        </div>

        <div class="modal-body">
          <div class="book-info">
            <h3>{{ book.name }}</h3>
            <p v-if="book.number" class="text-light">{{ book.number }}</p>
            <p v-if="book.author" class="text-light">by {{ book.author }}</p>
          </div>

          <form @submit.prevent="validateAndSubmit">
            <div class="form-group">
              <label for="borrower-name">Your Name or ID</label>
              <input
                id="borrower-name"
                v-model="borrowerName"
                type="text"
                class="form-input"
                placeholder="Enter your name or ID"
                maxlength="100"
                autofocus
              />
              <p v-if="error" class="form-error">{{ error }}</p>
            </div>

            <div class="form-actions">
              <button type="button" @click="cancel" class="btn btn-secondary" :disabled="loading">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Borrowing...' : 'Confirm Borrow' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
};
