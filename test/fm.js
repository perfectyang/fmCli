// #!/usr/bin/env node
// const transform = require('../dist/core')
// const execLoadExcel = require('../dist/commands/loadExcel/index.js')
// const { getAbsolutePath } = require('../dist/utils/getAbsolutePath')

import path from 'path'
function getAbsolutePath(...paths) {
  const ret = path.resolve(...paths)
  return ret
}
const curPath = getAbsolutePath(__dirname, '../test/lang/newLang')
console.log('__dirname', __dirname)

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
  localePath: getAbsolutePath(__dirname, 'lang/zh.json'),
  exportExcel: true,
  // 导出excel存放的路径
  outputExcelPath: getAbsolutePath(__dirname, 'lang/testExcel.xlsx'),
  localeFileType: 'json',
  // excelPath: getAbsolutePath(__dirname, 'lang/locales.xlsx'),
  // 导出需要转成json的excel源数据
  // excelPath: '/Users/perfectyang/Desktop/需要翻译.xlsx',
  // excelPath: '/Users/perfectyang/Desktop/需要翻译.xlsx',
  // // 通过导入的excel生成相关的json导出存放的路径

  // 导出需要转成json的excel源数据
  excelPath: '/Users/perfectyang/Desktop/需要翻译.xlsx',
  // excelJsonOutPutPath: '/Users/perfectyang/Desktop/project/dms-system/src/language/locales',
  excelJsonOutPutPath: getAbsolutePath(__dirname, '../test/lang/newLang'),

  skipTranslate: true,
  locales: [],
}

module.exports = config3
