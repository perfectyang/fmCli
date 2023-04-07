import { describe, it, expect } from 'vitest'
import transform from '../src/core'
import execLoadExcel, { ajaxExcel } from '../src/commands/loadExcel'
import { getAbsolutePath } from '../src/utils/getAbsolutePath'

const config = {
  caller: '',
  functionName: 'ts',
  customizeKey: function getCustomizeKey(key) {
    return key
  },
  importDeclaration: 'import { ts } from "@/language/translate"',
}

const config3 = {
  // input: 'src/pages/TTkolOperate', 此处暂时手写具体文件夹路径
  input: '/Users/perfectyang/Desktop/project/dms-system/src/pages',
  // input: getAbsolutePath(__dirname, 'src/source'),
  output: getAbsolutePath(__dirname, 'lang/sourceCode'),
  // output: '/Users/perfectyang/Desktop/project/dms-system/src/pages/bak',
  exclude: ['**/node_modules/**/*'],
  rules: {
    js: config,
    jsx: config,
    ts: config,
    tsx: config,
  },
  prettier: {
    trailingComma: 'es5',
    tabWidth: 2,
    useTabs: true,
    semi: false,
    bracketSpacing: true,
    jsxBracketSameLine: false,
    singleQuote: true,
    endOfLine: 'auto',
    eslintIntegration: true,
    printWidth: 100,
  },
  incremental: true, // 是否增量添加语言
  skipExtract: false,
  // localePath: getAbsolutePath(__dirname, 'lang/zh.json'),
  localePath: getAbsolutePath(__dirname, 'lang/zh.json'),
  exportExcel: true,
  // 导出excel存放的路径
  outputExcelPath: getAbsolutePath(__dirname, 'lang/testExcel.xlsx'),
  localeFileType: 'json',
  // excelPath: getAbsolutePath(__dirname, 'lang/locales.xlsx'),
  // excelPath: '/Users/perfectyang/Desktop/testxlsx.xlsx',
  // 通过导入的excel生成相关的json导出存放的路径
  // excelJsonOutPutPath: getAbsolutePath(__dirname, 'lang/newLang'),
  // ----------------------------
  // 导出需要转成json的excel源数据
  excelPath: '/Users/perfectyang/Desktop/需要翻译.xlsx',
  excelJsonOutPutPath: '/Users/perfectyang/Desktop/project/dms-system/src/language/locales',
  // ----------------------------
  skipTranslate: true,
  locales: [],
}

describe('parse', () => {
  it('demo parse', () => {
    // ajaxExcel(
    //   'http://dms-upload-dev-sg.oss-ap-southeast-1.aliyuncs.com/uploadfile/20230331/8f42a054-1dd1-45f5-b580-4c85fabddbb1.xlsx'
    // )
    // transform(config3)
    execLoadExcel(config3)
    expect(1).toEqual(1)
  })
})
