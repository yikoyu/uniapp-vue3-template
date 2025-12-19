<script setup lang="ts">
// 解构Hook状态和方法
const {
  permissionState,
  errorMsg,
  checkBluetoothPermission,
  refreshAllPermission,
} = useBluetoothPermission()

/**
 * 清空错误提示
 */
function clearError() {
  errorMsg.value = ''
}

/**
 * 格式化权限状态文本
 */
function getAuthText(authState: 'authorized' | 'denied' | 'not determined' | undefined) {
  switch (authState) {
    case 'authorized':
      return '✅ 已授权'
    case 'denied':
      return '❌ 已拒绝'
    case 'not determined':
      return '⚠️ 未确定'
    default:
      return '❓ 未知状态'
  }
}

/**
 * 匹配权限状态样式类型
 */
function getAuthStatusType(authState: 'authorized' | 'denied' | 'not determined' | undefined) {
  switch (authState) {
    case 'authorized':
      return 'success'
    case 'denied':
      return 'error'
    case 'not determined':
      return 'warning'
    default:
      return 'default'
  }
}

/**
 * 开启蓝牙功能（完整权限检查+蓝牙开启）
 */
async function handleOpenBluetooth() {
  try {
    const isPass = await checkBluetoothPermission()
    if (!isPass)
      return

    // 权限通过，调用蓝牙接口
    await new Promise<void>((resolve, reject) => {
      uni.openBluetoothAdapter({
        success: () => {
          uni.showToast({
            title: '蓝牙开启成功！',
            icon: 'success',
            duration: 2000,
            mask: true,
          })
          resolve()
        },
        fail: err => reject(new Error(`蓝牙开启失败：${err.errMsg}`)),
      })
    })
  }
  catch (err) {
    uni.showToast({
      title: (err as Error).message,
      icon: 'none',
      duration: 3000,
      mask: true,
    })
  }
}

/**
 * 刷新所有权限状态（静默刷新）
 */
async function handleRefreshPermission() {
  try {
    await refreshAllPermission()
    uni.showToast({
      title: '状态刷新成功！',
      icon: 'success',
      duration: 1500,
      mask: true,
    })
  }
  catch (err) {
    uni.showToast({
      title: (err as Error).message,
      icon: 'none',
      duration: 2000,
      mask: true,
    })
  }
}

/**
 * 页面切回前台：自动刷新状态
 */
onShow(async () => {
  await refreshAllPermission()
})
</script>

<template>
  <view class="bluetooth-page">
    <!-- 错误提示（原生样式） -->
    <view v-if="errorMsg" class="error-notice">
      <text class="error-text">
        {{ errorMsg }}
      </text>
      <text class="close-icon" @click="clearError">
        ✕
      </text>
    </view>

    <!-- 权限状态卡片（原生卡片样式） -->
    <view class="permission-card">
      <view class="card-title">
        全量权限/开关状态（微信小程序）
      </view>

      <!-- 1. 基础信息区 -->
      <view class="state-section">
        <view class="section-title">
          基础信息
        </view>
        <view class="state-item">
          <text class="item-label">
            微信版本：
          </text>
          <text class="item-value">
            {{ permissionState.wxVersion || '未知' }}
          </text>
        </view>
        <view class="state-item">
          <text class="item-label">
            设备系统：
          </text>
          <text class="item-value">
            {{ permissionState.isIOS ? 'iOS' : 'Android' }}
          </text>
        </view>
      </view>

      <!-- 2. 系统级硬件开关（Android专属） -->
      <view v-if="!permissionState.isIOS" class="state-section">
        <view class="section-title">
          系统级硬件开关（手机系统层面）
        </view>
        <view class="state-item">
          <text class="item-label">
            蓝牙开关：
          </text>
          <text class="item-value status-{{ permissionState.bluetoothSystemSwitch ? 'success' : 'error' }}">
            {{ permissionState.bluetoothSystemSwitch ? '✅ 已开启' : '❌ 未开启' }}
          </text>
        </view>
        <view class="state-item">
          <text class="item-label">
            定位开关：
          </text>
          <text class="item-value status-{{ permissionState.locationSystemSwitch ? 'success' : 'error' }}">
            {{ permissionState.locationSystemSwitch ? '✅ 已开启' : '❌ 未开启' }}
          </text>
        </view>
      </view>

      <!-- 3. 微信系统级权限（Android专属：微信在系统中的授权） -->
      <view v-if="!permissionState.isIOS" class="state-section">
        <view class="section-title">
          微信系统级权限（微信APP在手机系统中的授权）
        </view>
        <view class="state-item">
          <text class="item-label">
            定位权限：
          </text>
          <text class="item-value status-{{ getAuthStatusType(permissionState.locationAppAuthorized) }}">
            {{ getAuthText(permissionState.locationAppAuthorized) }}
          </text>
        </view>
        <view class="state-item">
          <text class="item-label">
            蓝牙权限：
          </text>
          <text class="item-value status-{{ getAuthStatusType(permissionState.bluetoothSystemAuth) }}">
            {{ getAuthText(permissionState.bluetoothSystemAuth) }}
          </text>
        </view>
      </view>

      <!-- 4. 微信系统级权限（iOS：仅蓝牙权限，无定位开关/权限依赖） -->
      <view v-if="permissionState.isIOS" class="state-section">
        <view class="section-title">
          微信系统级权限（微信APP在手机系统中的授权）
        </view>
        <view class="state-item">
          <text class="item-label">
            蓝牙权限：
          </text>
          <text class="item-value status-{{ getAuthStatusType(permissionState.bluetoothSystemAuth) }}">
            {{ getAuthText(permissionState.bluetoothSystemAuth) }}
          </text>
        </view>
      </view>

      <!-- 5. 小程序应用级权限（小程序在微信中的授权） -->
      <view class="state-section">
        <view class="section-title">
          小程序应用级权限（当前小程序在微信中的授权）
        </view>
        <view class="state-item">
          <text class="item-label">
            蓝牙权限：
          </text>
          <text class="item-value status-{{ permissionState.bluetoothScopeAuth ? 'success' : 'error' }}">
            {{ permissionState.bluetoothScopeAuth ? '✅ 已授权' : '❌ 未授权' }}
          </text>
        </view>
        <view v-if="!permissionState.isIOS" class="state-item">
          <text class="item-label">
            定位权限：
          </text>
          <text class="item-value status-{{ permissionState.locationScopeAuth ? 'success' : 'error' }}">
            {{ permissionState.locationScopeAuth ? '✅ 已授权' : '❌ 未授权' }}
          </text>
        </view>
      </view>
    </view>

    <!-- 操作按钮（原生按钮） -->
    <view class="btn-container">
      <button class="btn primary-btn" @click="handleOpenBluetooth">
        开启蓝牙功能
      </button>
      <button class="btn default-btn" @click="handleRefreshPermission">
        刷新所有状态
      </button>
    </view>
  </view>
</template>

<style scoped>
/* 页面基础样式 */
.bluetooth-page {
  min-height: 100vh;
  padding: 20rpx;
  background-color: #f5f7fa;
}

/* 错误提示样式 */
.error-notice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15rpx 20rpx;
  margin-bottom: 20rpx;
  background-color: #fff1f0;
  border: 1rpx solid #ffccc7;
  border-radius: 8rpx;
}

.error-text {
  flex: 1;
  font-size: 28rpx;
  line-height: 1.5;
  color: #f5222d;
}

.close-icon {
  margin-left: 10rpx;
  font-size: 24rpx;
  color: #868686;
  cursor: pointer;
}

/* 权限卡片样式 */
.permission-card {
  padding: 30rpx;
  margin-bottom: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgb(0 0 0 / 5%);
}

.card-title {
  padding-bottom: 20rpx;
  margin-bottom: 30rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2937;
  border-bottom: 2rpx solid #f0f0f0;
}

/* 状态分区样式 */
.state-section {
  margin-bottom: 25rpx;
}

.state-section:last-child {
  margin-bottom: 0;
}

.section-title {
  padding-left: 10rpx;
  margin-bottom: 15rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #4b5563;
  border-left: 4rpx solid #409eff;
}

/* 状态项样式 */
.state-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 12rpx 0;
  font-size: 26rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.state-item:last-child {
  border-bottom: none;
}

.item-label {
  flex: 1;
  min-width: 280rpx;
  color: #6b7280;
}

.item-value {
  flex: 1;
  color: #111827;
  text-align: right;
}

/* 状态颜色样式 */
.status-success {
  color: #00b42a !important;
}

.status-error {
  color: #f53f3f !important;
}

.status-warning {
  color: #ff9a2e !important;
}

.status-default {
  color: #86909c !important;
}

/* 按钮容器 */
.btn-container {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  padding: 0 10rpx;
}

/* 按钮通用样式 */
.btn {
  height: 88rpx;
  font-size: 30rpx;
  line-height: 88rpx;
  cursor: pointer;
  border: none;
  border-radius: 10rpx;
}

/* 主按钮 */
.primary-btn {
  color: #fff;
  background-color: #409eff;
}

/* 默认按钮 */
.default-btn {
  color: #374151;
  background-color: #f9fafb;
  border: 1rpx solid #e5e7eb;
}
</style>
