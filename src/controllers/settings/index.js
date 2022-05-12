import { showSettingsCurrencyMenu, showSettingsLanguageMenu, showSettingsMainMenu } from "./helpers.js";
import { getMainKeyboard, getBackKeyboard } from "../../utils/keyboards.js";
import { updateLanguage, updateCurrency } from "../../utils/settings.js";
import { saveMessageForDelete, deleteSavedMessage } from "../../utils/message.js";
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

  saveMessageForDelete(ctx, await showSettingsMainMenu(ctx));
});

settings.command("reset", leave());
settings.hears(match("keyboards.back_keyboard.back"), leave());

settings.action(/settingSelected/, async (ctx) => {
  try {
    const data = JSON.parse(ctx.callbackQuery.data);
    await ctx.answerCbQuery();
    if (data.p == "lang") showSettingsLanguageMenu(ctx);
    else if (data.p == "curr") showSettingsCurrencyMenu(ctx);
  } catch (e) {
    logger.error(ctx, "Selected setting failed with the error: %O", e);
    await ctx.reply(ctx.i18n.t("shared.something_went_wrong"));
  }
});

settings.action(/languageSelected/, async (ctx) => {
  try {
    const langData = JSON.parse(ctx.callbackQuery.data);
    await updateLanguage(ctx, langData.p);
    await ctx.answerCbQuery();
    const { backKeyboard } = getBackKeyboard(ctx);
    await ctx.reply(ctx.i18n.t("scenes.settings.language_changed"), backKeyboard);
    showSettingsMainMenu(ctx, true);
  } catch (e) {
    logger.error(ctx, "Updating language failed with the error: %O", e);
    await ctx.reply(ctx.i18n.t("shared.something_went_wrong"));
  }
});

settings.action(/currencySelected/, async (ctx) => {
  try {
    const langData = JSON.parse(ctx.callbackQuery.data);
    await updateCurrency(ctx, langData.p);
    await ctx.answerCbQuery();
    const { backKeyboard } = getBackKeyboard(ctx);
    await ctx.reply(ctx.i18n.t("scenes.settings.currency_changed", { currency: ctx.session.currency.toUpperCase() }), backKeyboard);
    showSettingsMainMenu(ctx, true);
  } catch (e) {
    logger.error(ctx, "Updating currency failed with the error: %O", e);
    await ctx.reply(ctx.i18n.t("shared.something_went_wrong"));
  }
});

settings.action(/back/, async (ctx) => {
  await ctx.answerCbQuery();
  showSettingsMainMenu(ctx, true);
});

settings.leave(async (ctx) => {
  logger.debug(ctx, "Leaves settings scene");
  deleteSavedMessage(ctx);
  const { mainKeyboard } = getMainKeyboard(ctx);
  ctx.reply(ctx.i18n.t("shared.what_next"), mainKeyboard);
});

export default settings;
