// Checking the correctness of the user session
export const isUserExist = async (ctx, next) => {
  if (ctx.session.user_id) {
    return next();
  } else await ctx.reply(ctx.i18n.t("shared.need_start"));
};
