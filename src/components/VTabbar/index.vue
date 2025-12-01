<script lang="ts" setup>
import { uniNav } from '@/utils'

const props = withDefaults(defineProps<{
  value: string
  fixed?: boolean
  safeAreaInsetBottom?: boolean
  placeholder?: boolean
}>(), {
  fixed: false,
  safeAreaInsetBottom: false,
  placeholder: false,
})

const tabs = {
  'pages/home/home': '/pages/home/home',
  'pages/my/index': '/pages/my/index',
}

function onChange({ value }) {
  if (props.value === value)
    return

  const url = tabs[value]
  if (!url)
    return

  uniNav.reLaunch(url)
}
</script>

<template>
  <WdTabbar :model-value="value" safe-area-inset-bottom placeholder fixed @change="onChange">
    <WdTabbarItem title="房态" name="pages/home/home" icon="home" />
    <WdTabbarItem title="我的" name="pages/my/index" icon="user" />
  </WdTabbar>
</template>

<!-- <style lang="scss" scoped></style> -->
