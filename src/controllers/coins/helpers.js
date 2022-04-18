import {  getBackKeyboard } from "../../utils/keyboards.js";
import pkg from "telegraf";
const { Markup } = pkg;

/* Returns back keyboard and its buttons according to the language */
export const getCoinControlKeyboard = (ctx) => {
  const coinKeyboardAction = ctx.i18n.t("keyboards.coin_keyboard.actions");
  const coinKeyboardDelete = ctx.i18n.t("keyboards.coin_keyboard.delete");
  const coinKeyboardBack = ctx.i18n.t("keyboards.coin_keyboard.back");
  let coinKeyboard = Markup.keyboard([[coinKeyboardAction, coinKeyboardDelete], [coinKeyboardBack]]);

  coinKeyboard = coinKeyboard.resize().extra();

  return {
    coinKeyboard,
    coinKeyboardAction,
    coinKeyboardDelete,
    coinKeyboardBack
  };
};

export const ggg = (ctx) => {
};
