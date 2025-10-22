<template>
  <footer
    class="bg-white dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 mt-auto"
  >
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <!-- Copyright -->
        <div class="text-gray-600 dark:text-gray-400 text-sm">
          © {{ currentYear }} 306 Library System. All rights reserved.
        </div>

        <!-- Links -->
        <div class="flex gap-6 items-center">
          <NuxtLink
            to="/terms-of-service"
            class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
          >
            服務條款
          </NuxtLink>
          <NuxtLink
            to="/privacy-policy"
            class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
          >
            隱私權政策
          </NuxtLink>
        </div>

        <!-- Made with love -->
        <div class="text-gray-600 dark:text-gray-400 text-sm">
          Made with ❤️ by 306 Team
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>
