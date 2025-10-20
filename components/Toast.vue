<template>
  <div v-if="message" :class="['toast', 'toast-' + type]">
    <p class="toast-message">{{ message }}</p>
    <button @click="emit('close')" class="toast-close" aria-label="Close">
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string | null
  type?: 'success' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
  message: null,
  type: 'success'
})

const emit = defineEmits<{
  close: []
}>()

// Auto-dismiss after 5 seconds
watch(() => props.message, (newMessage) => {
  if (newMessage) {
    setTimeout(() => {
      emit('close')
    }, 5000)
  }
})
</script>
