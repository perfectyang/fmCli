# 介绍

这是一个支持自动将中文替换成 i18n 国际化标记的命令行工具


## 功能 🎉

- 支持.mjs.cjs.js.ts.jsx.tsx.vue 后缀文件提取中文
- 支持 vue2.0，vue3.0，react 提取中文
- 支持通过/\*i18n-ignore\*/注释，忽略中文提取
- 支持将提取的中文以 key-value 形式存入\*.json 语言包里
- 支持 prettier 格式化代码
- 支持将中文语言包自动翻译成其他语言
- 支持将翻译结果导出成 excel
- 支持读取 excel 文件并转换成语言包
- 自定义语言包 key 的层级嵌套
- 自定义语言包的 key
- 自定义 i18n 工具的调用对象
- 自定义 i18n 工具的方法名
- 自定义 i18n 第三方包的导入
- 自定义忽略提取的方法

## 安装

```
npm i dms-cli -g
```

## 使用

在项目根目录执行下面命令

```
fm
```

## 指令参数

| 参数              | 类型    | 默认值                 | 描述                                                                                   |
| ----------------- | ------- | ---------------------- | -------------------------------------------------------------------------------------- |
| -i, --input       | String  | 'src'                  | 指定待提取的文件目录。                                                                 |
| -o, --output      | String  | ''                     | 输出转换后文件路径。没有值时表示完成提取后自动覆盖原始文件。当有值时，会输出到指定目录 |
| -c, --config-file | String  | ''                     | 指定命令行配置文件的所在路径（可以自定义更多功能）                                     |
| --localePath      | String  | './locales/zh-CN.json' | 指定提取的中文语言包所存放的路径。                                                     |
| -v,--verbose      | Boolean | false                  | 控制台打印更多调试信息                                                                 |
| -h,--help         | Boolean | false                  | 查看指令用法                                                                           |
| --skip-extract    | Boolean | false                  | 跳过 i18n 转换阶段。                                                                   |
| --skip-translate  | Boolean | false                  | 跳过中文翻译阶段。                                                                     |
| --locales         | Array   | ['en-US']              | 根据中文语言包自动翻译成其他语言。用法例子 --locales en zh-CHT                         |
| --incremental     | Boolean | false                  | 开启后。支持将文件中提取到中文键值对，追加到原有的中文语言包。                         |
| --exportExcel     | Boolean | false                  | 开启后。导出所有翻译内容到 excel。 默认导出到当前目录下的 locales.xlsx                 |
| --excelPath       | String  | './locales.xlsx'       | 指定导出的 excel 路径。                                                                |

## 子命令

| 子命令    | 描述                                      |
| --------- | ----------------------------------------- |
| init      | 在项目里初始化一个命令行配置              |
| loadExcel | 根据导入翻译文件的 excel 内容，生成语言包 |
| loadApiExcel | 根据导入远程翻译文件的 excel 内容，生成语言包 |

## 命令行配置

如果有更多的定制需求，可以在项目根目录执行`it init`，创建`i18n.config.js`文件，按自身需求修改完配置后，再执行`it -c i18n.config.js`。（注意：配置文件里参数的优先级比指令参数高）

```js
// 以下为i18n.config.js默认的完整配置，所有属性均为可选，可以根据自身需要修改
module.exports = {
  input: 'src',
  output: '', // 没有值时表示完成提取后自动覆盖原始文件
  exclude: ['**/node_modules/**/*'], // 排除不需要提取的文件
  localePath: './locales/zh-CN.json', // 中文语言包的存放位置
  localeFileType: 'json', // 设置语言包的文件类型，支持js、json。默认为json
  // rules每个属性对应的是不同后缀文件的处理方式
  rules: {
    js: {
      caller: '', // 自定义this.$t('xxx')中的this。不填则默认没有调用对象
      functionName: 't', // 自定义this.$t('xxx')中的$t
      customizeKey: function (key, currentFilePath) {
        return key
      }, // 自定义this.$t('xxx')中的'xxx'部分的生成规则
      importDeclaration: 'import { t } from "i18n"', // 默认在文件里导入i18n包。不填则默认不导入i18n的包。由于i18n的npm包有很多，用户可根据项目自行修改导入语法
    },
    // ts,cjs,mjs,jsx,tsx配置方式同上
    ts: {
      caller: '',
      functionName: 't',
      customizeKey: function (key, currentFilePath) {
        return key
      },
      importDeclaration: 'import { t } from "i18n"',
    },
    cjs: {
      caller: '',
      functionName: 't',
      customizeKey: function (key, currentFilePath) {
        return key
      },
      importDeclaration: 'import { t } from "i18n"',
    },
    mjs: {
      caller: '',
      functionName: 't',
      customizeKey: function (key, currentFilePath) {
        return key
      },
      importDeclaration: 'import { t } from "i18n"',
    },
    jsx: {
      caller: '',
      functionName: 't',
      customizeKey: function (key, currentFilePath) {
        return key
      },
      importDeclaration: 'import { t } from "i18n"',
      functionSnippets: '', // react函数组件里，全局加代码片段
    },
    tsx: {
      caller: '',
      functionName: 't',
      customizeKey: function (key, currentFilePath) {
        return key
      },
      importDeclaration: 'import { t } from "i18n"',
      functionSnippets: '',
    },
    vue: {
      caller: 'this',
      functionName: '$t',
      customizeKey: : function (key, currentFilePath) {
        return key
      },
      importDeclaration: '',
    },
  },
  globalRule: {
    ignoreMethods: [] // 忽略指定函数调用的中文提取。例如想忽略sensor.track('中文')的提取。这里就写['sensor.track']
  },
  // prettier配置，参考https://prettier.io/docs/en/options.html
  prettier: {
    semi: false,
    singleQuote: true,
  },
  skipExtract: false, // 跳过提取中文阶段
  // 以下是和翻译相关的配置，注意搭配使用
  skipTranslate: true, // 跳过翻译语言包阶段。默认不翻译
  locales: [], // 需要翻译的语言包。例如['en', 'zh-CHT']，会自动翻译英文和繁体
  excelPath: './locales.xlsx', // excel存放路径
  exportExcel: false, // 是否导出excel
  // 参数：
  // allKeyValue：已遍历的所有文件的key-value
  // currentFileKeyMap: 当前文件提取到的key-value
  // currentFilePath: 当前遍历的文件路径
  adjustKeyMap(allKeyValue, currentFileKeyMap, currentFilePath) {return allKeyValue}, // 对提取结构进行二次处理
}
```



1. 跳过转换阶段，仅将中文语言包翻译成其他语言(例如英语、中文繁体等)

```
it --skip-extract --locales en zh-CHT
```

2. 跳过自动翻译阶段，仅进行 i18n 转换，并将提取到的 key-value 提取到中文语言包

```
it --skip-translate
```

3. 使用自定义配置进行 i18n 转换

```
it -c ./i18n.config.js
```

4. 指定需要自动翻译的语言(例如日语)，并指定项目里中文语言包的位置(相对于命令的执行位置)。命令执行时会自动根据中文语言包，将日语翻译出来并存入到`ja.json`文件中

```
it --localePath ./locales/zh-CN.json  --locales ja
```

5. 指定需要转换的文件目录，并增量提取中文。例如项目的 src 目录有 A、B、C 三个文件夹，里面分别有 A,B,C 三个文件，其中 A、B 已经替换过 i18n，此时执行命令，会将 C 文件的中文进行 i18n 替换，并将新提取到的中文追加到原有的中文语言包里

```
it --incremental -i ./src/C
```

6. 导入 excel

excel 的表头格式`['字典key', 'zh-CN']`

```
# 方式1，根据指令参数
it loadExcel --excelPath ./demo.xlsx --localePath ./locales/zh-CN.json
# 方式2，根据本地配置
it loadExcel -c ./i18n.config.js
```

1. 导出 excel

```
# 方式1，根据指令参数
it --skip-extract --skip-translate --exportExcel --excelPath ./demo.xlsx
# 方式2，根据本地配置
it --skip-extract --skip-translate  -c ./i18n.config.js
```

## 转换效果示例

#### react 转换示例

转换前

```jsx
import { useState } from 'react'

/*i18n-ignore*/
const b = '被忽略提取的文案'

function Example() {
  const [msg, setMsg] = useState('你好')

  return (
    <div>
      <p title="标题">{msg + '呵呵'}</p>
      <button onClick={() => setMsg(msg + '啊')}>点击</button>
    </div>
  )
}

export default Example
```

转换后

```jsx
import { t } from 'i18n'
import { useState } from 'react'

/*i18n-ignore*/
const b = '被忽略提取的文案'

function Example() {
  const [msg, setMsg] = useState(t('你好'))
  return (
    <div>
      <p title={t('标题')}>{msg + t('呵呵')}</p>
      <button onClick={() => setMsg(msg + t('啊'))}>{t('点击')}</button>
    </div>
  )
}
export default Example
```
