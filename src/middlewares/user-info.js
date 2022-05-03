import { UserFindByTelegramID } from "../../prisma/model.js";
import logger from "../utils/logger.js";
import { saveToSession } from ".././utils/session.js";
import { updateLanguage } from "../utils/settings.js";

// Modifies context and add some information about the user
export const getUserInfo = async (ctx, next) => {
  if (!ctx.session.language) {
    const user = await UserFindByTelegramID(ctx.from.id);
    if (user) {
      saveToSession(ctx, "user_id", user.id);
      saveToSession(ctx, "currency", user.currency);
      if (user.language) {
        saveToSession(ctx, "language", user.language);
        ctx.i18n.locale(user.language);
      }
      // If the user's language is missing
      else await updateLanguage(ctx, ctx.i18n.languageCode);
    }
  }

  return next();
};
