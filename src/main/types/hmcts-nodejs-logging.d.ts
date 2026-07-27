declare module '@hmcts/nodejs-logging' {
  export class Logger {
    static getLogger(name: string): Logger;

    debug(message: unknown, ...args: unknown[]): void;
    info(message: unknown, ...args: unknown[]): void;
    warn(message: unknown, ...args: unknown[]): void;
    error(message: unknown, ...args: unknown[]): void;
  }
}
