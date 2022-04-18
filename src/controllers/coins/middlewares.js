/* Exposes required movie according to the given callback data */
export function exposeCoin(ctx, next) {
  const selected_coin = JSON.parse(ctx.callbackQuery.data);
  if (ctx.session.coins) {
    ctx.coin = ctx.session.coins.find((c) => c.id === selected_coin.p);
    return next();
  }
}
