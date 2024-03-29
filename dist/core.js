"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const path_1 = __importDefault(require("path"));
const prettier_1 = __importDefault(require("prettier"));
const cli_progress_1 = __importDefault(require("cli-progress"));
const glob_1 = __importDefault(require("glob"));
const merge_1 = __importDefault(require("lodash/merge"));
const cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
const transform_1 = __importDefault(require("./transform"));
const log_1 = __importDefault(require("./utils/log"));
const getAbsolutePath_1 = require("./utils/getAbsolutePath");
const collector_1 = __importDefault(require("./collector"));
// import translate from './translate'
const getLang_1 = __importDefault(require("./utils/getLang"));
const constants_1 = require("./utils/constants");
const stateManager_1 = __importDefault(require("./utils/stateManager"));
const exportExcel_1 = __importDefault(require("./exportExcel"));
const initConfig_1 = require("./utils/initConfig");
const saveLocaleFile_1 = require("./utils/saveLocaleFile");
const assertType_1 = require("./utils/assertType");
function isValidInput(input) {
    const inputPath = (0, getAbsolutePath_1.getAbsolutePath)(process.cwd(), input);
    if (!fs_extra_1.default.existsSync(inputPath)) {
        log_1.default.error(`路径${inputPath}不存在,请重新设置input参数`);
        process.exit(1);
    }
    if (!fs_extra_1.default.statSync(inputPath).isDirectory()) {
        log_1.default.error(`路径${inputPath}不是一个目录,请重新设置input参数`);
        process.exit(1);
    }
    return true;
}
function getSourceFilePaths(input, exclude) {
    if (isValidInput(input)) {
        return glob_1.default.sync(`${input}/**/*.{cjs,mjs,js,ts,tsx,jsx,vue}`, {
            ignore: exclude,
        });
    }
    else {
        return [];
    }
}
function saveLocale(localePath) {
    const keyMap = collector_1.default.getKeyMap();
    const localeAbsolutePath = (0, getAbsolutePath_1.getAbsolutePath)(process.cwd(), localePath);
    if (!fs_extra_1.default.existsSync(localeAbsolutePath)) {
        fs_extra_1.default.ensureFileSync(localeAbsolutePath);
    }
    if (!fs_extra_1.default.statSync(localeAbsolutePath).isFile()) {
        log_1.default.error(`路径${localePath}不是一个文件,请重新设置localePath参数`);
        process.exit(1);
    }
    (0, saveLocaleFile_1.saveLocaleFile)(keyMap, localeAbsolutePath);
    log_1.default.verbose(`输出中文语言包到指定位置:`, localeAbsolutePath);
}
function getPrettierParser(ext) {
    switch (ext) {
        case "vue":
            return "vue";
        case "ts":
        case "tsx":
            return "babel-ts";
        default:
            return "babel";
    }
}
function getOutputPath(input, output, sourceFilePath) {
    let outputPath;
    if (output) {
        const filePath = sourceFilePath.replace(input + "/", "");
        outputPath = (0, getAbsolutePath_1.getAbsolutePath)(process.cwd(), output, filePath);
        fs_extra_1.default.ensureFileSync(outputPath);
    }
    else {
        outputPath = (0, getAbsolutePath_1.getAbsolutePath)(process.cwd(), sourceFilePath);
    }
    return outputPath;
}
function formatInquirerResult(answers) {
    if (answers.translator === constants_1.YOUDAO) {
        return {
            translator: answers.translator,
            youdao: {
                key: answers.key,
                secret: answers.secret,
            },
        };
    }
    else {
        return {
            translator: answers.translator,
            google: {
                proxy: answers.proxy,
            },
        };
    }
}
function getTranslationConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        const cachePath = (0, getAbsolutePath_1.getAbsolutePath)(__dirname, "../.cache/configCache.json");
        fs_extra_1.default.ensureFileSync(cachePath);
        const cache = fs_extra_1.default.readFileSync(cachePath, "utf8") || "{}";
        const oldConfigCache = JSON.parse(cache);
        const answers = yield inquirer_1.default.prompt([
            {
                type: "list",
                name: "translator",
                message: "请选择翻译接口",
                default: constants_1.YOUDAO,
                choices: [
                    { name: "有道翻译", value: constants_1.YOUDAO },
                    { name: "谷歌翻译", value: constants_1.GOOGLE },
                ],
                when(answers) {
                    return !answers.skipTranslate;
                },
            },
            {
                type: "input",
                name: "proxy",
                message: "使用谷歌服务需要翻墙，请输入代理地址",
                default: oldConfigCache.proxy || "",
                when(answers) {
                    return answers.translator === constants_1.GOOGLE;
                },
                validate(input) {
                    return input.length === 0 ? "代理地址不能为空" : true;
                },
            },
            {
                type: "input",
                name: "key",
                message: "请输入有道翻译appKey",
                default: oldConfigCache.key || "",
                when(answers) {
                    return answers.translator === constants_1.YOUDAO;
                },
                validate(input) {
                    return input.length === 0 ? "appKey不能为空" : true;
                },
            },
            {
                type: "input",
                name: "secret",
                message: "请输入有道翻译appSecret",
                default: oldConfigCache.secret || "",
                when(answers) {
                    return answers.translator === constants_1.YOUDAO;
                },
                validate(input) {
                    return input.length === 0 ? "appSecret不能为空" : true;
                },
            },
        ]);
        const newConfigCache = Object.assign(oldConfigCache, answers);
        fs_extra_1.default.writeFileSync(cachePath, JSON.stringify(newConfigCache), "utf8");
        const result = formatInquirerResult(answers);
        return result;
    });
}
function formatCode(code, ext, prettierConfig) {
    let stylizedCode = code;
    if ((0, assertType_1.isObject)(prettierConfig)) {
        stylizedCode = prettier_1.default.format(code, Object.assign(Object.assign({}, prettierConfig), { parser: getPrettierParser(ext) }));
        log_1.default.verbose(`格式化代码完成`);
    }
    else if (prettierConfig === true) {
        stylizedCode = prettier_1.default.format(code, {
            semi: false,
            singleQuote: true,
            parser: getPrettierParser(ext),
        });
        log_1.default.verbose(`格式化代码完成`);
    }
    return stylizedCode;
}
function default_1(options) {
    return __awaiter(this, void 0, void 0, function* () {
        let i18nConfig = (0, initConfig_1.getI18nConfig)(options);
        if (!i18nConfig.skipTranslate) {
            const translationConfig = yield getTranslationConfig();
            i18nConfig = (0, merge_1.default)(i18nConfig, translationConfig);
        }
        // 全局缓存脚手架配置
        stateManager_1.default.setToolConfig(i18nConfig);
        const { input, exclude, output, rules, localePath, 
        // locales,
        skipExtract, adjustKeyMap, } = i18nConfig;
        log_1.default.debug(`命令行配置信息:`, i18nConfig);
        console.log("input", input);
        let oldPrimaryLang = {};
        const primaryLangPath = (0, getAbsolutePath_1.getAbsolutePath)(process.cwd(), localePath);
        oldPrimaryLang = (0, getLang_1.default)(primaryLangPath);
        if (!skipExtract) {
            log_1.default.info("正在转换中文，请稍等...");
            const sourceFilePaths = getSourceFilePaths(input, exclude);
            const bar = new cli_progress_1.default.SingleBar({
                format: `${chalk_1.default.cyan("提取进度:")} [{bar}] {percentage}% {value}/{total}`,
            }, cli_progress_1.default.Presets.shades_classic);
            const startTime = new Date().getTime();
            bar.start(sourceFilePaths.length, 0);
            sourceFilePaths.forEach((sourceFilePath) => {
                const sourceCode = fs_extra_1.default.readFileSync(sourceFilePath, "utf8");
                const ext = path_1.default
                    .extname(sourceFilePath)
                    .replace(".", "");
                collector_1.default.resetCountOfAdditions();
                collector_1.default.setCurrentCollectorPath(sourceFilePath);
                const { code } = (0, transform_1.default)(sourceCode, ext, rules, sourceFilePath);
                log_1.default.verbose(`完成中文提取和语法转换:`, sourceFilePath);
                // 只有文件提取过中文时，才重新写入文件
                if (collector_1.default.getCountOfAdditions() > 0) {
                    const stylizedCode = formatCode(code, ext, i18nConfig.prettier);
                    const outputPath = getOutputPath(input, output, sourceFilePath);
                    fs_extra_1.default.writeFileSync(outputPath, stylizedCode, "utf8");
                    log_1.default.verbose(`生成文件:`, outputPath);
                }
                // 自定义当前文件的keyMap
                if (adjustKeyMap) {
                    const newkeyMap = adjustKeyMap((0, cloneDeep_1.default)(collector_1.default.getKeyMap()), collector_1.default.getCurrentFileKeyMap(), sourceFilePath);
                    collector_1.default.setKeyMap(newkeyMap);
                    collector_1.default.resetCurrentFileKeyMap();
                }
                bar.increment();
            });
            // 增量转换时，保留之前的提取的中文结果
            if (i18nConfig.incremental) {
                const newkeyMap = (0, merge_1.default)(oldPrimaryLang, collector_1.default.getKeyMap());
                collector_1.default.setKeyMap(newkeyMap);
            }
            saveLocale(localePath);
            bar.stop();
            const endTime = new Date().getTime();
            log_1.default.info(`耗时${((endTime - startTime) / 1000).toFixed(2)}s`);
        }
        console.log(""); // 空一行
        // if (!skipTranslate) {
        //   await translate(localePath, locales, oldPrimaryLang, {
        //     translator: i18nConfig.translator,
        //     google: i18nConfig.google,
        //     youdao: i18nConfig.youdao,
        //   })
        // }
        log_1.default.success("转换完毕!");
        if (i18nConfig.exportExcel) {
            log_1.default.info(`正在导出excel翻译文件`);
            (0, exportExcel_1.default)();
            log_1.default.success(`导出完毕!`);
        }
    });
}
exports.default = default_1;
