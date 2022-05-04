import logger from "./logger.js";

/* Saving data to the session */
export function saveToSession(ctx, field, data) {
  logger.debug(ctx, "Saving %s to session", field);
  ctx.session[field] = data;
}

/* Removing data from the session */
export function deleteFromSession(ctx, field) {
  logger.debug(ctx, "Deleting %s from session", field);
  delete ctx.session[field];
}
