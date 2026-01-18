import { ref, unref } from 'vue'
import { useAppStore } from '@/stores/app'
import { toast } from '@/utils/toast'

export function useWechatLogin(hooks?: Fn) {
  const reLaunchUrl = useQuery('redirect')
  const selected = ref(false)

  async function getPhoneNumber(e: Recordable) {
    if (!unref(selected)) {
      toast.show('请阅读并勾选协议')
      return
    }

    const { code } = e.detail
    if (!code) {
      return
    }

    try {
      const token = await useAppStore().wechatLogin(code)

      if (hooks) {
        hooks(token)
        return
      }

      if (token) {
        useRouter().reLaunch(reLaunchUrl.value || '/pages/home/home')
      }
    }
    catch (error: any) {
      const isSessionKeyError = error.data?.status === 1009

      if (isSessionKeyError) {
        toast.error('登录失败请重试')
      }

      console.log('[wechatLogin] error :>> ', error)
    }

    // 登录 API
  }

  async function onHandleAuthError(e: Recordable) {
    console.log('onHandleAuthError e :>> ', e)
  }

  async function getAliAuthorize(e: Recordable) {
    if (!unref(selected)) {
      toast.show('请阅读并勾选协议')
      return
    }

    console.log('getAliAuthorize.e :>> ', e)

    my.getPhoneNumber({
      success: async (res) => {
        const encryptedData = res.response
        console.log('[getPhoneNumber] success:>> ', encryptedData)

        if (!encryptedData) {
          return
        }

        try {
          const token = await useAppStore().wechatLogin(encryptedData)

          if (hooks) {
            hooks(token)
            return
          }

          if (token) {
            useRouter().reLaunch(reLaunchUrl.value || '/pages/home/home')
          }
        }
        catch (error: any) {
          const isSessionKeyError = error.data?.status === 1009

          if (isSessionKeyError) {
            toast.error('登录失败请重试')
          }

          console.log('[wechatLogin] error :>> ', error)
        }
      },
      fail: (err) => {
        console.log('[getPhoneNumber] fail :>> ', err)
      },
    })
  }

  return {
    reLaunchUrl,
    selected,
    getPhoneNumber,
    onHandleAuthError,
    getAliAuthorize,
  }
}
