"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.translate = void 0;
const initConfig_1 = require("../../utils/initConfig");
const core_1 = __importDefault(require("../../core"));
function translate(options) {
    const i18nConfig = (0, initConfig_1.getI18nConfig)(options);
    return (0, core_1.default)(i18nConfig);
}
exports.translate = translate;
function test() {
    console.log('qqqq');
}
exports.test = test;
