<template>
  <Transition name="modal">
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
            @click="emit('close')"
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
          <button @click="emit('close')" class="btn btn-secondary">
            關閉
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'

interface Book {
  id: string
  name: string
  number?: string
}

interface Props {
  book?: Book | null
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  book: null,
  show: false
})

const emit = defineEmits<{
  close: []
}>()

const qrCodeDataUrl = ref('')

// Generate QR code when book or show changes
watch([() => props.show, () => props.book], async ([newShow, newBook]) => {
  if (newShow && newBook) {
    await nextTick()
    await generateQRCode()
  }
})

const generateQRCode = async () => {
  if (!props.book) return

  try {
    // Build URL with query string
    const baseUrl = window.location.origin + window.location.pathname
    const qrUrl = `${baseUrl}?book_id=${props.book.id}`

    // Generate QR code as data URL
    qrCodeDataUrl.value = await QRCode.toDataURL(qrUrl, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
  } catch (error) {
    console.error('Failed to generate QR code:', error)
  }
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>
