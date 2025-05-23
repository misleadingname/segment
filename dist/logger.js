"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PrettyLogger {
    pluginName;
    color;
    constructor({ pluginName, color = '#007BFF' }) {
        this.pluginName = pluginName;
        this.color = color;
    }
    format(level, message, args) {
        const chipStyle = `
      background: ${this.color};
      color: white;
      border-radius: 4px;
      padding: 2px 6px;
      font-weight: bold;
      font-family: monospace;
    `;
        const plainStyle = '';
        console[level](`%c[${this.pluginName}]%c ${message}`, chipStyle, plainStyle, ...args);
    }
    log(message, ...args) {
        this.format('log', message, args);
    }
    info(message, ...args) {
        this.format('info', message, args);
    }
    warn(message, ...args) {
        this.format('warn', message, args);
    }
    error(message, ...args) {
        this.format('error', message, args);
    }
}
class LoggerFactory {
    static instances = new Map();
    static getLogger(pluginName, color) {
        const key = pluginName.toLowerCase();
        if (!this.instances.has(key)) {
            this.instances.set(key, new PrettyLogger({ pluginName, color }));
        }
        return this.instances.get(key);
    }
}
exports.default = LoggerFactory;
