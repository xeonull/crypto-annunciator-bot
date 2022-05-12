import { getMainKeyboard, getBackKeyboard } from '../../utils/keyboards.js'
import { CoinPagination } from './helpers.js'
import { saveToSession, deleteFromSession } from '../../utils/session.js'
import { saveMessageForDelete, deleteSavedMessage } from '../../utils/message.js'
import logger from '../../utils/logger.js'
import { UserCoinGet } from '../../../prisma/model.js'
import Telegraf from 'telegraf'
import TelegrafI18n from 'telegraf-i18n'

const { match } = TelegrafI18n
const { leave } = Telegraf.Stage
const coins = new Telegraf.BaseScene('coins')

coins.enter(async (ctx) => {
  logger.debug(ctx, 'Enter coins scene')

  const coins = await UserCoinGet(ctx.session.user_id)

  const { backKeyboard } = getBackKeyboard(ctx)
  if (coins && coins.length) {
    await ctx.reply(ctx.i18n.t('scenes.coins.info_count', { count: coins.length }), backKeyboard)
    saveToSession(ctx, 'coins', coins)
    const { info, menu } = CoinPagination(coins, 1)
    saveMessageForDelete(ctx, await ctx.reply(ctx.i18n.t('scenes.coins.list_of_coins', { page: info }), menu))
  } else {
    await ctx.reply(ctx.i18n.t('scenes.coins.info_empty'), backKeyboard)
  }
})

coins.command('reset', leave())
coins.hears(match('keyboards.back_keyboard.back'), leave())

coins.action(/coin_next/, async (ctx) => {
  const bt = JSON.parse(ctx.callbackQuery.data)
  const { info, menu } = CoinPagination(ctx.session.coins, bt.p + 1)
  await ctx.editMessageText(ctx.i18n.t('scenes.coins.list_of_coins', { page: info }), menu)
})

coins.action(/coin_prev/, async (ctx) => {
  const bt = JSON.parse(ctx.callbackQuery.data)
  const { info, menu } = CoinPagination(ctx.session.coins, bt.p - 1)
  await ctx.editMessageText(ctx.i18n.t('scenes.coins.list_of_coins', { page: info }), menu)
})

coins.action(/coin/, async (ctx) => {
  try {
    const selected_coin = JSON.parse(ctx.callbackQuery.data)
    if (ctx.session.coins) {
      const usercoin = ctx.session.coins.find((c) => c.id === selected_coin.p)
      if (!usercoin) throw new Error(`Coin not found`)
      saveToSession(ctx, 'usercoin', usercoin)
      logger.debug(ctx, 'User select coin %O to set action', ctx.session.usercoin.coin.name)
      deleteSavedMessage(ctx, true)
      ctx.scene.enter('detail')
    }
  } catch (e) {
    logger.error(ctx, 'Choosing coin failed with the error: %O', e)
    await ctx.reply(ctx.i18n.t('shared.something_went_wrong'))
  }
  await ctx.answerCbQuery()
})

coins.leave(async (ctx) => {
  logger.debug(ctx, 'Leaves coins scene')
  deleteSavedMessage(ctx, false)
  deleteFromSession(ctx, 'coins')
  if (!ctx.session.usercoin) {
    const { mainKeyboard } = getMainKeyboard(ctx)
    await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard)
  }
})

export default coins
