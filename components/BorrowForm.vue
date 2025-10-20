<template>
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    leave-active-class="transition-opacity duration-200 ease-in"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div v-if="displayBook" :class="MODAL_OVERLAY" @click.self="handleCancel">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 scale-90"
        leave-to-class="opacity-0 scale-90"
      >
        <div v-if="displayBook" :class="MODAL_CONTENT">
          <div :class="MODAL_HEADER">
            <h2 class="m-0 text-2xl">Borrow Book</h2>
            <button
              @click="handleCancel"
              :class="MODAL_CLOSE"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div :class="MODAL_BODY">
            <div :class="bookInfoClasses">
              <h3 class="m-0 mb-1 text-xl">{{ displayBook.name }}</h3>
              <p v-if="displayBook.number" :class="TEXT_LIGHT">
                {{ displayBook.number }}
              </p>
              <p v-if="displayBook.author" :class="TEXT_LIGHT">
                by {{ displayBook.author }}
              </p>
            </div>
            <form @submit.prevent="validateAndSubmit">
              <div :class="FORM_GROUP">
                <label for="borrower-name" :class="FORM_LABEL"
                  >Your Name or ID</label
                >
                <input
                  id="borrower-name"
                  v-model="borrowerName"
                  type="text"
                  :class="FORM_INPUT"
                  placeholder="Enter your name or ID"
                  maxlength="100"
                  readonly
                />
                <p v-if="error" :class="FORM_ERROR">{{ error }}</p>
              </div>
              <div :class="FORM_ACTIONS">
                <button
                  type="button"
                  @click="handleCancel"
                  :class="[btnClasses, BTN_SECONDARY]"
                  :disabled="loading"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :class="[btnClasses, BTN_PRIMARY]"
                  :disabled="loading"
                >
                  {{ loading ? "Borrowing..." : "Confirm Borrow" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {
  MODAL_OVERLAY,
  MODAL_CONTENT,
  MODAL_HEADER,
  MODAL_BODY,
  MODAL_CLOSE,
  FORM_GROUP,
  FORM_LABEL,
  FORM_INPUT,
  FORM_ERROR,
  FORM_ACTIONS,
  BTN_BASE,
  BTN_PRIMARY,
  BTN_SECONDARY,
  TEXT_LIGHT,
} from "~/constants/styles";

interface Book {
  id: string;
  name: string;
  number?: string;
  author?: string;
}

interface Props {
  book?: Book | null;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  book: null,
  loading: false,
});

const emit = defineEmits<{
  confirm: [data: { bookId: string; borrowerName: string }];
  cancel: [];
  show: [book: Book];
}>();

const borrowerName = ref("");
const error = ref<string | null>(null);
const internalBook = ref<Book | null>(null);

const { currentUser, isLoggedIn, signInWithGoogle } = useAuth();

// Show book internally or trigger login
const showForm = async (book: Book) => {
  if (!isLoggedIn.value) {
    try {
      await signInWithGoogle();
      internalBook.value = book;
    } catch (err) {
      console.error("Login failed:", err);
      error.value = "請先登入 306 員工 Google 帳號才能借書";
    }
  } else {
    internalBook.value = book;
  }
};

// Computed book that uses internal state if prop is not provided
const displayBook = computed(() => props.book || internalBook.value);

// Expose showForm method to parent
defineExpose({
  showForm,
});

// Component-specific styles
const bookInfoClasses =
  "mb-6 pb-4 border-b border-gray-200 dark:border-gray-700";
const btnClasses = `${BTN_BASE} flex-1`;

// Watch displayBook to auto-fill form
watch(displayBook, (newBook) => {
  if (newBook) {
    error.value = null;
    if (currentUser.value) {
      borrowerName.value = currentUser.value.name || currentUser.value.email;
    } else {
      borrowerName.value = "";
    }
  }
});

const handleCancel = () => {
  internalBook.value = null;
  error.value = null;
  emit("cancel");
};

const validateAndSubmit = () => {
  // Validate borrower name
  if (!borrowerName.value.trim()) {
    error.value = "Please enter your name or ID";
    return;
  }

  // Emit confirm event with book ID and borrower name
  emit("confirm", {
    bookId: displayBook.value!.id,
    borrowerName: borrowerName.value.trim(),
  });

  // Clear internal state after submit
  internalBook.value = null;
};
</script>
