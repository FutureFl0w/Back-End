import { Request } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { logger } from '../config/logger.config';

export const expressAuthentication = (
  request: Request,
  securityName: string,
  roles?: string[],
): Promise<true> => {
  if (securityName === 'jwt') {
    const authHeader = request.headers.authorization;

    return new Promise((resolve, reject) => {
      if (!authHeader) {
        logger.warn(`Authorization header missing`, {
          url: request.url,
          method: request.method,
          ip: request.ip,
        });
        return reject(new Error('Unauthorized: Authorization header missing'));
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        logger.warn(`Token missing in authorization header`, {
          url: request.url,
          method: request.method,
          ip: request.ip,
        });
        return reject(new Error('Unauthorized: Token missing'));
      }

      try {
        const decoded = verifyToken(token);

        logger.info(`Authenticated request`, {
          url: request.url,
          method: request.method,
          ip: request.ip,
          userId: decoded.id,
        });

        (request as any).user = decoded;
        resolve(true);
      } catch (error: unknown) {
        logger.error(`Invalid or expired token`, {
          url: request.url,
          method: request.method,
          ip: request.ip,
          error:
            error instanceof Error ? error.message : 'Invalid or Expired Token',
        });
        return reject(new Error('Unauthorized: Invalid or expired token'));
      }
    });
  }

  logger.warn(`Unsupported security scheme: ${securityName}`, {
    url: request.url,
    method: request.method,
    ip: request.ip,
  });
  return Promise.reject(new Error('Unauthorized: Unsupported security scheme'));
};
