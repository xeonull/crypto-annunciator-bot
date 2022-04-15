import { UserFindByTelegramID } from "../../prisma/model.js";
import logger from "../utils/logger.js";
import { saveToSession } from ".././utils/session.js";

// Modifies context and add some information about the user
export const getUserInfo = async (ctx, next) => {
  logger.debug(ctx, `inf:ctx.session.language: ${ctx.session.language}`);
  if (!ctx.session.language) {
    const user = await UserFindByTelegramID(ctx.from.id);

    // console.log("ctx:", ctx);
    // console.log("ctx.i18n:", ctx.i18n);
    // console.log("ctx.session.1:", ctx.session);

    logger.debug(ctx, `inf:user: ${JSON.stringify(user)}`);

    if (user) {
      saveToSession(ctx, "user_id", user.id);
      saveToSession(ctx, "language", user.language);
      ctx.i18n.locale(user.language);
    }
  }

  return next();
};
