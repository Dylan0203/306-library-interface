<template>
  <div class="print-container">
    <div class="print-header">
      <h1>306 Library - Book QR Codes</h1>
      <p class="print-date">列印日期: {{ printDate }}</p>
      <p class="print-info">共 {{ books.length }} 本書</p>
    </div>

    <div v-if="loading" class="print-loading">載入中...</div>

    <div v-else-if="books.length > 0" class="qrcode-grid">
      <div v-for="book in books" :key="book.id" class="qrcode-item">
        <div class="qrcode-wrapper">
          <canvas :ref="(el) => setCanvasRef(book.id, el)"></canvas>
        </div>
        <div class="book-info">
          <h3 class="book-name">{{ book.name }}</h3>
          <p v-if="book.number" class="book-number">{{ book.number }}</p>
          <p v-if="book.author" class="book-author">{{ book.author }}</p>
        </div>
      </div>
    </div>

    <div v-else class="print-empty">無可列印的書籍</div>
  </div>
</template>

<script setup lang="ts">
import QRCode from "qrcode";

definePageMeta({
  layout: "print",
});

interface Book {
  id: string;
  name: string;
  number?: string;
  author?: string;
}

useHead({
  title: "Print Book QR Codes - Library System",
});

const route = useRoute();
const api = useApi();

const books = ref<Book[]>([]);
const loading = ref(true);
const printDate = new Date().toLocaleDateString("zh-TW");
const canvasRefs = new Map<string, HTMLCanvasElement>();

const setCanvasRef = (bookId: string, el: any) => {
  if (el) {
    canvasRefs.set(bookId, el as HTMLCanvasElement);
  }
};

const generateQRCodes = async () => {
  for (const book of books.value) {
    const canvas = canvasRefs.get(book.id);
    if (!canvas) continue;

    try {
      // Build URL with book ID
      const baseUrl = window.location.origin;
      const qrUrl = `${baseUrl}/?book_id=${book.id}`;

      // Generate QR code on canvas
      await QRCode.toCanvas(canvas, qrUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      });
    } catch (error) {
      console.error(`Failed to generate QR code for book ${book.id}:`, error);
    }
  }

  // Auto-trigger print dialog after all QR codes are generated
  setTimeout(() => {
    window.print();
  }, 500);
};

onMounted(async () => {
  const ids = route.query.ids as string | undefined;

  // Get available books (not borrowed books)
  const result = await api.getAvailableBooks();

  if (result.success) {
    let bookList = Array.isArray(result.data) ? result.data : [result.data];

    // Filter by IDs if provided
    if (ids) {
      const idArray = ids.split(",");
      bookList = bookList.filter((book: any) => idArray.includes(book.id));
    }

    books.value = bookList.map((book: any) => ({
      id: book.id,
      name: book.name || "未知書名",
      number: book.number || "",
      author: book.author || "",
    }));
  }

  loading.value = false;

  // Wait for next tick to ensure canvases are rendered
  await nextTick();

  // Generate QR codes
  if (books.value.length > 0) {
    await generateQRCodes();
  }
});
</script>

<style scoped>
.print-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.print-header {
  margin-bottom: 2rem;
  border-bottom: 2px solid #333;
  padding-bottom: 1rem;
  text-align: center;
}

.print-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
}

.print-date,
.print-info {
  color: #666;
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.print-loading,
.print-empty {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
}

.qrcode-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  padding: 1rem;
}

.qrcode-item {
  break-inside: avoid;
  page-break-inside: avoid;
  border: 2px solid #333;
  padding: 1rem;
  text-align: center;
  background: #fff;
}

.qrcode-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.qrcode-wrapper canvas {
  max-width: 100%;
  height: auto;
}

.book-info {
  border-top: 1px solid #ddd;
  padding-top: 0.75rem;
}

.book-name {
  font-size: 1rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.book-number {
  font-size: 0.9rem;
  color: #666;
  margin: 0.25rem 0;
}

.book-author {
  font-size: 0.85rem;
  color: #999;
  margin: 0.25rem 0;
  font-style: italic;
}

@media print {
  .print-container {
    padding: 0;
  }

  .print-header {
    display: none;
  }

  .qrcode-grid {
    gap: 1.5rem;
  }

  .qrcode-item {
    border: 1px solid #000;
  }
}

@media print and (max-width: 600px) {
  .qrcode-grid {
    grid-template-columns: 1fr;
  }
}
</style>
