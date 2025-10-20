<template>
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    leave-active-class="transition-opacity duration-200 ease-in"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show && book"
      :class="MODAL_OVERLAY"
      @click="handleBackdropClick"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qrcode-modal-title"
    >
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 scale-90"
        leave-to-class="opacity-0 scale-90"
      >
        <div v-if="show && book" :class="modalContentClasses">
          <div :class="MODAL_HEADER">
            <h2 id="qrcode-modal-title" class="text-xl font-semibold m-0">
              書籍 QR Code
            </h2>
            <button
              @click="emit('close')"
              :class="MODAL_CLOSE"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <div :class="MODAL_BODY">
            <div class="mb-4 text-center">
              <h3
                class="text-lg font-semibold m-0 mb-1 text-gray-900 dark:text-white"
              >
                {{ book.name }}
              </h3>
              <p
                v-if="book.number"
                class="text-sm text-gray-500 dark:text-gray-400 m-0 font-mono"
              >
                {{ book.number }}
              </p>
            </div>

            <div
              class="flex justify-center items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg min-h-[280px]"
            >
              <img
                v-if="qrCodeDataUrl"
                :src="qrCodeDataUrl"
                alt="QR Code"
                class="max-w-full h-auto rounded-lg"
              />
              <div v-else class="text-gray-500 dark:text-gray-400 text-center">
                生成 QR Code 中...
              </div>
            </div>

            <p
              class="text-center text-gray-500 dark:text-gray-400 text-sm mt-4 mb-0"
            >
              掃描此 QR Code 可直接開啟此書籍頁面
            </p>
          </div>

          <div :class="MODAL_FOOTER">
            <button @click="emit('close')" :class="[btnClasses, BTN_SECONDARY]">
              關閉
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import QRCode from "qrcode";
import {
  MODAL_OVERLAY,
  MODAL_HEADER,
  MODAL_BODY,
  MODAL_FOOTER,
  MODAL_CLOSE,
  BTN_BASE,
  BTN_SECONDARY,
} from "~/constants/styles";

interface Book {
  id: string;
  name: string;
  number?: string;
}

interface Props {
  book?: Book | null;
  show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  book: null,
  show: false,
});

const emit = defineEmits<{
  close: [];
}>();

const qrCodeDataUrl = ref("");

// Component-specific styles
const modalContentClasses =
  "bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto";
const btnClasses = `${BTN_BASE} w-auto min-w-[100px]`;

// Generate QR code when book or show changes
watch([() => props.show, () => props.book], async ([newShow, newBook]) => {
  if (newShow && newBook) {
    await nextTick();
    await generateQRCode();
  }
});

const generateQRCode = async () => {
  if (!props.book) return;

  try {
    // Build URL with query string
    const baseUrl = window.location.origin + window.location.pathname;
    const qrUrl = `${baseUrl}?book_id=${props.book.id}`;

    // Generate QR code as data URL
    qrCodeDataUrl.value = await QRCode.toDataURL(qrUrl, {
      width: 256,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    });
  } catch (error) {
    console.error("Failed to generate QR code:", error);
  }
};

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    emit("close");
  }
};
</script>
