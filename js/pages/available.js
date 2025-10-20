/**
 * Available Books Page
 * Displays list of books available for borrowing
 * Using Vue 3 Composition API
 */

import { api } from "../api.js";
import { Navigation } from "../components/Navigation.js";
import { BookList } from "../components/BookList.js";
import { BorrowForm } from "../components/BorrowForm.js";
import { QRCodeModal } from "../components/QRCodeModal.js";
import { Toast } from "../components/Toast.js";
import {
  initGoogleAuth,
  signInWithGoogle,
  getCurrentUser,
  isLoggedIn,
} from "../auth.js";

const { createApp, ref, onMounted, computed } = Vue;

const app = createApp({
  setup() {
    // Reactive state
    const books = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const selectedBook = ref(null);
    const borrowing = ref(false);
    const toastMessage = ref(null);
    const toastType = ref("success");
    const user = ref(null);
    const showQRCode = ref(false);
    const qrCodeBook = ref(null);
    const isKeeperMode = ref(false);

    // Print mode state
    const isPrintMode = ref(false);
    const selectedBookIds = ref([]);

    // Check URL params for keeper mode
    const checkKeeperMode = () => {
      const urlParams = new URLSearchParams(window.location.search);
      isKeeperMode.value = urlParams.get("mode") === "keeper";
    };

    // Computed: all books selected
    const allSelected = computed(() => {
      return (
        books.value.length > 0 &&
        selectedBookIds.value.length === books.value.length
      );
    });

    // Computed: selection count
    const selectionCount = computed(() => {
      return selectedBookIds.value.length;
    });

    // Sort books by number (A01-1 format)
    const sortBooksByNumber = (bookList) => {
      return bookList.sort((a, b) => {
        // 如果沒有 number 欄位,放到最後
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

        // 第一部分相同,比較第二部分的數字
        const aNumber = parseInt(aParts[1]) || 0;
        const bNumber = parseInt(bParts[1]) || 0;

        return aNumber - bNumber;
      });
    };

    // Load books from API
    const loadBooks = async () => {
      loading.value = true;
      error.value = null;

      const result = await api.getAvailableBooks();

      if (result.success) {
        // API returns array directly
        const bookList = Array.isArray(result.data) ? result.data : [];
        // 按照書籍編號排序 (A01-1 格式)
        books.value = sortBooksByNumber(bookList);
      } else {
        error.value = result.error || "Failed to load books";
      }

      loading.value = false;
    };

    // Retry loading books
    const retryLoad = async () => {
      await loadBooks();
    };

    // Toggle print mode
    const togglePrintMode = () => {
      isPrintMode.value = !isPrintMode.value;
      // Clear selection when exiting print mode
      if (!isPrintMode.value) {
        selectedBookIds.value = [];
      }
    };

    // Toggle select all
    const toggleSelectAll = () => {
      if (allSelected.value) {
        selectedBookIds.value = [];
      } else {
        selectedBookIds.value = books.value.map((book) => book.id);
      }
    };

    // Handle selection change from BookList
    const handleSelectionChange = (selected) => {
      selectedBookIds.value = selected;
    };

    // Print selected books
    const printSelected = () => {
      if (selectedBookIds.value.length === 0) {
        showToast("請至少選擇一本書", "error");
        return;
      }

      const ids = selectedBookIds.value.join(",");
      window.open(`print.html?ids=${ids}`, "_blank");
    };

    // Print all books
    const printAll = () => {
      window.open("print.html", "_blank");
    };

    // Show borrow form (with login check)
    const showBorrowForm = async (book) => {
      // Check if user is logged in
      if (!isLoggedIn()) {
        try {
          // Trigger Google Sign-In
          await signInWithGoogle();
          // After successful login, show borrow form
          user.value = getCurrentUser();
          console.log("user", user);
          selectedBook.value = book;
        } catch (err) {
          console.error("Login failed:", err);
          showToast("請先登入 306 員工 Google 帳號才能借書", "error");
        }
      } else {
        // Already logged in, show form directly
        selectedBook.value = book;
      }
    };

    // Handle borrow confirmation
    const handleBorrow = async ({ bookId }) => {
      borrowing.value = true;

      // Get current user info to send to API
      user.value = getCurrentUser();

      const borrowData = {
        name: user.value?.name || null,
        email: user.value?.email || null,
      };

      const result = await api.borrowBook(bookId, borrowData);

      if (result.success) {
        // Optimistic update: remove book from list
        books.value = books.value.filter((b) => b.id !== bookId);
        selectedBook.value = null;
        showToast("借閱成功!", "success");
      } else {
        showToast(result.error || "借閱失敗,請稍後再試", "error");
      }

      borrowing.value = false;
    };

    // Cancel borrow
    const cancelBorrow = () => {
      selectedBook.value = null;
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
      // Check keeper mode
      checkKeeperMode();

      // Initialize Google Auth
      try {
        await initGoogleAuth();
      } catch (err) {
        console.error("Failed to initialize Google Auth:", err);
      }

      await loadBooks();
    });

    // Expose to template
    return {
      books,
      loading,
      error,
      selectedBook,
      borrowing,
      toastMessage,
      toastType,
      showQRCode,
      qrCodeBook,
      isKeeperMode,
      isPrintMode,
      selectedBookIds,
      allSelected,
      selectionCount,
      retryLoad,
      togglePrintMode,
      toggleSelectAll,
      handleSelectionChange,
      printSelected,
      printAll,
      showBorrowForm,
      handleBorrow,
      cancelBorrow,
      handleShowQRCode,
      closeQRCode,
      showToast,
      closeToast,
    };
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

        <!-- Print Controls (only in keeper mode) -->
        <div v-if="isKeeperMode && !loading && !error && books.length > 0" class="print-controls">
          <div class="print-controls-left">
            <!-- Toggle Print Mode -->
            <button
              @click="togglePrintMode"
              class="btn-mode-toggle"
              :class="{ active: isPrintMode }"
            >
              {{ isPrintMode ? '✓ 列印模式' : '列印模式' }}
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
              已選擇 <strong>{{ selectionCount }}</strong> / {{ books.length }} 本書
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
            <button
              @click="printAll"
              class="btn-print"
            >
              🖨️ 列印全部
            </button>
          </div>
        </div>

        <book-list
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
        ></book-list>

        <borrow-form
          :book="selectedBook"
          :loading="borrowing"
          @confirm="handleBorrow"
          @cancel="cancelBorrow"
        ></borrow-form>

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
app.component("borrow-form", BorrowForm);
app.component("qrcode-modal", QRCodeModal);
app.component("toast", Toast);

// Mount app
app.mount("#app");
