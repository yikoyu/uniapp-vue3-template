import type { CaptchaRequest_SendSmsParam_ } from '@/api/_gen/globals'

export interface SendSmsData {
  captchaTrack: {
    bgImageHeight: number
    bgImageWidth: number
    endSlidingTime: string
    sliderImageHeight: number
    sliderImageWidth: number
    startSlidingTime: string
    trackList: {
      t: number
      type: 'down' | 'move' | 'up'
      x: number
      y: number
    }[]
  }

  form: {
    phone: string
  }

  id: string
}

/**
 * @description: 获取滑块验证码
 */
export function sendSmsCheck() {
  return Apis.general.sendSmsCheckUsingGET({
    meta: { authRole: null },
  })
}

/**
 * @description: 发送验证码
 */
export function sendSms(data: CaptchaRequest_SendSmsParam_) {
  return Apis.general.sendSmsUsingPOST({
    meta: { authRole: null },
    data,
  })
}
