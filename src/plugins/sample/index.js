"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = start;
exports.stop = stop;
const logger_1 = __importDefault(require("../../logger"));
const logger = logger_1.default.getLogger("Sample");
function start() {
    logger.info("hi sigmas");
}
function stop() {
    logger.info("bye sigmas");
}
