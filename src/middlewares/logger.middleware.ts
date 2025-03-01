import morgan, { StreamOptions } from 'morgan';
import { logger } from '../config/logger.config';
import { config } from '../config/environment.config';

const stream: StreamOptions = {
  write: (message: string) => logger.http(message.trim()),
};

const skip = () => config.env === 'test';

export const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip },
);
