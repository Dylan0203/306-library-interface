<template>
  <nav class="navigation">
    <div class="nav-container">
      <h2 class="nav-title">306 Library System</h2>
      <ul class="nav-links">
        <li>
          <NuxtLink
            to="/"
            :class="{ active: current === 'available' }"
            class="nav-link"
          >
            Available Books
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/borrowed"
            :class="{ active: current === 'borrowed' }"
            class="nav-link"
          >
            Borrowed Books
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  current: 'available' | 'borrowed'
}>()
</script>
