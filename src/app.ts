import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './routes/routes';
import { logger } from './config/logger.config';
import { errorHandler } from './middlewares/error.middleware';
import { morganMiddleware } from './middlewares/logger.middleware';

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

app.use(morganMiddleware);

app.use('/docs', swaggerUi.serve, (_req: Request, res: Response) => {
  import('../docs/swagger.json')
    .then(swaggerDoc => {
      res.send(swaggerUi.generateHTML(swaggerDoc));
    })
    .catch((error: unknown) => {
      logger.error(
        error instanceof Error
          ? error.message
          : 'Unexpected error has occurred.',
      );
      res.status(500).send('Failed to load Swagger documentation');
    });
});

app.use(morganMiddleware);

app.get('/health', (_req: Request, res: Response) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date(),
  };
  try {
    res.status(200).json(healthcheck);
  } catch {
    res.status(503).send();
  }
});

RegisterRoutes(app);

app.use(errorHandler);

export default app;
