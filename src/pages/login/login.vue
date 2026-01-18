<script lang="ts" setup>
import { isMpAlipay } from '@uni-helper/uni-env'
import { Enum } from 'enum-plus'

import NavBar from '@/components/NavBar/index.vue'
import { toast } from '@/utils'
import { useWechatLogin } from './_hooks/useWechatLogin'

// const APP_NAME = import.meta.env.VITE_APP_NAME

definePage({
  style: {
    'navigationBarTitleText': '',
    'navigationStyle': 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      titlePenetrate: 'YES',
    },
  },
})

const {
  reLaunchUrl,
  selected,
  getPhoneNumber,
  onHandleAuthError,
  getAliAuthorize,
} = useWechatLogin()

const LinkEnum = Enum({
  /** 用户服务协议 */
  USER_SERVICE: { value: 0, label: '用户协议', link: import.meta.env.VITE_USER_SERVICE_AGREEMENT_LINK },
  /** 隐私政策 */
  PRIVACY: { value: 1, label: '隐私条款', link: import.meta.env.VITE_PRIVACY_AGREEMENT_LINK },
})

function goToSmsLogin() {
  if (!unref(selected)) {
    toast.show('请阅读并勾选协议')
    return
  }

  useRouter().navigate('/pages/login/sms', {
    redirect: reLaunchUrl.value || '',
  })
}

function toURL(value: typeof LinkEnum.valueType) {
  if (value === LinkEnum.USER_SERVICE) {
    console.log('用户协议')
  }

  if (value === LinkEnum.PRIVACY) {
    console.log('隐私条款')
  }
}
</script>

<template>
  <NavBar :block="false" />

  <view class="login">
    <view class="login-content">
      <!-- <image :src="" class="login-content__logo" /> -->

      <!-- <view class="login-content__title">{{ APP_NAME }}</view> -->

      <template v-if="selected">
        <button
          v-if="isMpAlipay"
          class="login-content__btn is-wechat"
          hover-class="active"
          open-type="getAuthorize"
          scope="phoneNumber"
          @getAuthorize="getAliAuthorize"
          @error="onHandleAuthError"
        >
          手机号快捷登录
        </button>

        <button
          v-else
          class="login-content__btn is-wechat"
          hover-class="active"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >
          手机号快捷登录
        </button>
      </template>

      <button
        v-if="!selected"
        class="login-content__btn is-wechat"
        hover-class="active"
        @click="getPhoneNumber"
      >
        手机号快捷登录
      </button>

      <button class="login-content__btn is-phone" hover-class="active" @click="goToSmsLogin">
        短信验证码登录
      </button>
    </view>

    <!-- 勾选协议 -->
    <view class="login__privacy-agreement" @click="selected = !selected">
      <label class="login__privacy-agreement--radio">
        <radio :checked="selected" />

        <view>
          我已阅读并同意
          <view class="login__privacy-agreement__btn" @click.stop="toURL(LinkEnum.USER_SERVICE)">
            《{{ LinkEnum.label(LinkEnum.USER_SERVICE) }}》
          </view>
          <view class="login__privacy-agreement__btn" @click.stop="toURL(LinkEnum.PRIVACY)">
            《{{ LinkEnum.label(LinkEnum.PRIVACY) }}》
          </view>
        </view>
      </label>
    </view>

    <!-- 背景 -->
    <!-- <image class="login__background" :src="" /> -->
  </view>
</template>

<style lang="scss">
/* radio 样式修改 */
/* stylelint-disable-next-line selector-type-no-unknown */
radio {
  @include custom-radio;
}
</style>

<style lang="scss" scoped>
.login {
  position: relative;
  height: 100%;
  padding: 0 30rpx;
  padding-top: 540rpx;

  // &__background {
  //   z-index: -1;
  //   box-sizing: border-box;
  //   width: 100%;
  //   height: 100%;
  //   border-radius: 10rpx;

  //   @include abs-fill-screen();
  // }

  &-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__logo {
      width: 160rpx;
      height: 160rpx;
      padding-top: 540rpx;
      padding-bottom: 122rpx;
      border-radius: 50%;
    }

    &__title {
      padding-top: 20rpx;
      margin-bottom: 100rpx;
      font-size: 36rpx;
      font-weight: 600;
    }

    &__btn {
      width: 100%;

      &.is-wechat {
        @include button;
      }

      &.is-phone {
        margin-top: 50rpx;

        @include button(90rpx, $uni-color-primary, true);
      }
    }
  }

  &__privacy-agreement {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 30rpx auto;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 28rpx;
    color: #333;
    text-align: center;

    &--radio {
      display: flex;
      align-items: center;

      & > view {
        display: flex;
      }
    }

    &__btn {
      color: $uni-color-primary;
    }
  }
}
</style>
