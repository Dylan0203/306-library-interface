<template>
  <div class="mt-4">
    <!-- Loading State with Skeleton -->
    <div v-if="loading" :class="bookGridClasses">
      <div v-for="n in 6" :key="n" :class="skeletonCardClasses">
        <div :class="skeletonTitleClasses"></div>
        <div :class="skeletonTextClasses"></div>
        <div :class="skeletonButtonClasses"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" :class="errorClasses">
      <p :class="TEXT_ERROR">{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="books.length === 0" :class="EMPTY_STATE">
      <p :class="EMPTY_STATE_TEXT">No books currently {{ type }}</p>
    </div>

    <!-- Books Grid -->
    <div v-else :class="bookGridClasses" role="list">
      <article
        v-for="book in books"
        :key="book.id"
        :class="getBookCardClasses(book.id)"
        role="listitem"
      >
        <div class="flex justify-between mb-2">
          <!-- Checkbox for selection -->
          <label
            v-if="showCheckbox"
            class="relative inline-flex items-center cursor-pointer select-none"
            :for="'checkbox-' + book.id"
          >
            <input
              type="checkbox"
              :id="'checkbox-' + book.id"
              :checked="isSelected(book.id)"
              @change="toggleSelection(book.id)"
              class="peer absolute opacity-0 cursor-pointer h-0 w-0 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              :aria-label="'Select ' + book.name"
            />
            <span
              class="relative h-5 w-5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded transition-all duration-200 peer-hover:border-blue-600 peer-hover:bg-blue-50 dark:peer-hover:bg-gray-700 peer-checked:bg-blue-600 peer-checked:border-blue-600 after:content-[''] after:absolute after:hidden after:left-[6px] after:top-[2px] after:w-1 after:h-[9px] after:border-white after:border-r-2 after:border-b-2 after:rotate-45 peer-checked:after:block"
            ></span>
          </label>

          <!-- QR Code button -->
          <button
            v-if="showQRButton"
            @click="emit('show-qrcode', book)"
            :class="qrButtonClasses"
            :aria-label="'Show QR Code for ' + book.name"
            title="顯示 QR Code"
          >
            📱
          </button>
        </div>

        <div class="flex-grow">
          <h3
            class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 break-words"
            :title="book.name"
          >
            {{ book.name }}
          </h3>
          <p
            v-if="book.number"
            class="text-gray-500 dark:text-gray-400 text-xs mb-2 font-mono"
          >
            {{ book.number }}
          </p>
          <p
            v-if="book.author"
            class="text-gray-600 dark:text-gray-300 text-sm mb-2 truncate break-words"
            :title="book.author"
          >
            by {{ book.author }}
          </p>

          <!-- Show borrower name for borrowed books -->
          <p
            v-if="type === 'borrowed' && book.borrowerName"
            class="text-blue-600 dark:text-blue-400 text-sm mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 truncate break-words"
            :title="'Borrowed by: ' + book.borrowerName"
          >
            借閱者：<strong>{{ book.borrowerName }}</strong>
          </p>

          <!-- Show borrowed date and due date -->
          <div
            v-if="type === 'borrowed' && book.borrowedAt"
            class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
          >
            <p class="text-gray-500 dark:text-gray-400 text-xs my-1">
              借閱日期：{{ formatDate(book.borrowedAt) }}
            </p>
            <p
              :class="[
                'text-xs font-semibold my-1',
                isOverdue(book.borrowedAt)
                  ? 'text-red-600 dark:text-red-400 font-bold'
                  : 'text-blue-600 dark:text-blue-400',
              ]"
            >
              應歸還：{{ formatDueDate(book.borrowedAt) }}
            </p>
          </div>
        </div>

        <div class="mt-4">
          <!-- Borrow button for available books -->
          <button
            v-if="type === 'available' && !showCheckbox"
            @click="emit('borrow', book)"
            :class="[btnBaseClasses, BTN_PRIMARY]"
            :disabled="loading"
            :aria-label="'Borrow ' + book.name"
          >
            Borrow
          </button>

          <!-- Return button for borrowed books -->
          <button
            v-if="type === 'borrowed' && showReturnButton"
            @click="emit('return', book)"
            :class="[btnBaseClasses, BTN_SECONDARY]"
            :disabled="loading"
            :aria-label="'Return ' + book.name"
          >
            歸還
          </button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CARD_BASE,
  CARD_HOVER,
  SKELETON_CARD,
  BTN_BASE,
  BTN_PRIMARY,
  BTN_SECONDARY,
  ERROR_MESSAGE,
  EMPTY_STATE,
  EMPTY_STATE_TEXT,
  TEXT_ERROR,
} from "~/constants/styles";

interface Book {
  id: string;
  name: string;
  number?: string;
  author?: string;
  borrowerName?: string;
  borrowedAt?: string;
}

interface Props {
  books: Book[];
  type: "available" | "borrowed";
  loading?: boolean;
  error?: string | null;
  showReturnButton?: boolean;
  showQRButton?: boolean;
  showCheckbox?: boolean;
  selectedBooks?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  showReturnButton: true,
  showQRButton: false,
  showCheckbox: false,
  selectedBooks: () => [],
});

const emit = defineEmits<{
  borrow: [book: Book];
  return: [book: Book];
  "show-qrcode": [book: Book];
  "selection-change": [selectedBooks: string[]];
}>();

// Component-specific style constants
const bookGridClasses =
  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";
const bookCardBase = `${CARD_BASE} ${CARD_HOVER} p-4 flex flex-col justify-between relative`;
const errorClasses = ERROR_MESSAGE;

// Skeleton styles with custom shimmer animation
const skeletonBaseClasses =
  "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-lg animate-[shimmer_1.5s_ease-in-out_infinite]";
const skeletonCardClasses = SKELETON_CARD;
const skeletonTitleClasses = `${skeletonBaseClasses} h-6 w-4/5 mb-2`;
const skeletonTextClasses = `${skeletonBaseClasses} h-4 w-3/5 mb-2`;
const skeletonButtonClasses = `${skeletonBaseClasses} h-10 w-full mt-4`;

const qrButtonClasses =
  "bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 cursor-pointer text-xl leading-none transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-blue-600 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2";

const btnBaseClasses = BTN_BASE;

const getBookCardClasses = (bookId: string): string => {
  const baseClasses = bookCardBase;
  const selectedClass =
    props.showCheckbox && isSelected(bookId)
      ? "ring-2 ring-blue-600 bg-blue-50 dark:bg-blue-950 shadow-[0_4px_6px_-1px_rgba(37,99,235,0.1)]"
      : "";
  return `${baseClasses} ${selectedClass}`.trim();
};

const isSelected = (bookId: string): boolean => {
  return props.selectedBooks.includes(bookId);
};

const toggleSelection = (bookId: string) => {
  const selected = [...props.selectedBooks];
  const index = selected.indexOf(bookId);

  if (index > -1) {
    selected.splice(index, 1);
  } else {
    selected.push(bookId);
  }

  emit("selection-change", selected);
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (e) {
    return "";
  }
};

const formatDueDate = (borrowDateString: string): string => {
  try {
    const borrowDate = new Date(borrowDateString);
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 14);

    return dueDate.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (e) {
    return "";
  }
};

const isOverdue = (borrowDateString: string): boolean => {
  try {
    const borrowDate = new Date(borrowDateString);
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 14);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    return today > dueDate;
  } catch (e) {
    return false;
  }
};
</script>

<style>
/* Custom shimmer animation for skeleton loaders */
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
