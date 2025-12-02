<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { computed, reactive, ref, unref } from 'vue'

import { z } from 'zod/mini'
import NavBar from '@/components/NavBar/index.vue'
import SliderVerifiy from '@/components/SliderVerifiy/index.vue'
import { useAppStore } from '@/stores/app'
import { toast } from '@/utils/toast'
import { uniNav } from '@/utils/uniNav'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const reLaunchUrl = ref('')

onLoad((query) => {
  reLaunchUrl.value = decodeURIComponent(query?.redirect || '')
})

const app = useAppStore()
const { start, counter, isActive } = useCountDown()

const codeText = computed(() => {
  if (!unref(isActive))
    return '获取验证码'

  return `${unref(counter)}秒后重发`
})

const show = ref(false)
const isBack = ref(false)

onLoad((query) => {
  const _isBack = query?.type === 'back'
  isBack.value = _isBack
})

const formSchema = z.object({
  phone: z.string()
    .check(z.refine(val => val !== '', { message: '手机号不能为空' }))
    .check(z.regex(/^1[3-9]\d{9}$/, { error: '请输入有效的11位手机号' })),
  code: z.string()
    .check(z.refine(val => val !== '', { message: '验证码不能为空' }))
    .check(z.regex(/^\d{6}$/, { error: '请输入6位数字验证码' })),
})

const form = reactive<z.infer<typeof formSchema>>({
  phone: '',
  code: '',
})

const disabled = computed(() => {
  const result = formSchema.safeParse(form)
  return !result.success
})

const disabledCode = computed(() => {
  const result = z.pick(formSchema, { phone: true }).safeParse(form)
  return !result.success
})

function getSmsCodeVerifiy() {
  const result = z.pick(formSchema, { phone: true }).safeParse(form)
  if (!result.success) {
    const msg = result.error?.issues?.[0]?.message
    msg && toast.show(msg)
    return
  }

  show.value = true
}

async function onLogin() {
  try {
    const token = await app.mLogin(form.phone, form.code)
    if (token && !unref(isBack)) {
      uni.reLaunch({
        url: reLaunchUrl.value || '/pages/home/home',
      })
    }

    if (token && unref(isBack))
      uniNav.navigateBack()
  }
  catch (error) {
    console.log('[mLogin] error :>> ', error)
  }
}
</script>

<template>
  <NavBar :block="false" />

  <SliderVerifiy v-model="show" :phone="form.phone" @success="start(120)" />

  <view class="login-sms">
    <view class="login-sms__title">
      验证码登录
    </view>

    <view class="login-sms-form">
      <view class="login-sms-form__input">
        <input v-model="form.phone" type="number" placeholder="请输入手机号" :maxlength="11">
      </view>

      <view class="login-sms-form__input">
        <input v-model="form.code" type="number" :maxlength="6" placeholder="请输入验证码">

        <button class="login-sms-form__input-btn" :disabled="isActive || disabledCode" @click="getSmsCodeVerifiy">
          {{ codeText }}
        </button>
      </view>

      <button class="login-sms-form__btn" hover-class="active" :disabled="disabled" @click="onLogin">
        登录
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login-sms {
  position: relative;
  height: 100%;
  padding: 0 30rpx;

  &__title {
    padding-top: 280rpx;
    font-size: 60rpx;
    font-weight: bold;
    line-height: 84rpx;
    color: #333;
    text-align: left;
  }

  &-form {
    margin-top: 76rpx;

    &__input {
      display: flex;
      font-size: 34rpx;
      border: 1rpx solid #ddd;
      border-radius: 8rpx;

      $input-line-height: 48rpx;

      &>input {
        flex: 1;
        height: $input-line-height;
        padding: 25rpx 30rpx;
        line-height: $input-line-height;
        color: #333;
      }

      &-btn {
        position: relative;
        height: $input-line-height;
        padding: 0 30rpx 0 24rpx;
        margin: 25rpx 0;
        font-size: 34rpx;
        line-height: $input-line-height;
        color: $uni-color-primary;
        text-align: right;
        background-color: rgba($color: #fff, $alpha: 0%);

        &[disabled] {
          color: #c6c6c6;
          background-color: rgba($color: #fff, $alpha: 0%);
        }

        &::after {
          border: none;
        }

        &::before {
          position: absolute;
          top: 0;
          left: 0;
          width: 1rpx;
          height: 100%;
          content: '';
          background-color: #eee;
        }
      }

      &+& {
        margin-top: 30rpx;
      }
    }

    &__btn {
      margin-top: 60rpx;

      @include button();
    }
  }
}
</style>
