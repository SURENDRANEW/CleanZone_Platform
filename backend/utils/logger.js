const winston = require('winston');
const { combine, timestamp, printf, colorize, json } = winston.format;
const fs = require('fs');
const path = require('path');
const logDir = 'logs';

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length) {
    msg += ' ' + JSON.stringify(metadata);
  }
  return msg;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json(),
    colorize()
  ),
  transports: [
    new winston.transports.Console({ format: combine(colorize(), logFormat) }),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: combine(timestamp(), json())
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: combine(timestamp(), json())
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(logDir, 'exceptions.log') })
  ]
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
});

module.exports = logger;
