type LogLevel = 'log' | 'info' | 'warn' | 'error';

interface Logger {
    log(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
}

interface LoggerOptions {
    pluginName: string;
    color?: string; // Optional: default is blue
}

class PrettyLogger implements Logger {
    private pluginName: string;
    private color: string;

    constructor({ pluginName, color = '#007BFF' }: LoggerOptions) {
        this.pluginName = pluginName;
        this.color = color;
    }

    private format(level: LogLevel, message: string, args: any[]) {
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

    log(message: string, ...args: any[]) {
        this.format('log', message, args);
    }

    info(message: string, ...args: any[]) {
        this.format('info', message, args);
    }

    warn(message: string, ...args: any[]) {
        this.format('warn', message, args);
    }

    error(message: string, ...args: any[]) {
        this.format('error', message, args);
    }
}

class LoggerFactory {
    private static instances: Map<string, Logger> = new Map();

    static getLogger(pluginName: string, color?: string): Logger {
        const key = pluginName.toLowerCase();
        if (!this.instances.has(key)) {
            this.instances.set(key, new PrettyLogger({ pluginName, color }));
        }
        return this.instances.get(key)!;
    }
}

export default LoggerFactory;