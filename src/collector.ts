import type { CustomizeKey, StringObject } from '../types'

import log from './utils/log'

class Collector {
  private static _instance: Collector
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance() {
    if (!this._instance) {
      this._instance = new Collector()
    }
    return this._instance
  }

  private keyMap: StringObject = {}
  // 记录每个文件执行提取的次数
  private countOfAdditions = 0
  // 记录单个文件里提取的中文，键为自定义key，值为原始中文key
  private currentFileKeyMap: Record<string, string> = {}
  private currentFilePath = ''

  setCurrentCollectorPath(path: string) {
    this.currentFilePath = path
  }

  getCurrentCollectorPath() {
    return this.currentFilePath
  }

  add(value: string, customizeKeyFn: CustomizeKey) {
    const customizeKey = customizeKeyFn(value, this.currentFilePath)
    log.verbose('提取中文：', value)
    this.keyMap[customizeKey] = value
    this.countOfAdditions++
    this.currentFileKeyMap[customizeKey] = value
  }

  getCurrentFileKeyMap(): Record<string, string> {
    return this.currentFileKeyMap
  }

  resetCurrentFileKeyMap() {
    this.currentFileKeyMap = {}
  }

  getKeyMap(): StringObject {
    return this.keyMap
  }

  setKeyMap(value: StringObject) {
    this.keyMap = value
  }

  resetCountOfAdditions() {
    this.countOfAdditions = 0
  }

  getCountOfAdditions(): number {
    return this.countOfAdditions
  }
}

export default Collector.getInstance()
