/**
 * BookList Component
 * Displays a list of books with different actions based on type
 */

export const BookList = {
  props: {
    books: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ["available", "borrowed"].includes(value),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: null,
    },
  },
  emits: ["borrow", "return"],
  template: `
    <div class="book-list-container">
      <!-- Loading State with Skeleton -->
      <div v-if="loading" class="book-grid">
        <div v-for="n in 6" :key="n" class="skeleton-card">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-button"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-message">
        <p class="text-error">{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="books.length === 0" class="empty-state">
        <p class="text-light">No books currently {{ type }}</p>
      </div>

      <!-- Books Grid -->
      <div v-else class="book-grid" role="list">
        <article
          v-for="book in books"
          :key="book.id"
          class="book-card"
          role="listitem"
        >
          <div class="book-content">
            <h3 class="book-title" :title="book.name">{{ book.name }}</h3>
            <p v-if="book.number" class="book-number">{{ book.number }}</p>
            <p v-if="book.author" class="book-author" :title="book.author">by {{ book.author }}</p>

            <!-- Show borrower name for borrowed books -->
            <p v-if="type === 'borrowed' && book.borrowerName" class="borrower-name" :title="'Borrowed by: ' + book.borrowerName">
              Borrowed by: <strong>{{ book.borrowerName }}</strong>
            </p>

            <!-- Show borrowed date if available -->
            <p v-if="type === 'borrowed' && book.borrowedAt" class="borrowed-date">
              {{ formatDate(book.borrowedAt) }}
            </p>
          </div>

          <div class="book-actions">
            <!-- Borrow button for available books -->
            <button
              v-if="type === 'available'"
              @click="$emit('borrow', book)"
              class="btn btn-primary"
              :disabled="loading"
              :aria-label="'Borrow ' + book.name"
            >
              Borrow
            </button>

            <!-- Return button for borrowed books -->
            <button
              v-if="type === 'borrowed'"
              @click="$emit('return', book)"
              class="btn btn-secondary"
              :disabled="loading"
              :aria-label="'Return ' + book.name"
            >
              Return
            </button>
          </div>
        </article>
      </div>
    </div>
  `,
  methods: {
    formatDate(dateString) {
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
      } catch (e) {
        return "";
      }
    },
  },
};
