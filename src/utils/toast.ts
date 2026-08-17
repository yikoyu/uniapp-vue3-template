type ToastIcon = NonNullable<UniNamespace.ShowToastOptions['icon']>

interface ToastOptions {
  /** 提示内容 */
  title: string
  /** 图标类型 */
  icon?: ToastIcon
  /** 持续时间（毫秒），0 表示不自动关闭 */
  duration?: number
}

interface ModalOptions {
  /** 标题 */
  title?: string
  /** 内容 */
  content: string
  /** 确认按钮文字 */
  confirmText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 是否显示取消按钮 */
  showCancel?: boolean
}

export class Toast {
  private static _show(title: string, icon: ToastIcon, duration: number) {
    uni.showToast({ title, icon, duration })
  }

  /** 普通提示 */
  static show(title: string, duration?: number): void
  /** 普通提示 */
  static show(options: ToastOptions): void
  static show(titleOrOptions: string | ToastOptions, duration: number = 3000) {
    if (typeof titleOrOptions === 'string') {
      this._show(titleOrOptions, 'none', duration)
    }
    else {
      const { title, icon = 'none', duration: d = 3000 } = titleOrOptions
      this._show(title, icon, d)
    }
  }

  /** 成功提示 */
  static success(title: string, duration: number = 3000) {
    this._show(title, 'success', duration)
  }

  /** 错误提示 */
  static error(title: string, duration: number = 3000) {
    this._show(title, 'error', duration)
  }

  /** 警告提示 */
  static warning(title: string, duration: number = 3000) {
    this._show(title, 'error', duration)
  }

  /** 加载提示（需手动关闭） */
  static loading(title: string) {
    uni.showLoading({ title, mask: true })
  }

  /** 关闭加载提示 */
  static hideLoading() {
    uni.hideLoading()
  }
}

export class Modal {
  /** 提示弹框（仅确认） */
  static show(options: ModalOptions): Promise<boolean>
  /** 提示弹框（仅确认） */
  static show(content: string, confirmText?: string, title?: string): Promise<boolean>
  static show(optionsOrContent: string | ModalOptions, confirmText = '确定', title = '提示') {
    const opts = typeof optionsOrContent === 'string'
      ? { title, content: optionsOrContent, confirmText }
      : { title: '提示', confirmText: '确定', ...optionsOrContent }

    return new Promise<boolean>((resolve, reject) => {
      uni.showModal({
        title: opts.title,
        content: opts.content,
        confirmText: opts.confirmText,
        showCancel: false,
        success: res => resolve(res.confirm),
        fail: err => reject(err),
      })
    })
  }

  /** 确认弹框（确认/取消） */
  static confirm(options: ModalOptions): Promise<boolean>
  /** 确认弹框（确认/取消） */
  static confirm(content: string, confirmText?: string, cancelText?: string): Promise<boolean>
  static confirm(optionsOrContent: string | ModalOptions, confirmText = '确定', cancelText = '取消') {
    const opts = typeof optionsOrContent === 'string'
      ? { title: '提示', content: optionsOrContent, confirmText, cancelText }
      : { title: '提示', confirmText: '确定', cancelText: '取消', ...optionsOrContent }

    return new Promise<boolean>((resolve, reject) => {
      uni.showModal({
        title: opts.title,
        content: opts.content,
        confirmText: opts.confirmText,
        cancelText: opts.cancelText,
        showCancel: true,
        success: res => resolve(res.confirm),
        fail: err => reject(err),
      })
    })
  }
}

/** 轻提示 */
export const toast = Toast
/** 弹框 */
export const modal = Modal
