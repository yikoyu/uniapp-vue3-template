<script setup lang="ts">
const activeTabbar = ref('')

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] || {}

  activeTabbar.value = currentPage.route || ''
})
</script>

<template>
  <slot />

  <VTabbar :value="activeTabbar" />
</template>
