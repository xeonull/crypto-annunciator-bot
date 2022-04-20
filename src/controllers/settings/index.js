import { showSettingsCurrencyMenu, showSettingsLanguageMenu, showSettingsMainMenu } from "./helpers.js";
import { getMainKeyboard, getBackKeyboard } from "../../utils/keyboards.js";
import { updateLanguage, updateCurrency } from "../../utils/settings.js";
import logger from "../../utils/logger.js";
import Telegraf from "telegraf";
import TelegrafI18n from "telegraf-i18n";

const { match } = TelegrafI18n;
const { leave } = Telegraf.Stage;
const settings = new Telegraf.BaseScene("settings");

settings.enter(async (ctx) => {
  logger.debug(ctx, "Enter settings scene");
  const { backKeyboard } = getBackKeyboard(ctx);
  await ctx.reply(ctx.i18n.t("scenes.settings.settings"), backKeyboard);
  //await ctx.telegram.editMessageText(1047160818, mmm.message_id, 0, "Settttttttttttings", backKeyboard);
  await showSettingsMainMenu(ctx);
});

settings.command("saveme", leave());
settings.hears(match("keyboards.back_keyboard.back"), leave());

settings.action(/settingSelected/, async (ctx) => {
  const data = JSON.parse(ctx.callbackQuery.data);
  if (data.p == "lang") await showSettingsLanguageMenu(ctx);
  else if (data.p == "curr") await showSettingsCurrencyMenu(ctx);
});

settings.action(/languageSelected/, async (ctx) => {
  const langData = JSON.parse(ctx.callbackQuery.data);
  await updateLanguage(ctx, langData.p);
  //await ctx.answerCbQuery();
  const { backKeyboard } = getBackKeyboard(ctx);
  await ctx.reply(ctx.i18n.t("scenes.settings.language_changed"), backKeyboard);
  await showSettingsMainMenu(ctx, true);
});

settings.action(/currencySelected/, async (ctx) => {
  const langData = JSON.parse(ctx.callbackQuery.data);
  await updateCurrency(ctx, langData.p);
  //await ctx.answerCbQuery();
  const { backKeyboard } = getBackKeyboard(ctx);
  await ctx.reply(ctx.i18n.t("scenes.settings.currency_changed", { currency: ctx.session.currency.toUpperCase() }), backKeyboard);
  await showSettingsMainMenu(ctx, true);
});

settings.action(/back/, async (ctx) => {
  await showSettingsMainMenu(ctx, true);
});

settings.leave(async (ctx) => {
  logger.debug(ctx, "Leaves settings scene");
  const { mainKeyboard } = getMainKeyboard(ctx);
  await ctx.reply(ctx.i18n.t("shared.what_next"), mainKeyboard);
});

export default settings;
