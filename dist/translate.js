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
const translate_utils_1 = require("@ifreeovo/translate-utils");
const getAbsolutePath_1 = require("./utils/getAbsolutePath");
const log_1 = __importDefault(require("./utils/log"));
const constants_1 = require("./utils/constants");
const getLang_1 = __importDefault(require("./utils/getLang"));
const stateManager_1 = __importDefault(require("./utils/stateManager"));
const saveLocaleFile_1 = require("./utils/saveLocaleFile");
const flatObjectDeep_1 = require("./utils/flatObjectDeep");
const spreadObject_1 = require("./utils/spreadObject");
function translateByGoogle(word, locale, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!options.google || !((_a = options.google) === null || _a === void 0 ? void 0 : _a.proxy)) {
            log_1.default.error('翻译失败，当前翻译器为谷歌，请完善google配置参数');
            process.exit(1);
        }
        try {
            return yield (0, translate_utils_1.googleTranslate)(word, 'zh-CN', locale, options.google.proxy);
        }
        catch (e) {
            if (e.name === 'TooManyRequestsError') {
                log_1.default.error('翻译失败，请求超过谷歌api调用次数限制');
            }
            else {
                log_1.default.error('谷歌翻译请求出错', e);
            }
            process.exit(1);
        }
    });
}
function translateByYoudao(word, locale, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (!options.youdao || !((_a = options.youdao) === null || _a === void 0 ? void 0 : _a.key) || !((_b = options.youdao) === null || _b === void 0 ? void 0 : _b.secret)) {
            log_1.default.error('翻译失败，当前翻译器为有道，请完善youdao配置参数');
            process.exit(1);
        }
        try {
            return yield (0, translate_utils_1.youdaoTranslate)(word, 'zh-CN', locale, options.youdao);
        }
        catch (e) {
            log_1.default.error('有道翻译请求出错', e);
            process.exit(1);
        }
    });
}
function default_1(localePath, locales, oldPrimaryLang, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (![constants_1.GOOGLE, constants_1.YOUDAO].includes(options.translator || '')) {
            log_1.default.error('翻译失败，请确认translator参数是否配置正确');
            process.exit(1);
        }
        log_1.default.verbose('当前使用的翻译器：', options.translator);
        const primaryLangPath = (0, getAbsolutePath_1.getAbsolutePath)(process.cwd(), localePath);
        const newPrimaryLang = (0, flatObjectDeep_1.flatObjectDeep)((0, getLang_1.default)(primaryLangPath));
        const localeFileType = stateManager_1.default.getToolConfig().localeFileType;
        for (const targetLocale of locales) {
            log_1.default.info(`正在翻译${targetLocale}语言包`);
            const reg = new RegExp(`/[A-Za-z-]+.${localeFileType}`, 'g');
            const targetPath = localePath.replace(reg, `/${targetLocale}.${localeFileType}`);
            const targetLocalePath = (0, getAbsolutePath_1.getAbsolutePath)(process.cwd(), targetPath);
            let oldTargetLangPack = {};
            const newTargetLangPack = {};
            if (fs_extra_1.default.existsSync(targetLocalePath)) {
                oldTargetLangPack = (0, flatObjectDeep_1.flatObjectDeep)((0, getLang_1.default)(targetLocalePath));
            }
            else {
                fs_extra_1.default.ensureFileSync(targetLocalePath);
            }
            const keyList = Object.keys(newPrimaryLang);
            for (const key of keyList) {
                // 主语言同一个key的value不变，就复用原有的翻译结果
                const oldLang = (0, flatObjectDeep_1.flatObjectDeep)(oldPrimaryLang);
                const isNotChanged = oldLang[key] === newPrimaryLang[key];
                if (isNotChanged && oldTargetLangPack[key]) {
                    newTargetLangPack[key] = oldTargetLangPack[key];
                }
                else {
                    if (options.translator === constants_1.GOOGLE) {
                        newTargetLangPack[key] = yield translateByGoogle(newPrimaryLang[key], targetLocale, options);
                    }
                    else if (options.translator === constants_1.YOUDAO) {
                        newTargetLangPack[key] = yield translateByYoudao(newPrimaryLang[key], targetLocale, options);
                    }
                }
            }
            const fileContent = (0, spreadObject_1.spreadObject)(newTargetLangPack);
            (0, saveLocaleFile_1.saveLocaleFile)(fileContent, targetLocalePath);
            log_1.default.info(`完成${targetLocale}语言包翻译`);
        }
    });
}
exports.default = default_1;
