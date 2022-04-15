import { languageChangeAction } from "./actions.js";
import { getLanguageKeyboard } from "./helpers.js";
import logger from "../../utils/logger.js";
//import User from '../../models/User';
import { getMainKeyboard } from "../../utils/keyboards.js";
import Telegraf from "telegraf";

const { leave } = Telegraf.Stage;
const coins = new Telegraf.BaseScene("coins");

coins.enter(async (ctx) => {

  //}
});

coins.leave(async (ctx) => {
  const { mainKeyboard } = getMainKeyboard(ctx);

  await ctx.reply(ctx.i18n.t("shared.what_next"), mainKeyboard);
});

coins.command("saveme", leave());
coins.action(/confirmAccount/, async (ctx) => {
  await ctx.answerCbQuery();
  ctx.scene.leave();
});

export default coins;
