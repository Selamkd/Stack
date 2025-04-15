import chalk, { ChalkInstance } from 'chalk';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

interface LoggerConfig {
  level: LogLevel;
  timestamp: boolean;
}

const defaultConfig: LoggerConfig = {
  level: LogLevel.DEBUG,
  timestamp: true,
};

class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  private formatLogMessage(message: string) {
    if (this.config.timestamp) {
      const now = new Date();
      return `[${format(now, 'Pp')}]: ${message}`;
    }

    return message;
  }

  private log(
    level: LogLevel,
    levelStr: string,
    color: ChalkInstance,
    ...args: any[]
  ) {
    if (level < this.config.level) return;

    const message = args
      .map((arg) =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
      )
      .join(' ');

    const formattedMessage = this.formatLogMessage(message);

    console.log(color(`[${level}]`), formattedMessage);
  }
  debug(...args: any[]): void {
    this.log(LogLevel.DEBUG, 'DEBUG', chalk.blue, ...args);
  }

  info(...args: any[]): void {
    this.log(LogLevel.INFO, 'INFO', chalk.green, ...args);
  }

  warn(...args: any[]): void {
    this.log(LogLevel.WARN, 'WARN', chalk.yellow, ...args);
  }

  error(...args: any[]): void {
    this.log(LogLevel.ERROR, 'ERROR', chalk.red, ...args);
  }

  fatal(...args: any[]): void {
    this.log(LogLevel.FATAL, 'FATAL', chalk.bgRed.white, ...args);
  }

  middleware() {
    return (req: any, res: any, next: any) => {
      const start = Date.now();

      res.on('finish', () => {
        const duration = Date.now() - start;
        const message = `${req.method} ${req.url} ${res.statusCode} - ${duration}ms`;

        if (res.statusCode >= 500) {
          this.error(message);
        } else if (res.statusCode >= 400) {
          this.warn(message);
        } else {
          this.info(message);
        }
      });

      next();
    };
  }
}

const logger = new Logger();
export { Logger, LogLevel };
export default logger;
