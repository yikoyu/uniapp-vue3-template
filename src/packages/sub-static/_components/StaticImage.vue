<!-- packages/sub-static/components/SharedImage.vue -->
<script setup lang="ts">
import type { ImageMode, ImageOnError, ImageOnLoad } from '@uni-helper/uni-types'

import type { StyleValue } from 'vue'
import { computed, defineProps } from 'vue'

/**
 * 引入分包本地图片（组件和图片在同一分包，可正常引用）
 * 主包应用分包图片，即使设置了 preloadRule 也会出现 图片无法显示问题
 */
import AvatarPng from '../static/avatar.png'
// 若有多个图片，可在这里统一引入，或通过props传递图片名称匹配

const props = defineProps<{
  /** 图片资源地址 */
  imageType: ImageSrcType
  /**
   * 图片裁剪、缩放的模式
   *
   * ScaleToFill 不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素
   *
   * AspectFit 保持纵横比缩放图片，使图片的长边能完全显示出来，可以完整地将图片显示出来
   *
   * AspectFill 保持纵横比缩放图片，只保证图片的短边能完全显示出来，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取
   *
   * WidthFix 宽度不变，高度自动变化，保持原图宽高比不变
   *
   * HeightFix 高度不变，宽度自动变化，保持原图宽高比不变
   *
   * Top 不缩放图片，只显示图片的顶部区域
   *
   * Bottom 不缩放图片，只显示图片的底部区域
   *
   * Center 不缩放图片，只显示图片的中间区域
   *
   * Left 不缩放图片，只显示图片的左边区域
   *
   * Right 不缩放图片，只显示图片的右边区域
   *
   * Top left 不缩放图片，只显示图片的左上边区域
   *
   * Top right 不缩放图片，只显示图片的右上边区域
   *
   * Bottom left 不缩放图片，只显示图片的左下边区域
   *
   * Bottom right 不缩放图片，只显示图片的右下边区域
   *
   * 默认为 scaleToFill
   */
  mode?: ImageMode
  /**
   * 是否开启图片懒加载
   *
   * 只对 page 与 scroll-view 下的 image 有效
   *
   * 默认为 false
   */
  lazyLoad?: boolean
  /**
   * 是否使用图片显示动画效果
   *
   * 默认为 true
   */
  fadeShow?: boolean
  /**
   * 在系统不支持 webp 的情况下是否单独启用 webp
   *
   * 默认为 false
   */
  webp?: boolean
  /**
   * 是否开启长按图片显示识别小程序码菜单
   *
   * 默认为 false
   */
  showMenuByLongpress?: boolean
  /**
   * 是否能拖动图片
   *
   * 默认为 true
   */
  draggable?: boolean
  /** 图片加载错误时触发 */
  onError?: ImageOnError
  /** 图片加载完毕时触发 */
  onLoad?: ImageOnLoad
  customClass?: any
  customStyle?: StyleValue
}>()

type ImageSrcType = 'AvatarPng'

// 计算图片地址（匹配不同图片）
const imageSrc = computed(() => {
  const _imageType = {
    AvatarPng,
    default: '',
  }

  return _imageType[props.imageType] || _imageType.default
})
</script>

<template>
  <image
    :src="imageSrc"
    :image-type="imageType"
    :mode="mode"
    :lazy-load="lazyLoad"
    :fade-show="fadeShow"
    :webp="webp"
    :show-menu-by-longpress="showMenuByLongpress"
    :draggable="draggable"
    :on-error="onError"
    :on-load="onLoad"
    :class="customClass"
    :style="customStyle"
  />
</template>

<!-- <style lang="scss" scoped></style> -->
