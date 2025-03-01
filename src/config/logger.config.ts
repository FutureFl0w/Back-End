import { createLogger, format, transports } from 'winston';
import { config } from './environment.config';

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = createLogger({
  level: config.env === 'beta' ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    colorize({ all: config.env === 'beta' }),
    logFormat,
  ),
  transports: [
    new transports.Console(),
    ...(config.env === 'production'
      ? [
          new transports.File({ filename: 'logs/error.log', level: 'error' }),
          new transports.File({ filename: 'logs/combined.log' }),
        ]
      : []),
  ],
  exitOnError: false,
});

logger.add(
  new transports.Console({
    level: 'http',
    format: combine(
      colorize({ all: config.env === 'development' }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat,
    ),
  }),
);
