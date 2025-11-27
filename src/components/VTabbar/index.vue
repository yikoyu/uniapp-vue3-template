<script lang="ts" setup>
import { uniNav } from '@/utils'

const props = withDefaults(defineProps<{
  value: 'home' | 'my'
  fixed?: boolean
  safeAreaInsetBottom?: boolean
  placeholder?: boolean
}>(), {
  fixed: false,
  safeAreaInsetBottom: false,
  placeholder: false,
})

const tabs = {
  home: '/pages/home/home',
  my: '/pages/my/index',
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
    <WdTabbarItem title="房态" name="home" icon="home" />
    <WdTabbarItem title="我的" name="my" icon="user" />
  </WdTabbar>
</template>

<!-- <style lang="scss" scoped></style> -->
