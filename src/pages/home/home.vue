<script lang="ts" setup>
import { useMessage, useNotify, useToast } from 'wot-design-uni'
import { useAppStore } from '@/stores/app'
import { uniNav } from '@/utils'

definePage({
  type: 'home',
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const app = useAppStore()
const toast = useToast()
const message = useMessage()
const { showNotify } = useNotify()

const count = ref(0)

function setCountPlus() {
  count.value = count.value + 1
}

function onUseToast() {
  setCountPlus()

  toast.show(`Hello World ${count.value}`)
}

async function onUseMessage() {
  try {
    await message.confirm({
      confirmButtonProps: { round: false },
      cancelButtonProps: { round: false },
      msg: '提示文案',
      title: '标题',
    })

    console.log('点击了确定按钮')
  }
  catch (error) {
    console.log('点击了取消按钮')
  }
}

async function onShowNotify() {
  setCountPlus()

  showNotify({
    type: 'success',
    message: `Hello World ${count.value}`,
  })
}

function setAppStore() {
  setCountPlus()

  app.setToken({
    accessToken: `accessToken_${count.value}`,
    refreshToken: `refreshToken_${count.value}`,
    accessTokenExpire: Date.now() + 1000 * 60 * 60 * 24,
    refreshTokenExpire: Date.now() + 1000 * 60 * 60 * 24 * 7,
  })
}

function resetAppStore() {
  app.resetToken()
}

function toEcharts() {
  uniNav.navigateTo('/pages-echarts/bar/index')
}
</script>

<template>
  <NavBar title="首页" />

  <view>
    <WdButton @click="setCountPlus">
      count: {{ count }}
    </WdButton>

    <WdButton @click="onUseToast">
      useToast
    </WdButton>

    <WdButton @click="onUseMessage">
      useMessage
    </WdButton>

    <WdButton @click="onShowNotify">
      showNotify
    </WdButton>

    <WdButton @click="setAppStore">
      设置Pinia数据
    </WdButton>

    <WdButton @click="resetAppStore">
      删除Pinia数据
    </WdButton>

    <WdButton @click="toEcharts">
      Echarts
    </WdButton>
  </view>

  <VTabbar value="home" />
</template>

<!-- <style lang="scss" scoped></style> -->
