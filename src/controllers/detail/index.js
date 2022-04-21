//import { getMainKeyboard, getBackKeyboard } from "../../utils/keyboards.js";
//import { exposeCoin } from "./middlewares.js";
import { getCoinControlKeyboard } from "./helpers.js";
//import { getCoinMenu } from "../../utils/menus.js";
import { deleteFromSession } from "../../utils/session.js";
import { coingeckoApiPrice } from "../../utils/web.js";
import logger from "../../utils/logger.js";
import { UserCoinRemove } from "../../../prisma/model.js";
import Telegraf from "telegraf";
import TelegrafI18n from "telegraf-i18n";

const { match } = TelegrafI18n;
const { leave } = Telegraf.Stage;
const detail = new Telegraf.BaseScene("detail");

detail.enter(async (ctx) => {
  logger.debug(ctx, "Enter detail scene");
  try {
    const { price, market_cap } = await coingeckoApiPrice(ctx.session.coin.cg_id, ctx.session.currency);

    ctx.editMessageText(
      ctx.i18n.t("scenes.detail.price_market_cap", {
        ticker: ctx.session.coin.symbol,
        price: price.toLocaleString(ctx.i18n.languageCode),
        market_cap: market_cap.toLocaleString(ctx.i18n.languageCode),
        vs: ctx.session.currency.toUpperCase(),
      })
    );

    const { coinKeyboard } = getCoinControlKeyboard(ctx);
    ctx.reply(ctx.i18n.t("scenes.detail.what_next"), coinKeyboard);
  } catch (e) {
    logger.error(ctx, "Coin info getting failed with the error: %O", e);
  }
});

detail.command("saveme", leave());
detail.hears(match("keyboards.back_keyboard.back"), (ctx) => {
  ctx.scene.enter("coins");
});

detail.hears(match("keyboards.coin_detail_keyboard.delete"), async (ctx) => {
  try {
    await UserCoinRemove(ctx.session.coin.users[0].id);
  } catch (e) {
    logger.error(ctx, "Removing coin from user list failed with the error: %O", e);
  }
  ctx.scene.enter("coins");
});

detail.hears(match("keyboards.coin_detail_keyboard.tracking"), async (ctx) => {
  try {
    await UserCoinRemove(ctx.session.coin.users[0].id);
  } catch (e) {
    logger.error(ctx, "Removing coin from user list failed with the error: %O", e);
  }
  ctx.scene.enter("coins");
});

detail.leave(async (ctx) => {
  logger.debug(ctx, "Leaves detail scene");
  deleteFromSession(ctx, "coin");
});

export default detail;
