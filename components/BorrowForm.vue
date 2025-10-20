<template>
  <div v-if="book" class="modal-overlay" @click.self="emit('cancel')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Borrow Book</h2>
        <button @click="emit('cancel')" class="modal-close" aria-label="Close">
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
              readonly
            />
            <p v-if="error" class="form-error">{{ error }}</p>
          </div>
          <div class="form-actions">
            <button
              type="button"
              @click="emit('cancel')"
              class="btn btn-secondary"
              :disabled="loading"
            >
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
</template>

<script setup lang="ts">
interface Book {
  id: string
  name: string
  number?: string
  author?: string
}

interface Props {
  book?: Book | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  book: null,
  loading: false
})

const emit = defineEmits<{
  confirm: [data: { bookId: string; borrowerName: string }]
  cancel: []
}>()

const borrowerName = ref('')
const error = ref<string | null>(null)

const { currentUser } = useAuth()

// Watch book prop to auto-fill form
watch(() => props.book, (newBook) => {
  if (newBook) {
    error.value = null
    if (currentUser.value) {
      borrowerName.value = currentUser.value.name || currentUser.value.email
    } else {
      borrowerName.value = ''
    }
  }
})

const validateAndSubmit = () => {
  // Validate borrower name
  if (!borrowerName.value.trim()) {
    error.value = 'Please enter your name or ID'
    return
  }

  // Emit confirm event with book ID and borrower name
  emit('confirm', {
    bookId: props.book!.id,
    borrowerName: borrowerName.value.trim()
  })
}
</script>
