import logger from "../../utils/logger.js";
import { getMainKeyboard, getBackKeyboard } from "../../utils/keyboards.js";
import Telegraf from "telegraf";
import TelegrafI18n from "telegraf-i18n";
import { bot } from "../../telegram.js";

const { match } = TelegrafI18n;
const { leave } = Telegraf.Stage;
const contact = new Telegraf.BaseScene("contact");

contact.enter(async (ctx) => {
  logger.debug(ctx, "Enter contact scene");

  const { backKeyboard } = getBackKeyboard(ctx);
  await ctx.reply(ctx.i18n.t("scenes.contact.write_to_admin"), backKeyboard);
});

contact.command("reset", leave());
contact.hears(match("keyboards.back_keyboard.back"), leave());

contact.on("text", async (ctx) => {
  try {
    const ctx_arr = Object.entries(ctx.from);
    const sender = ctx_arr.reduce((s, v) => `${s}\n\t\t<b>${v[0]}:</b> ${v[1]}`, "");
    const message = `<b>From:</b>${sender}\n\n<b>Message:</b> ${ctx.message.text}`;
    await bot.telegram.sendMessage(process.env.ADMIN_ID, message, { parse_mode: "HTML" });
    await ctx.reply(ctx.i18n.t("scenes.contact.message_delivered"));
  } catch (e) {
    logger.error(ctx, "Contacts failed with the error: %O", e);
    await ctx.reply(ctx.i18n.t("shared.something_went_wrong"));
  }
  ctx.scene.leave();
});

contact.leave(async (ctx) => {
  logger.debug(ctx, "Leaves contact scene");
  const { mainKeyboard } = getMainKeyboard(ctx);
  await ctx.reply(ctx.i18n.t("shared.what_next"), mainKeyboard);
});

export default contact;
