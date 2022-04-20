import logger from "./logger.js";
import { saveToSession } from "./session.js";
import { UserUpdateLanguage ,UserUpdateCurrency } from "../../prisma/model.js";

/* Function that updates language for the current user in all known places */
export async function updateLanguage(ctx, newLang) {
  logger.debug(ctx, "Updating language for user to %s", newLang);
  await UserUpdateLanguage(ctx.session.user_id, newLang);

  saveToSession(ctx, "language", newLang);

  ctx.i18n.locale(newLang);
}

/* Function that updates currency for the current user in all known places */
export async function updateCurrency(ctx, newCurr) {
  logger.debug(ctx, "Updating currency for user to %s", newCurr);
  await UserUpdateCurrency(ctx.session.user_id, newCurr);
  
  saveToSession(ctx, "currency", newCurr);
}
