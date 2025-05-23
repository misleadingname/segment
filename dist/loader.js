"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mainHook_1 = require("./mainHook");
const renderHook_1 = require("./renderHook");
const logger_1 = __importDefault(require("./logger"));
const CoreLogger = logger_1.default.getLogger("Core");
CoreLogger.log("hi sigmas");
(0, mainHook_1.injectMain)();
(0, renderHook_1.injectRenderer)();
require("./plugins/sample/index");
