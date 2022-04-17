import { getMainKeyboard, getBackKeyboard } from '../../utils/keyboards.js'
import { getCoinMenu } from '../../utils/menus.js'
import { saveToSession, deleteFromSession } from '../../utils/session.js'
import { coingeckoApiPrice } from '../../utils/web.js'
import logger from '../../utils/logger.js'
import { UserCoinGet } from '../../../prisma/model.js'
import Telegraf from 'telegraf'
import TelegrafI18n from 'telegraf-i18n'

const { match } = TelegrafI18n
const { leave } = Telegraf.Stage
const coins = new Telegraf.BaseScene('coins')

coins.enter(async (ctx) => {
  try {
    logger.debug(ctx, 'Enter coins scene')

    const coins = await UserCoinGet(ctx.session.user_id)

    await ctx.reply(ctx.i18n.t('scenes.coins.list_of_coins'), getCoinMenu(coins))
    saveToSession(ctx, 'coins', coins)
  } catch (e) {
    logger.error(ctx, 'User coin list getting failed with the error: %O', e)
  }
  const { backKeyboard } = getBackKeyboard(ctx)
  await ctx.reply(ctx.i18n.t('scenes.coins.add_action'), backKeyboard)
})

coins.command('saveme', leave())
coins.hears(match('keyboards.back_keyboard.back'), leave())

coins.action(/coin/, async (ctx) => {
  try {
    const selected_coin = JSON.parse(ctx.callbackQuery.data)
    if (ctx.session.coins) {
      ctx.coin = ctx.session.coins.find((c) => c.id === selected_coin.p)
      logger.debug(ctx, 'User select coin %O to set action', ctx.coin.name)
      const price = await coingeckoApiPrice(ctx.coin.cg_id)
      ctx.reply(ctx.i18n.t('scenes.coins.price', { ticker: ctx.coin.symbol, price }))
    }
  } catch (e) {
    logger.error(ctx, 'Choosing coin failed with the error: %O', e)
  }
  await ctx.answerCbQuery()
  ctx.scene.leave()
})

coins.leave(async (ctx) => {
  logger.debug(ctx, 'Leaves coins scene')
  const { mainKeyboard } = getMainKeyboard(ctx)
  deleteFromSession(ctx, 'coins')
  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard)
})

export default coins
