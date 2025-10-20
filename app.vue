<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// This is the root component of the Nuxt app
// NuxtLayout wraps pages with the default layout (or page-specific layout)
// Pages will be rendered via <NuxtPage />
</script>

<style>
/* Global base styles */
body {
  background-color: rgb(249 250 251);
  color: rgb(17 24 39);
  min-width: 320px;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    sans-serif;
  line-height: 1.6;
}

/* Dark mode - Nuxt colorMode has priority over system preference */
html.dark body {
  background-color: rgb(17 24 39) !important;
  color: rgb(243 244 246) !important;
}

/* Light mode - explicit light mode styles */
html.light body {
  background-color: rgb(249 250 251) !important;
  color: rgb(17 24 39) !important;
}

/* Skip link for accessibility */
.skip-link {
  position: absolute;
  top: -2.5rem;
  left: 0;
  background-color: rgb(37 99 235);
  color: white;
  padding: 1rem 1rem;
  z-index: 9999;
  text-decoration: none;
}

.skip-link:focus {
  top: 0;
}

/* Responsive adjustments for small screens */
@media (max-width: 480px) {
  /* Reduce padding on small screens */
  [class*="p-4"] {
    padding: 0.75rem;
  }

  /* Button sizing */
  button[class*="px-5"] {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    font-size: 0.8125rem;
  }
}
</style>
