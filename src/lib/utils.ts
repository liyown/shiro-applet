import Taro from '@tarojs/taro'
/**
 * 是否是 H5 环境
 * @type {boolean}
 */
export const isH5 = Taro.ENV_TYPE.WEB === Taro.getEnv()

// 节流函数
export const throttle = (
  fn: (...args: any[]) => void,
  delay: number,
  mustRunDelay: number
) => {
  let timer: ReturnType<typeof setTimeout> | null = null
  let lastExecTime = 0

  return (...args: any[]) => {
    const currentTime = Date.now()

    if (currentTime - lastExecTime >= mustRunDelay) {
      fn(...args)
      lastExecTime = currentTime
    } else {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        fn(...args)
        lastExecTime = Date.now()
      }, delay)
    }
  }
}

