/**
 * Toast Component
 * Displays temporary notification messages
 */

export const Toast = {
  props: {
    message: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'success',
      validator: (value) => ['success', 'error'].includes(value)
    }
  },
  emits: ['close'],
  watch: {
    message(newMessage) {
      if (newMessage) {
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          this.$emit('close');
        }, 5000);
      }
    }
  },
  template: `
    <div v-if="message" :class="['toast', 'toast-' + type]">
      <p class="toast-message">{{ message }}</p>
      <button @click="$emit('close')" class="toast-close" aria-label="Close">
        ×
      </button>
    </div>
  `
};
