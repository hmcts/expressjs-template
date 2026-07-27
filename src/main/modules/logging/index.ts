import { createLogger, format, type Logger, transports } from 'winston';

const rootLogger = createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  defaultMeta: {
    service: 'rpe-expressjs-template',
  },
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
  transports: [new transports.Console()],
});

export const getLogger = (component: string): Logger => rootLogger.child({ component });
