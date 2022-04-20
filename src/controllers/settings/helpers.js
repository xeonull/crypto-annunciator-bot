import { getObjectMenu, getObjectMenuComplex } from "../../utils/menus.js";

export const showSettingsMainMenu = async (ctx, is_edit = false) => {
  const extra = getObjectMenu(
    [
      { id: "lang", name: ctx.i18n.t("scenes.settings.language") },
      { id: "curr", name: ctx.i18n.t("scenes.settings.currency") },
    ],
    "settingSelected"
  );
  const text = ctx.i18n.t("scenes.settings.selected", { language: ctx.session.language.toUpperCase(), currency: ctx.session.currency.toUpperCase() });
  is_edit ? await ctx.editMessageText(text, extra) : await ctx.reply(text, extra);
};

export const showSettingsLanguageMenu = async (ctx) => {
  await ctx.editMessageText(
    ctx.i18n.t("scenes.settings.pick_language"),
    getObjectMenu(
      [
        { id: "en", name: "English" },
        { id: "ru", name: "Русский" },
      ],
      "languageSelected",
      true,
      ctx.i18n.t("keyboards.back_keyboard.back")
    )
  );
};

export const showSettingsCurrencyMenu = async (ctx) => {
  await ctx.editMessageText(
    ctx.i18n.t("scenes.settings.pick_currency"),
    getObjectMenuComplex(
      [
        { id: "usd", name: "USD" },
        { id: "eur", name: "EUR" },
        { id: "rub", name: "RUB" },
        { id: "uah", name: "UAH" },
        { id: "btc", name: "BTC" },
        { id: "eth", name: "ETH" },
      ],
      "currencySelected",
      true,
      ctx.i18n.t("keyboards.back_keyboard.back")
    )
  );
};
