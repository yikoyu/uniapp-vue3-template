<script setup lang="ts">
import { setNotifyDefaultOptions } from '@wot-ui/ui'
import { useNavBarHeight } from '@/components/NavBar/useNavBarHeight'

const { mainHeight } = useNavBarHeight()

onMounted(() => {
  setNotifyDefaultOptions({
    safeHeight: mainHeight.value,
  })
})
</script>

<template>
  <KuRootView />

  <WdToast />
  <WdDialog />
  <WdNotify />
</template>
