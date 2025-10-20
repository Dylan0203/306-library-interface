/**
 * Print page for QR codes
 * Displays QR codes in a printable grid layout
 */

import { api } from "../api.js";

const { createApp, ref, onMounted, nextTick } = Vue;

const app = createApp({
  setup() {
    const books = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const qrCodesGenerated = ref(false);

    // Get selected book IDs from URL params
    const getSelectedBookIds = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const idsParam = urlParams.get("ids");
      if (idsParam) {
        return idsParam.split(",").filter(Boolean);
      }
      return null; // null means print all
    };

    // Load books from API
    const loadBooks = async () => {
      loading.value = true;
      error.value = null;

      const result = await api.getAvailableBooks();

      if (result.success) {
        const allBooks = Array.isArray(result.data) ? result.data : [];
        const selectedIds = getSelectedBookIds();

        // Filter by selected IDs if provided
        if (selectedIds && selectedIds.length > 0) {
          books.value = allBooks.filter((book) =>
            selectedIds.includes(book.id)
          );
        } else {
          // Print all books
          books.value = allBooks;
        }

        // Sort by book number
        books.value.sort((a, b) => {
          if (!a.number && !b.number) return 0;
          if (!a.number) return 1;
          if (!b.number) return -1;

          const aParts = a.number.split("-");
          const bParts = b.number.split("-");

          const aPrefix = aParts[0] || "";
          const bPrefix = bParts[0] || "";

          if (aPrefix !== bPrefix) {
            return aPrefix.localeCompare(bPrefix);
          }

          const aNumber = parseInt(aParts[1]) || 0;
          const bNumber = parseInt(bParts[1]) || 0;

          return aNumber - bNumber;
        });

        // Generate QR codes after books are loaded
        await nextTick();
        generateAllQRCodes();
      } else {
        error.value = result.error || "Failed to load books";
      }

      loading.value = false;
    };

    // Generate QR code for a book
    const generateQRCode = (bookId, containerId) => {
      if (!window.QRCode) {
        console.error("QRCode library not loaded");
        return;
      }

      const container = document.getElementById(containerId);
      if (!container) {
        console.error("Container not found:", containerId);
        return;
      }

      // Clear existing content
      container.innerHTML = "";

      // Build URL with query string
      const baseUrl = window.location.origin + window.location.pathname.replace('print.html', 'index.html');
      const qrUrl = `${baseUrl}?book_id=${bookId}`;

      // Generate QR code
      new QRCode(container, {
        text: qrUrl,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    };

    // Generate all QR codes
    const generateAllQRCodes = () => {
      setTimeout(() => {
        books.value.forEach((book) => {
          generateQRCode(book.id, `qr-${book.id}`);
        });
        qrCodesGenerated.value = true;

        // Auto-trigger print dialog after a short delay
        setTimeout(() => {
          window.print();
        }, 500);
      }, 100);
    };

    // Print again
    const printAgain = () => {
      window.print();
    };

    // Go back to main page
    const goBack = () => {
      window.location.href = "index.html";
    };

    onMounted(async () => {
      await loadBooks();
    });

    return {
      books,
      loading,
      error,
      qrCodesGenerated,
      printAgain,
      goBack,
    };
  },

  template: `
    <div class="print-container">
      <!-- Screen-only header (hidden in print) -->
      <div class="print-header no-print">
        <h1>列印書籍 QR Code</h1>
        <div class="print-actions">
          <button @click="printAgain" class="btn btn-primary" :disabled="!qrCodesGenerated">
            🖨️ 列印
          </button>
          <button @click="goBack" class="btn btn-secondary">
            ← 返回
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="print-loading no-print">
        <p>載入書籍資料中...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="print-error no-print">
        <p class="text-error">{{ error }}</p>
        <button @click="goBack" class="btn btn-secondary">返回</button>
      </div>

      <!-- Print grid -->
      <div v-else class="print-grid">
        <div
          v-for="book in books"
          :key="book.id"
          class="print-card"
        >
          <div class="print-card-inner">
            <div class="qr-container" :id="'qr-' + book.id"></div>
            <div class="book-info">
              <h3 class="book-name">{{ book.name }}</h3>
              <p class="book-number">{{ book.number }}</p>
              <p v-if="book.author" class="book-author">{{ book.author }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Print instructions (screen only) -->
      <div v-if="!loading && !error" class="print-instructions no-print">
        <h2>列印說明</h2>
        <ul>
          <li>建議使用 A4 紙張</li>
          <li>設定方向：直向</li>
          <li>邊界：標準或窄邊</li>
          <li>列印後可沿虛線裁切</li>
        </ul>
      </div>
    </div>
  `,
});

app.mount("#app");
