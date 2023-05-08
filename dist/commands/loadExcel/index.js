"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ajaxData = exports.ajaxExcel = void 0;
const axios_1 = __importDefault(require("axios"));
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const getAbsolutePath_1 = require("../../utils/getAbsolutePath");
const initConfig_1 = require("../../utils/initConfig");
const getLocaleDir_1 = require("../../utils/getLocaleDir");
const stateManager_1 = __importDefault(require("../../utils/stateManager"));
const saveLocaleFile_1 = require("../../utils/saveLocaleFile");
const log_1 = __importDefault(require("../../utils/log"));
const getLang_1 = __importDefault(require("../../utils/getLang"));
const merge_1 = __importDefault(require("lodash/merge"));
// import { spreadObject } from '../../utils/spreadObject'
function getLangList(locales, rows) {
    const langList = [];
    const result = [];
    locales.forEach((locale, i) => {
        // 创建一个对象，存储该语言的翻译
        langList.push({});
        rows.forEach((row) => {
            const key = row[0];
            const value = row[i + 1];
            langList[i][key] = value;
        });
        // 对象的key可能是xx.xx这种形式，需要转成{xx:{xx:1}}
        // result[i] = spreadObject(langList[i])
        result[i] = langList[i];
    });
    return result;
}
const handleExcelData = ({ xlsxData, excelJsonOutPutPath, ext, incremental, }) => {
    // 获取待生成的语言
    const locales = xlsxData[0].slice(1);
    const rows = xlsxData.slice(1);
    const langList = getLangList(locales, rows);
    // 将excel翻译内容更新到本地
    locales.forEach((locale, i) => {
        const localeDirPath = excelJsonOutPutPath || (0, getLocaleDir_1.getLocaleDir)();
        const currentLocalePath = (0, getAbsolutePath_1.getAbsolutePath)(localeDirPath, `${locale}.${ext}`);
        const localePack = langList[i];
        log_1.default.verbose(`Written to the specified file:`, currentLocalePath);
        // 指定输出下有相同的文件，会一起合并数据
        let oldPrimaryLang = {};
        const primaryLangPath = (0, getAbsolutePath_1.getAbsolutePath)(process.cwd(), currentLocalePath);
        oldPrimaryLang = (0, getLang_1.default)(primaryLangPath);
        const contentPack = (0, merge_1.default)(incremental ? oldPrimaryLang : {}, localePack);
        (0, saveLocaleFile_1.saveLocaleFile)(contentPack, currentLocalePath);
        log_1.default.success(`${currentLocalePath}----> generate success!`);
    });
    log_1.default.success(`import complete!`);
};
function execLoadExcel(options) {
    var _a;
    log_1.default.info(`正在导入excel翻译文件`);
    const i18nConfig = (0, initConfig_1.getI18nConfig)(options);
    // 全局缓存脚手架配置
    stateManager_1.default.setToolConfig(i18nConfig);
    const { excelPath, excelJsonOutPutPath } = i18nConfig;
    const xlsxData = node_xlsx_1.default.parse((0, getAbsolutePath_1.getAbsolutePath)(process.cwd(), excelPath))[0]
        .data;
    if (xlsxData.length === 0) {
        return;
    }
    handleExcelData({
        xlsxData,
        excelJsonOutPutPath,
        ext: i18nConfig.localeFileType,
        incremental: (_a = i18nConfig.incremental) !== null && _a !== void 0 ? _a : false,
    });
}
const ajaxExcel = (options) => {
    const i18nConfig = (0, initConfig_1.getI18nConfig)(options);
    const { excelJsonOutPutPath, apiExcelUrl, incremental = false } = i18nConfig;
    const getXLS = () => {
        axios_1.default
            .request({
            responseType: "arraybuffer",
            url: apiExcelUrl,
            method: "get",
            headers: {
                "Content-Type": "blob",
            },
        })
            .then((result) => {
            const workSheetsFromBuffer = node_xlsx_1.default.parse(result.data);
            handleExcelData({
                xlsxData: workSheetsFromBuffer[0].data,
                excelJsonOutPutPath,
                ext: "json",
                incremental,
            });
            log_1.default.success(`Multiple language replacement success`);
        }, (err) => {
            console.log(err.response);
            log_1.default.error(`Multiple language replacement failure---------------`);
        });
    };
    getXLS();
};
exports.ajaxExcel = ajaxExcel;
const ajaxData = (options) => {
    const i18nConfig = (0, initConfig_1.getI18nConfig)(options);
    const { excelJsonOutPutPath, apiExcelUrl, incremental = false } = i18nConfig;
    const getXLS = () => {
        axios_1.default
            .request({
            url: apiExcelUrl,
            method: "get",
        })
            .then(({ data }) => {
            const fields = ["code", "zh-cn", "en-us"];
            const list = data.data.list;
            const result = [fields];
            list.forEach(({ enUs, zhCn }) => {
                result.push([zhCn, zhCn, enUs]);
            });
            handleExcelData({
                xlsxData: result,
                excelJsonOutPutPath,
                ext: "json",
                incremental,
            });
            log_1.default.success(`Multiple language replacement success`);
        }, (err) => {
            log_1.default.error(`Multiple language replacement failure--start-------------`);
            log_1.default.error(err.response);
            log_1.default.error(`Multiple language replacement failure--end-------------`);
        });
    };
    getXLS();
};
exports.ajaxData = ajaxData;
exports.default = execLoadExcel;
