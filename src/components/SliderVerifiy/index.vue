<script lang="ts" setup>
import type { SendSmsData } from './api'

import dayjs from 'dayjs'
import { computed, reactive, watch } from 'vue'
import { sendSms, sendSmsCheck } from './api'

interface Props {
  modelValue?: boolean
  phone?: string
}

interface Emits {
  (event: 'success'): void
  (event: 'update:modelValue', show: boolean): void
}

interface TouchEvent {
  touches: { clientX: number, clientY: number }[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  phone: '',
})

const emits = defineEmits<Emits>()

const INITIAL_X = 0

// 单一数据源：JS 常量 → CSS 变量 → SCSS var()
const BG_WIDTH = 600
const BG_HEIGHT = 366
const JIGSAW_WIDTH = 112
const THUMB_WIDTH = 94

const sliderVars = computed(() => ({
  '--slider-bg-width': `${BG_WIDTH}rpx`,
  '--slider-bg-height': `${BG_HEIGHT}rpx`,
  '--slider-jigsaw-width': `${JIGSAW_WIDTH}rpx`,
  '--slider-thumb-width': `${THUMB_WIDTH}rpx`,
}))

const show = computed({
  get: () => props.modelValue,
  set: val => emits('update:modelValue', val),
})

const data = reactive({
  bgImage: '', // 主图
  futuImage: '', // 缺口图
  loaded: false,
  sliderX: INITIAL_X, // 默认的位置
  startX: undefined as number | undefined, // 按下时，手指的位置
  isTrembling: false,
  status: '' as '' | 'success' | 'error',
  captchaId: '',
  errorMsg: '加载中...',
})

const captchaTrack = reactive({
  bgImageHeight: uni.upx2px(BG_HEIGHT),
  bgImageWidth: uni.upx2px(BG_WIDTH),
  sliderImageHeight: -1,
  sliderImageWidth: -1,
  startSlidingTime: undefined as Date | undefined,
  endSlidingTime: undefined as Date | undefined,
  trackList: [] as SendSmsData['captchaTrack']['trackList'],
})

/** 重置滑块状态和轨迹数据 */
function resetState() {
  data.isTrembling = false
  data.sliderX = INITIAL_X
  captchaTrack.sliderImageHeight = -1
  captchaTrack.sliderImageWidth = -1
  captchaTrack.startSlidingTime = undefined
  captchaTrack.endSlidingTime = undefined
  captchaTrack.trackList = []
}

/**
 * 处理验证失败：显示提示、触发抖动动画、重置并刷新验证码
 * @param message - 错误提示信息
 */
function handleVerifyFail(message?: string) {
  if (message) {
    uni.showToast({ title: message, icon: 'none' })
  }
  data.isTrembling = true
  data.status = 'error'
  setTimeout(() => {
    resetState()
    loadCaptcha()
  }, 700)
}

/** 加载滑块验证码：请求背景图和缺口图数据 */
async function loadCaptcha() {
  data.sliderX = INITIAL_X
  data.bgImage = ''
  data.futuImage = ''
  data.status = ''
  data.errorMsg = '加载中...'
  data.loaded = false

  try {
    const _data = await sendSmsCheck()

    if (_data.status === 200) {
      data.futuImage = _data.data?.captcha?.sliderImage || ''
      data.bgImage = _data.data?.captcha?.backgroundImage || ''
      data.captchaId = _data.data?.id || ''
      data.loaded = true
      return
    }

    setTimeout(() => {
      if (typeof _data.msg === 'string') {
        data.errorMsg = _data.msg
      }
    }, 300)
  }
  catch (err: any) {
    if (err.errMsg === 'request:fail timeout') {
      data.errorMsg = '请求超时请重试'
    }
    console.log('err :>> ', err)
    data.loaded = false
  }
}

/**
 * 手指按下：记录起始位置和时间，写入轨迹
 * @param event - 触摸事件对象
 */
function handleTouchStart(event: TouchEvent) {
  if (data.loaded && data.startX === undefined && data.sliderX === INITIAL_X) {
    captchaTrack.startSlidingTime = new Date()
    captchaTrack.trackList.push({
      x: data.sliderX,
      y: 0,
      type: 'down',
      t: Date.now() - (captchaTrack.startSlidingTime?.getTime() ?? 0),
    })
    data.startX = event.touches[0].clientX
  }
}

/**
 * 手指移动：计算滑块位置（限制在边界内），写入轨迹
 * @param event - 触摸事件对象
 */
function handleTouchMove(event: TouchEvent) {
  if (data.loaded && data.startX !== undefined) {
    const x = INITIAL_X + (event.touches[0].clientX - data.startX)
    console.log('x :>> ', x, event.touches[0].clientX)
    const [min, max] = [0, uni.upx2px(BG_WIDTH - THUMB_WIDTH)] // 确保不会超出边界【BG_WIDTH是父元素的宽度、THUMB_WIDTH是自身元素的宽度】
    data.sliderX = x < min ? min : x > max ? max : x

    captchaTrack.trackList.push({
      x: data.sliderX,
      y: 0,
      type: 'move',
      t: Date.now() - (captchaTrack.startSlidingTime?.getTime() ?? 0),
    })
  }
}

/**
 * 手指离开：提交验证请求，成功则关闭弹窗，失败则触发抖动并刷新
 */
async function handleTouchEnd() {
  if (!data.loaded || data.startX === undefined)
    return

  data.startX = undefined

  if (data.bgImage === '') {
    data.sliderX = INITIAL_X
    return
  }

  captchaTrack.endSlidingTime = new Date()
  captchaTrack.trackList.push({
    x: data.sliderX,
    y: 0,
    type: 'up',
    t: Date.now() - (captchaTrack.startSlidingTime?.getTime() ?? 0),
  })

  try {
    const _data = await sendSms({
      captchaTrack: {
        ...captchaTrack,
        endSlidingTime: dayjs(captchaTrack.endSlidingTime).format('YYYY-MM-DD HH:mm:ss'),
        startSlidingTime: dayjs(captchaTrack.startSlidingTime).format('YYYY-MM-DD HH:mm:ss'),
      },
      id: data.captchaId,
      form: { phone: props.phone },
    })

    if (_data.status === 200) {
      data.status = 'success'
      setTimeout(() => {
        show.value = false
        emits('success')
      }, 1500)
      return
    }

    handleVerifyFail(_data.msg || undefined)
  }
  catch {
    handleVerifyFail('发送验证码失败请重试')
  }
}

watch(() => props.modelValue, (val) => {
  if (val) {
    loadCaptcha()
  }
})
</script>

<template>
  <view>
    <view v-if="show" class="slider-verifiy" :style="sliderVars">
      <view class="slider-verifiy__body">
        <view class="slider-verifiy__header">
          <view class="slider-verifiy__header-title">
            拖动下方滑块完成拼图
          </view>

          <view class="slider-verifiy__header-close" @click="show = false" />
        </view>

        <view class="slider-verifiy__movable">
          <view v-if="data.bgImage === ''" class="slider-verifiy__movable-tip">
            {{ data.errorMsg }}
          </view>

          <image v-else class="slider-verifiy__movable-bg" :src="data.bgImage" mode="widthFix" />

          <view
            class="slider-verifiy__movable-jigsaw"
            :class="[{ tremble: data.isTrembling }]"
            :style="{
              backgroundImage: `url(${data.futuImage})`,
              left: `${data.sliderX}px`,
            }"
          />
        </view>

        <view class="slider-verifiy__slide">
          <view
            class="slider-verifiy__slide-filling"
            :class="data.status"
            :style="{ width: `${data.sliderX}px` }"
          />

          <view
            class="slider-verifiy__slide-thumb"
            :class="data.status"
            :style="{ left: `${data.sliderX}px` }"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
          />
        </view>

        <view class="slider-verifiy__footer">
          <view class="slider-verifiy__footer-refresh" @click="loadCaptcha">
            <view class="slider-verifiy__footer-refresh__icon" />
            刷新
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
$prefix: slider-verifiy;

.#{$prefix} {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgb(0 0 0 / 30%);

  &__body {
    width: var(--slider-bg-width);
    padding: 30rpx;
    background: #fff;
    border-radius: 16rpx;

    .#{$prefix}__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 20rpx;

      &-title {
        font-size: 30rpx;
        line-height: 42rpx;
        color: #333;
      }

      &-close {
        position: relative;
        display: inline-block;

        @include close-icon;
      }
    }

    .#{$prefix}__movable {
      position: relative;
      flex-direction: column;
      width: 100%;

      &-tip {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        font-size: 30rpx;
        line-height: var(--slider-bg-height);
        color: #999;
        background: #f8f8f8;
      }

      &-bg {
        display: block;
        width: var(--slider-bg-width);
        height: var(--slider-bg-height);
      }

      &-jigsaw {
        position: absolute;
        top: 0;
        left: 0;
        width: var(--slider-jigsaw-width);
        height: 100%;
        background-repeat: no-repeat;
        background-size: 100%;

        @keyframes tremble {
          20% {
            transform: translateX(-15px);
          }

          40% {
            transform: translateX(15px);
          }

          60% {
            transform: translateX(-15px);
          }

          80% {
            transform: translateX(15px);
          }

          100% {
            transform: translateX(0);
          }
        }

        &.tremble {
          animation: tremble 500ms linear 1;
        }
      }
    }

    .#{$prefix}__slide {
      position: relative;
      width: 100%;
      height: 64rpx;
      margin-top: 8rpx;
      margin-bottom: 23rpx;
      overflow: hidden;
      background: #f2f3f5;
      border-radius: 8rpx;

      $progress: #1890ff;
      $success: #52c41a;
      $error: #ff4d4f;

      &-filling {
        box-sizing: border-box;
        height: 100%;
        background-color: #fff;
        background-color: $progress;

        &.success {
          background-color: $success;
        }

        &.error {
          background-color: $error;
        }
      }

      &-thumb {
        position: absolute;
        top: 0;
        left: 0;
        box-sizing: border-box;
        width: var(--slider-thumb-width);
        height: 100%;
        background-color: #fff;
        border: 4rpx solid #f2f3f5;

        &.success {
          background-color: $success;
          border-color: $success;
        }

        &.error {
          background-color: $error;
          border-color: $error;
        }
      }
    }

    .#{$prefix}__footer {
      display: flex;
      justify-content: flex-end;

      &-refresh {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30rpx;
        line-height: 31px;
        color: #333;

        &__icon {
          width: 30rpx;
          height: 30rpx;
          margin-right: 12rpx;
          background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYiIGhlaWdodD0iMjYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTIzLjA4MyA1LjMxNC0xLjQzMiAxLjEyYTEwLjYzOSAxMC42MzkgMCAwIDAtOC40LTQuMDk4QTEwLjY1NiAxMC42NTYgMCAwIDAgMi41OSAxMi45ODdjLS4wMDggNS44OTYgNC43NjggMTAuNjc3IDEwLjY2MSAxMC42NzcgNC42MDQgMCA4LjUyNy0yLjkyIDEwLjAyLTcuMDFhLjIwNC4yMDQgMCAwIDAtLjEyNS0uMjYybC0xLjQ0LS40OTVhLjIwMy4yMDMgMCAwIDAtLjI1Ni4xMjIgOC42ODggOC42ODggMCAwIDEtMi4wMjEgMy4xNTYgOC42NzcgOC42NzcgMCAwIDEtNi4xNzIgMi41NiA4LjY2OCA4LjY2OCAwIDAgMS0zLjM5OC0uNjg2IDguNjcgOC42NyAwIDAgMS0yLjc3NS0xLjg3NCA4LjY4OCA4LjY4OCAwIDAgMS0xLjg3MS0yLjc3OCA4LjY5IDguNjkgMCAwIDEtLjY4Ni0zLjRjMC0xLjE4LjIzMS0yLjMyMy42ODYtMy40QTguNjg4IDguNjg4IDAgMCAxIDcuMDg0IDYuODJhOC42NzcgOC42NzcgMCAwIDEgNi4xNzItMi41NmMxLjE4MSAwIDIuMzI0LjIzMiAzLjM5OC42ODZhOC42NyA4LjY3IDAgMCAxIDIuNzc1IDEuODc0Yy4yNTEuMjUxLjQ4Ny41MTguNzA2Ljc5N2wtMS41MjkgMS4xOTRhLjIwMy4yMDMgMCAwIDAgLjA3Ni4zNThsNC40NTkgMS4wOTFhLjIwNC4yMDQgMCAwIDAgLjI1MS0uMTk1bC4wMi00LjU5M2EuMjA1LjIwNSAwIDAgMC0uMzMtLjE1OHoiIGZpbGw9IiM2NjYiIGZpbGwtcnVsZT0ibm9uemVybyIvPjwvc3ZnPg==");
          background-repeat: no-repeat;
          background-size: contain;
        }
      }
    }
  }
}
</style>
