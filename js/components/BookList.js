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
    showReturnButton: {
      type: Boolean,
      default: true,
    },
    showQRButton: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["borrow", "return", "show-qrcode"],
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
          <div v-if="showQRButton" class="book-header">
            <button
              @click="$emit('show-qrcode', book)"
              class="btn-qrcode"
              :aria-label="'Show QR Code for ' + book.name"
              title="顯示 QR Code"
            >
              📱
            </button>
          </div>
          <div class="book-content">
            <h3 class="book-title" :title="book.name">{{ book.name }}</h3>
            <p v-if="book.number" class="book-number">{{ book.number }}</p>
            <p v-if="book.author" class="book-author" :title="book.author">by {{ book.author }}</p>
            <!-- Show borrower name for borrowed books -->
            <p v-if="type === 'borrowed' && book.borrowerName" class="borrower-name" :title="'Borrowed by: ' + book.borrowerName">
              借閱者：<strong>{{ book.borrowerName }}</strong>
            </p>
            <!-- Show borrowed date and due date -->
            <div v-if="type === 'borrowed' && book.borrowedAt" class="borrowed-info">
              <p class="borrowed-date">
                借閱日期：{{ formatDate(book.borrowedAt) }}
              </p>
              <p class="due-date" :class="{ overdue: isOverdue(book.borrowedAt) }">
                應歸還：{{ formatDueDate(book.borrowedAt) }}
              </p>
            </div>
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
              v-if="type === 'borrowed' && showReturnButton"
              @click="$emit('return', book)"
              class="btn btn-secondary"
              :disabled="loading"
              :aria-label="'Return ' + book.name"
            >
              歸還
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
        return date.toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      } catch (e) {
        return "";
      }
    },
    formatDueDate(borrowDateString) {
      try {
        const borrowDate = new Date(borrowDateString);
        // 加上 14 天
        const dueDate = new Date(borrowDate);
        dueDate.setDate(dueDate.getDate() + 14);
        return dueDate.toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      } catch (e) {
        return "";
      }
    },
    isOverdue(borrowDateString) {
      try {
        const borrowDate = new Date(borrowDateString);
        const dueDate = new Date(borrowDate);
        dueDate.setDate(dueDate.getDate() + 14);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);
        return today > dueDate;
      } catch (e) {
        return false;
      }
    },
  },
};
