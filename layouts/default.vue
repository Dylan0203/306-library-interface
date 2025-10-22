<template>
  <div class="flex flex-col min-h-screen">
    <Navigation />
    <slot />
    <Footer />
  </div>
</template>

<script setup lang="ts">
// Default layout with navigation and footer
// All pages using this layout will have the Navigation and Footer components
</script>
