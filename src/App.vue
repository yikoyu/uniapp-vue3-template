<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { z } from 'zod/mini'

onLaunch(() => {
  z.config(z.locales.zhCN())
  console.log('App Launch')
})

onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
/* stylelint-disable-next-line selector-type-no-unknown */
:root, page {
  --wot-color-theme: #165dff;
  --wot-button-large-radius: 8rpx;
  --wot-button-plain-bg-color: rgba(#fff, 0%);
  --wot-button-success-bg-color: #00b42a;

  height: 100%;

  // #ifndef H5
  background-color: #f2f3f5;
  // #endif
}

html {
  background-color: #f2f3f5;
}
</style>
