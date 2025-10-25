import pino from 'pino';

const level = process.env.LOG_LEVEL || 'info';

/**
 * Pino logger configuration
 * Provides structured logging for the application
 */
const logger = pino({
  level,
  // Only use pino-pretty in development, not in production/Docker
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
});

export default logger;
