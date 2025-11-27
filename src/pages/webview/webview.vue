<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

definePage({
  style: {
    navigationBarTitleText: '',
  },
})

const src = ref<string | null>(null)

onLoad((query) => {
  if (query?.src) {
    console.log('访问外部页面 :>> ', query.src)
    src.value = decodeURIComponent(query.src)
  }
})
</script>

<template>
  <web-view v-if="src" :src="src" />
</template>
