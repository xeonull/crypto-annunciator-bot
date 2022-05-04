import { saveToSession } from "../../utils/session.js";
/* Exposes required movie according to the given callback data */
export function exposeCoin(ctx, next) {
  const selected_coin = JSON.parse(ctx.callbackQuery.data);
  if (ctx.session.coins) {
    saveToSession(ctx, "usercoin", ctx.session.coins.find((c) => c.id === selected_coin.p))
    return next();
  }
}
