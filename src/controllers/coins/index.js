import { getMainKeyboard, getBackKeyboard } from "../../utils/keyboards.js";
import { exposeCoin } from "./middlewares.js";
import { getCoinMenuComplex } from "../../utils/menus.js";
import { saveToSession, deleteFromSession } from "../../utils/session.js";
import { saveMessageForDelete, deleteSavedMessage } from "../../utils/message.js";
import logger from "../../utils/logger.js";
import { UserCoinGet } from "../../../prisma/model.js";
import Telegraf from "telegraf";
import TelegrafI18n from "telegraf-i18n";

const { match } = TelegrafI18n;
const { leave } = Telegraf.Stage;
const coins = new Telegraf.BaseScene("coins");

coins.enter(async (ctx) => {
  logger.debug(ctx, "Enter coins scene");

  try {
    const coins = await UserCoinGet(ctx.session.user_id);

    const { backKeyboard } = getBackKeyboard(ctx);
    if (coins && coins.length) {
      await ctx.reply(ctx.i18n.t("scenes.coins.info_count", { count: coins.length }), backKeyboard);
      saveToSession(ctx, "coins", coins);
      saveMessageForDelete(ctx, await ctx.reply(ctx.i18n.t("scenes.coins.list_of_coins"), getCoinMenuComplex(coins, 2)));
    } else {
      await ctx.reply(ctx.i18n.t("scenes.coins.info_empty"), backKeyboard);
    }
  } catch (e) {
    logger.error(ctx, "User coin list getting failed with the error: %O", e);
  }
});

coins.command("saveme", leave());
coins.hears(match("keyboards.back_keyboard.back"), leave());

coins.action(/coin/, exposeCoin, async (ctx) => {
  try {
    logger.debug(ctx, "User select coin %O to set action", ctx.session.usercoin.coin.name);
    deleteSavedMessage(ctx, true)
    ctx.scene.enter("detail");
  } catch (e) {
    logger.error(ctx, "Choosing coin failed with the error: %O", e);
  }
  await ctx.answerCbQuery();
});

coins.leave(async (ctx) => {
  logger.debug(ctx, "Leaves coins scene");
  deleteSavedMessage(ctx, false)
  deleteFromSession(ctx, "coins");
  if (!ctx.session.usercoin) {
    const { mainKeyboard } = getMainKeyboard(ctx);
    await ctx.reply(ctx.i18n.t("shared.what_next"), mainKeyboard);
  }
});

export default coins;
