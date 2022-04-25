import { getMainKeyboard, getBackKeyboard } from "../../utils/keyboards.js";
import { exposeCoin } from "./middlewares.js";
import { getCoinMenuComplex } from "../../utils/menus.js";
import { saveToSession, deleteFromSession } from "../../utils/session.js";
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
    saveToSession(ctx, "coins", coins);
    await ctx.reply(ctx.i18n.t("scenes.coins.list_of_coins"), getCoinMenuComplex(coins));
  } catch (e) {
    logger.error(ctx, "User coin list getting failed with the error: %O", e);
  }

  const { backKeyboard } = getBackKeyboard(ctx);
  // const message = await ctx.reply(ctx.i18n.t("scenes.coins.choose_coin"), backKeyboard);
  // saveToSession(ctx, "del_message_id", message.message_id);
});

coins.command("saveme", leave());
coins.hears(match("keyboards.back_keyboard.back"), leave());

coins.action(/coin/, exposeCoin, async (ctx) => {
  try {
    logger.debug(ctx, "User select coin %O to set action", ctx.session.coin.name);
    await ctx.answerCbQuery();
    ctx.scene.enter("detail");
  } catch (e) {
    logger.error(ctx, "Choosing coin failed with the error: %O", e);
  }
});

coins.leave(async (ctx) => {
  logger.debug(ctx, "Leaves coins scene");
  // if (ctx.session.del_message_id) {
  //   ctx.deleteMessage(ctx.session.del_message_id);
  //   deleteFromSession(ctx, "del_message_id");
  // }
  deleteFromSession(ctx, "coins");
  if (!ctx.session.coin) {
    const { mainKeyboard } = getMainKeyboard(ctx);
    await ctx.reply(ctx.i18n.t("shared.what_next"), mainKeyboard);
  }
});

export default coins;
