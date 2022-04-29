import { showDetailMainMenu, showSubsMenu } from "./helpers.js";
//import { getCoinMenu } from "../../utils/menus.js";
//import { getBackKeyboard } from "../../utils/keyboards.js";
import { deleteFromSession, saveToSession } from "../../utils/session.js";
import { coingeckoApiPrice } from "../../utils/web.js";
import logger from "../../utils/logger.js";
import { UserCoinRemove, SubscriptionAdd, SubscriptionGet } from "../../../prisma/model.js";
import Telegraf from "telegraf";
import TelegrafI18n from "telegraf-i18n";

const { match } = TelegrafI18n;
const { leave } = Telegraf.Stage;
const detail = new Telegraf.BaseScene("detail");

detail.enter(async (ctx) => {
  logger.debug(ctx, "Enter detail scene");
  try {
    const data = await coingeckoApiPrice(ctx.session.coin.cg_id, ctx.session.currency);
    const price = data[ctx.session.coin.cg_id][ctx.session.currency]
    const market_cap = data[ctx.session.coin.cg_id][`${ctx.session.currency}_market_cap`]

    const subs = await SubscriptionGet(ctx.session.user_id, ctx.session.coin.users[0].id);

    const subsMessage = subs.length
      ? subs.reduce(
          (s, e) => `${s}\n\t${ctx.session.coin.symbol.toUpperCase()}/${e.currency.toUpperCase()}: ${e.limit_value} [${e.notification_type.name}]`,
          ""
        )
      : "—";

    await showDetailMainMenu(
      ctx,
      ctx.i18n.t("scenes.detail.overall_info", {
        ticker: ctx.session.coin.symbol,
        price: price.toLocaleString(ctx.i18n.languageCode),
        market_cap: market_cap.toLocaleString(ctx.i18n.languageCode),
        vs: ctx.session.currency.toUpperCase(),
        subs: subsMessage,
      })
    );
  } catch (e) {
    logger.error(ctx, "Coin info getting failed with the error: %O", e);
  }
});

detail.command("saveme", leave());
detail.hears(match("keyboards.back_keyboard.back"), (ctx) => {
  ctx.scene.enter("coins");
});

detail.action(/actionSelected/, async (ctx) => {
  const data = JSON.parse(ctx.callbackQuery.data);
  if (data.p == "del") {
    try {
      await UserCoinRemove(ctx.session.coin.users[0].id);
      logger.debug(ctx, "Coin %s removed from user list", ctx.session.coin.symbol);
    } catch (e) {
      logger.error(ctx, "Removing coin from user list failed with the error: %O", e);
    }
    ctx.scene.enter("coins");
  } else if (data.p == "sub") {
    await showSubsMenu(ctx);
  }
  await ctx.answerCbQuery();
});

detail.action(/notificationTypeSelected/, async (ctx) => {
  const data = JSON.parse(ctx.callbackQuery.data);
  if (data.p) {
    saveToSession(ctx, "subscibe_to", data.p);
    await ctx.editMessageText(ctx.i18n.t("scenes.detail.pick_limit_value"));
  }
  await ctx.answerCbQuery();
});

detail.hears(/^[0-9]+[\.\,0-9]+$/, async (ctx) => {
  if (ctx.session.subscibe_to) {
    const value = parseFloat(ctx.message.text);
    // logger.debug(ctx, "subscibe_to:::", ctx.session.subscibe_to);
    // logger.debug(ctx, "coin:::", ctx.session.coin);
    await SubscriptionAdd(ctx.session.coin.users[0].id, ctx.session.subscibe_to, value, ctx.session.currency);
    await ctx.reply(ctx.i18n.t("scenes.detail.subcribe_success"));
  }
});

detail.leave(async (ctx) => {
  logger.debug(ctx, "Leaves detail scene");
  deleteFromSession(ctx, "coin");
  deleteFromSession(ctx, "subscibe_to");
});

export default detail;
