"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 第二个参数path，在生成配置文件时需要展示在文件里，所以不需要去掉
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCustomizeKey(key, path) {
    return key;
}
function getCommonRule() {
    return {
        caller: '',
        functionName: 't',
        customizeKey: getCustomizeKey,
        importDeclaration: 'import { t } from "i18n"',
    };
}
const config = {
    input: 'src',
    output: '',
    exclude: ['**/node_modules/**/*'],
    rules: {
        js: getCommonRule(),
        ts: getCommonRule(),
        cjs: getCommonRule(),
        mjs: getCommonRule(),
        jsx: Object.assign(Object.assign({}, getCommonRule()), { functionSnippets: '' }),
        tsx: Object.assign(Object.assign({}, getCommonRule()), { functionSnippets: '' }),
        vue: {
            caller: 'this',
            functionName: '$t',
            customizeKey: getCustomizeKey,
            importDeclaration: '',
        },
    },
    prettier: {
        semi: false,
        singleQuote: true,
    },
    incremental: false,
    skipExtract: false,
    localePath: './locales/zh.json',
    localeFileType: 'json',
    excelPath: './locales.xlsx',
    exportExcel: false,
    skipTranslate: false,
    locales: ['en'],
    globalRule: {
        ignoreMethods: [],
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    adjustKeyMap(allKeyValue, currentFileKeyMap, currentFilePath) {
        return allKeyValue;
    },
};
exports.default = config;
