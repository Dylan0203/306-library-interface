<template>
  <nav
    class="bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-700 shadow-sm"
  >
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap items-center justify-between py-4">
        <!-- Logo/Title -->
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          306 Library System
        </h2>

        <!-- Navigation Links -->
        <ul class="flex gap-6 items-center">
          <li>
            <NuxtLink
              to="/"
              :class="[
                'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium',
                current === 'available'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : '',
              ]"
            >
              Available Books
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/borrowed"
              :class="[
                'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium',
                current === 'borrowed'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : '',
              ]"
            >
              Borrowed Books
            </NuxtLink>
          </li>
        </ul>

        <!-- Actions: Dark Mode Toggle + Auth -->
        <div class="flex items-center gap-3">
          <!-- Dark Mode Toggle -->
          <UButton
            :icon="
              colorMode.value === 'dark'
                ? 'i-heroicons-moon-20-solid'
                : 'i-heroicons-sun-20-solid'
            "
            color="gray"
            variant="ghost"
            aria-label="Toggle dark mode"
            @click="toggleDarkMode"
          />

          <!-- Auth Section -->
          <div v-if="isLoggedIn" class="flex items-center gap-3">
            <img
              v-if="userPicture"
              :src="userPicture"
              :alt="userName"
              class="w-8 h-8 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
            />
            <span
              class="text-sm font-medium hidden md:inline text-gray-900 dark:text-white"
            >
              {{ userName }}
            </span>
            <UButton
              color="gray"
              variant="ghost"
              size="sm"
              @click="handleLogout"
            >
              登出
            </UButton>
          </div>
          <UButton v-else color="primary" size="sm" @click="handleLogin">
            Google 登入
          </UButton>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute();
const colorMode = useColorMode();
const { isLoggedIn, userName, userPicture, signInWithGoogle, signOut } =
  useAuth();

// Auto-detect current page from route
const current = computed(() => {
  if (route.path === "/") return "available";
  if (route.path === "/borrowed") return "borrowed";
  return "";
});

const toggleDarkMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const handleLogin = async () => {
  try {
    await signInWithGoogle();
  } catch (error) {
    console.error("Login failed:", error);
    alert("登入失敗,請稍後再試");
  }
};

const handleLogout = () => {
  if (confirm("確定要登出嗎?")) {
    signOut();
  }
};
</script>
