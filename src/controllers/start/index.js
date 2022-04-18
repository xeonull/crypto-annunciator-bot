import { getLanguageKeyboard } from './helpers.js'
import { getMainKeyboard } from '../../utils/keyboards.js'
import { updateLanguage } from '../../utils/language.js'
import logger from '../../utils/logger.js'
import Telegraf from 'telegraf'
import { UserInit } from '../../../prisma/model.js'
import { saveToSession } from '../../utils/session.js'

const { leave } = Telegraf.Stage
const start = new Telegraf.BaseScene('start')

start.enter(async (ctx) => {
  logger.debug(ctx, 'Enter start scene')
  if (!ctx.session.user_id) {
    const user = await UserInit(ctx.chat.id, ctx.chat.username, ctx.chat.first_name, ctx.chat.last_name, ctx.i18n.languageCode)
    saveToSession(ctx, 'user_id', user.id)
    logger.debug(ctx, `User has been initializated`)
  }

  if (ctx.session.language) {
    ctx.scene.leave()
  } else {
    //     const now = new Date().getTime();
    await ctx.reply('Choose language / Выбери язык', getLanguageKeyboard())
  }
})

start.command('saveme', leave())

start.action(/languageChange/, async (ctx) => {
  const langData = JSON.parse(ctx.callbackQuery.data)
  await updateLanguage(ctx, langData.p)
  ctx.editMessageText(ctx.i18n.t('scenes.start.language_selected'))
  await ctx.answerCbQuery()
  ctx.scene.leave()
})

start.leave(async (ctx) => {
  logger.debug(ctx, 'Leaves start scene')
  await ctx.reply(
    ctx.i18n.t('scenes.start.welcome_back', {
      username: ctx.chat.username,
    })
  )
  await ctx.reply(ctx.i18n.t('scenes.start.bot_description'))
  const { mainKeyboard } = getMainKeyboard(ctx)
  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard)
})

export default start
