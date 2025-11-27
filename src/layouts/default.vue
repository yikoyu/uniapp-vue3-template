<script setup lang="ts">
import { setNotifyDefaultOptions } from 'wot-design-uni'
import { useNavBarHeight } from '@/components/NavBar/useNavBarHeight'

const { mainHeight } = useNavBarHeight()

onMounted(() => {
  setNotifyDefaultOptions({
    safeHeight: mainHeight.value,
  })
})
</script>

<template>
  <slot />

  <WdToast />
  <WdMessageBox />
  <WdNotify />
</template>
