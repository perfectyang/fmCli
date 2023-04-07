"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAbsolutePath = void 0;
const path_1 = __importDefault(require("path"));
const slash_1 = __importDefault(require("slash"));
function getAbsolutePath(...paths) {
    const ret = path_1.default.resolve(...paths);
    return (0, slash_1.default)(ret);
}
exports.getAbsolutePath = getAbsolutePath;
