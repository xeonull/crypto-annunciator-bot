import pkg from "telegraf";
const { Markup } = pkg;
import { getObjectMenu, getObjectMenuComplex } from "../../utils/menus.js";
import { NotificationTypeGet } from "../../../prisma/model.js";

/* Returns back keyboard and its buttons according to the language */
export const getCoinControlKeyboard = (ctx) => {
  const coinKeyboardAction = ctx.i18n.t("keyboards.coin_detail_keyboard.subscribe");
  const coinKeyboardDelete = ctx.i18n.t("keyboards.coin_detail_keyboard.delete");
  const coinKeyboardBack = ctx.i18n.t("keyboards.back_keyboard.back");
  let coinKeyboard = Markup.keyboard([[coinKeyboardAction, coinKeyboardDelete], [coinKeyboardBack]]);

  coinKeyboard = coinKeyboard.resize().extra();

  return {
    coinKeyboard,
    coinKeyboardAction,
    coinKeyboardDelete,
    coinKeyboardBack,
  };
};

export const showSubsMenu = async (ctx, is_edit = false) => {
  const cells = [];

  const n_types = await NotificationTypeGet();

  n_types.forEach((e) => {
    cells.push({ id: e.name, name: ctx.i18n.t(`scenes.detail.${e.name}`) });
  });

  const extra = getObjectMenu(cells, "notificationTypeSelected");
  const text = ctx.i18n.t("scenes.detail.pick_notification_type");
  is_edit ? ctx.editMessageText(text, extra) : ctx.reply(text, extra);
};
