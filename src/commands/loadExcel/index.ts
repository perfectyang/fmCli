import axios from "axios";
import xlsx from "node-xlsx";
import type { StringObject } from "../../../types";
import { CommandOptions } from "../../../types/index";
import { getAbsolutePath } from "../../utils/getAbsolutePath";
import { getI18nConfig } from "../../utils/initConfig";
import { getLocaleDir } from "../../utils/getLocaleDir";
import StateManager from "../../utils/stateManager";
import { saveLocaleFile } from "../../utils/saveLocaleFile";
import log from "../../utils/log";
import getLang from "../../utils/getLang";
import merge from "lodash/merge";

interface ILang {
  enUs: string;
  zhCn: string;
}
// import { spreadObject } from '../../utils/spreadObject'

function getLangList(locales: string[], rows: string[][]): StringObject[] {
  const langList: Record<string, string>[] = [];
  const result: StringObject[] = [];

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

const handleExcelData = ({
  xlsxData,
  excelJsonOutPutPath,
  ext,
  incremental,
}: {
  xlsxData: any[];
  excelJsonOutPutPath?: string;
  ext: string;
  incremental: boolean;
}) => {
  // 获取待生成的语言
  const locales: any[] = xlsxData[0].slice(1);
  const rows = xlsxData.slice(1);
  const langList: StringObject[] = getLangList(locales, rows);

  // 将excel翻译内容更新到本地
  locales.forEach((locale, i) => {
    const localeDirPath = excelJsonOutPutPath || getLocaleDir();
    const currentLocalePath = getAbsolutePath(
      localeDirPath,
      `${locale}.${ext}`
    );
    const localePack = langList[i];
    log.verbose(`Written to the specified file:`, currentLocalePath);
    // 指定输出下有相同的文件，会一起合并数据
    let oldPrimaryLang: Record<string, string> = {};
    const primaryLangPath = getAbsolutePath(process.cwd(), currentLocalePath);
    oldPrimaryLang = getLang(primaryLangPath);
    const contentPack = merge(incremental ? oldPrimaryLang : {}, localePack);
    saveLocaleFile(contentPack, currentLocalePath);
    log.success(`${currentLocalePath}----> generate success!`);
  });
  log.success(`import complete!`);
};

function execLoadExcel(options: CommandOptions) {
  log.info(`正在导入excel翻译文件`);

  const i18nConfig = getI18nConfig(options);
  // 全局缓存脚手架配置
  StateManager.setToolConfig(i18nConfig);

  const { excelPath, excelJsonOutPutPath } = i18nConfig;
  const xlsxData = xlsx.parse(getAbsolutePath(process.cwd(), excelPath))[0]
    .data as string[][];
  if (xlsxData.length === 0) {
    return;
  }
  handleExcelData({
    xlsxData,
    excelJsonOutPutPath,
    ext: i18nConfig.localeFileType,
    incremental: i18nConfig.incremental ?? false,
  });
}

export const ajaxExcel = (options: CommandOptions) => {
  const i18nConfig = getI18nConfig(options);
  const { excelJsonOutPutPath, apiExcelUrl, incremental = false } = i18nConfig;
  const getXLS = () => {
    axios
      .request({
        responseType: "arraybuffer",
        url: apiExcelUrl,
        method: "get",
        headers: {
          "Content-Type": "blob",
        },
      })
      .then(
        (result) => {
          const workSheetsFromBuffer = xlsx.parse(result.data);
          handleExcelData({
            xlsxData: workSheetsFromBuffer[0].data,
            excelJsonOutPutPath,
            ext: "json",
            incremental,
          });
          log.success(`Multiple language replacement success`);
        },
        (err) => {
          console.log(err.response);
          log.error(`Multiple language replacement failure---------------`);
        }
      );
  };
  getXLS();
};
export const ajaxData = (options: CommandOptions) => {
  const i18nConfig = getI18nConfig(options);
  const { excelJsonOutPutPath, apiExcelUrl, incremental = false } = i18nConfig;
  const getXLS = () => {
    axios
      .request({
        url: apiExcelUrl,
        method: "get",
      })
      .then(
        ({ data }) => {
          const fields = ["code", "zh-cn", "en-us"];
          const list = data.data.list;
          const result = [fields];
          list.forEach(({ enUs, zhCn }: ILang) => {
            result.push([zhCn, zhCn, enUs]);
          });
          handleExcelData({
            xlsxData: result,
            excelJsonOutPutPath,
            ext: "json",
            incremental,
          });
          log.success(`Multiple language replacement success----api-interface`);
        },
        (err) => {
          log.error(
            `Multiple language replacement failure--start-------------`
          );
          log.error(JSON.stringify(err.response));
          log.error(`Multiple language replacement failure--end-------------`);
        }
      );
  };
  getXLS();
};

export default execLoadExcel;
