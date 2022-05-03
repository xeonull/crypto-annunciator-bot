import logger from './logger.js';

//Wrapper to catch async errors within a stage. Helps to avoid try catch blocks in there
const asyncWrapper = (fn) => {
  return async function(ctx, next) {
    try {
      return await fn(ctx);
    } catch (error) {
      logger.error(ctx, 'asyncWrapper error, %O', error);
      await ctx.reply(ctx.i18n.t('shared.something_went_wrong'));
      return next();
    }
  };
};

export default asyncWrapper;
