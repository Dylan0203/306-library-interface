/**
 * QRCodeModal Component
 * Displays a modal with a QR code for a book
 */
export const QRCodeModal = {
  props: {
    book: {
      type: Object,
      default: null,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close"],
  data() {
    return {
      qrCodeDataUrl: "",
    };
  },
  watch: {
    show(newValue) {
      if (newValue && this.book) {
        this.$nextTick(() => {
          this.generateQRCode();
        });
      }
    },
    book() {
      if (this.show && this.book) {
        this.$nextTick(() => {
          this.generateQRCode();
        });
      }
    },
  },
  methods: {
    generateQRCode() {
      if (!this.book || !window.QRCode) {
        return;
      }

      // Build URL with query string
      const baseUrl = window.location.origin + window.location.pathname;
      const qrUrl = `${baseUrl}?book_id=${this.book.id}`;

      // Create a temporary container
      const tempDiv = document.createElement("div");

      // Generate QR code
      const qr = new QRCode(tempDiv, {
        text: qrUrl,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });

      // Get the generated image
      setTimeout(() => {
        const canvas = tempDiv.querySelector("canvas");
        if (canvas) {
          this.qrCodeDataUrl = canvas.toDataURL("image/png");
        }
      }, 100);
    },
    closeModal() {
      this.$emit("close");
    },
    handleBackdropClick(event) {
      if (event.target === event.currentTarget) {
        this.closeModal();
      }
    },
  },
  template: `
    <transition name="modal">
      <div
        v-if="show && book"
        class="modal-backdrop"
        @click="handleBackdropClick"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qrcode-modal-title"
      >
        <div class="modal-content qrcode-modal">
          <div class="modal-header">
            <h2 id="qrcode-modal-title" class="modal-title">
              書籍 QR Code
            </h2>
            <button
              @click="closeModal"
              class="btn-close"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          <div class="modal-body">
            <div class="qrcode-info">
              <h3 class="qrcode-book-name">{{ book.name }}</h3>
              <p v-if="book.number" class="qrcode-book-number">{{ book.number }}</p>
            </div>
            <div class="qrcode-container">
              <img
                v-if="qrCodeDataUrl"
                :src="qrCodeDataUrl"
                alt="QR Code"
                class="qrcode-image"
              />
              <div v-else class="qrcode-loading">
                生成 QR Code 中...
              </div>
            </div>
            <p class="qrcode-hint">
              掃描此 QR Code 可直接開啟此書籍頁面
            </p>
          </div>
          <div class="modal-footer">
            <button @click="closeModal" class="btn btn-secondary">
              關閉
            </button>
          </div>
        </div>
      </div>
    </transition>
  `,
};
