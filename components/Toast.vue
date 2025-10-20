<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-200 ease-in"
    enter-from-class="translate-x-full opacity-0"
    leave-to-class="translate-x-full opacity-0"
  >
    <div v-if="message" :class="getToastClasses()">
      <p :class="TOAST_MESSAGE">{{ message }}</p>
      <button @click="emit('close')" :class="TOAST_CLOSE" aria-label="Close">
        ×
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {
  TOAST_BASE,
  TOAST_SUCCESS,
  TOAST_ERROR,
  TOAST_MESSAGE,
  TOAST_CLOSE,
} from "~/constants/styles";

interface Props {
  message?: string | null;
  type?: "success" | "error";
}

const props = withDefaults(defineProps<Props>(), {
  message: null,
  type: "success",
});

const emit = defineEmits<{
  close: [];
}>();

const getToastClasses = (): string => {
  const typeClass = props.type === "success" ? TOAST_SUCCESS : TOAST_ERROR;
  return `${TOAST_BASE} ${typeClass}`;
};

// Auto-dismiss after 5 seconds
watch(
  () => props.message,
  (newMessage) => {
    if (newMessage) {
      setTimeout(() => {
        emit("close");
      }, 5000);
    }
  },
);
</script>

<style>
/* Responsive toast for mobile */
@media (max-width: 500px) {
  .fixed.top-4.right-4 {
    left: 1rem;
    right: 1rem;
    min-width: 0;
  }
}
</style>
