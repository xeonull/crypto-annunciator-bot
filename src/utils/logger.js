import util from 'util';
import winston, { format } from 'winston';

/* Adds user id and nickname if found. Also formats message to display complex objects */
function prepareMessage(ctx, msg, ...data) {
  const formattedMessage = data.length ? util.format(msg, ...data) : msg;

  if (ctx && ctx.from) {
    return `[${ctx.from.id}/${ctx.from.username}]: ${formattedMessage}`;
  }

  return `: ${formattedMessage}`;
}

const { combine, timestamp, printf } = format;
const logFormat = printf(info => {
  return `[${info.timestamp}] [${info.level}]${info.message}`;
});

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
    }),
    new winston.transports.File({ filename: 'debug.log', level: 'debug' })
  ],
  format: combine(timestamp(), format.splat(), format.simple(), logFormat)
});

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level');
}

const loggerWithCtx = {
  debug: (ctx, msg, ...data) =>
    logger.debug(prepareMessage(ctx, msg, ...data)),
  error: (ctx, msg, ...data) =>
    logger.error(prepareMessage(ctx, msg, ...data))
};

export default loggerWithCtx;
