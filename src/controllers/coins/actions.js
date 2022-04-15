import { getAccountConfirmKeyboard } from './helpers.js';
//import { sleep } from '../../util/common';
import { updateLanguage } from '../../utils/language.js';

export const languageChangeAction = async (ctx) => {
  const langData = JSON.parse(ctx.callbackQuery.data);
  await updateLanguage(ctx, langData.p);
  const accountConfirmKeyboard = getAccountConfirmKeyboard(ctx);
  accountConfirmKeyboard.disable_web_page_preview = true;

  //await ctx.reply(ctx.i18n.t('scenes.start.new_account'));
  //await sleep(3);
  await ctx.reply(ctx.i18n.t('scenes.start.bot_description'), accountConfirmKeyboard);

  await ctx.answerCbQuery();
};
