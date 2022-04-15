import pkg from 'telegraf';
const { Markup } = pkg;

/**
 * Returns back keyboard and its buttons according to the language
 * @param ctx - telegram context
 */
export const getBackKeyboard = (ctx) => {
  const backKeyboardBack = ctx.i18n.t('keyboards.back_keyboard.back');
  let backKeyboard = Markup.keyboard([backKeyboardBack]);

  backKeyboard = backKeyboard.resize().extra();

  return {
    backKeyboard,
    backKeyboardBack
  };
};

/**
 * Returns main keyboard and its buttons according to the language
 * @param ctx - telegram context
 */
export const getMainKeyboard = (ctx) => {
  const mainKeyboardSearch = ctx.i18n.t('keyboards.main_keyboard.search');
  const mainKeyboardMyCoins = ctx.i18n.t('keyboards.main_keyboard.coins');
  const mainKeyboardSettings = ctx.i18n.t('keyboards.main_keyboard.settings');
  const mainKeyboardAbout = ctx.i18n.t('keyboards.main_keyboard.about');
  // const mainKeyboardSupport = ctx.i18n.t('keyboards.main_keyboard.support');
  // const mainKeyboardContact = ctx.i18n.t('keyboards.main_keyboard.contact');
  let mainKeyboard = Markup.keyboard([
    [mainKeyboardSearch, mainKeyboardMyCoins],
    [mainKeyboardSettings, mainKeyboardAbout],
    //[mainKeyboardSupport, mainKeyboardContact]
  ]);
  mainKeyboard = mainKeyboard.resize().extra();

  return {
    mainKeyboard,
    mainKeyboardSearch,
    mainKeyboardMyCoins,
    mainKeyboardSettings,
    mainKeyboardAbout,
    // mainKeyboardSupport,
    // mainKeyboardContact
  };
};
