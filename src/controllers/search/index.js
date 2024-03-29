import { SearchPagination } from './helpers.js'
import { getMainKeyboard, getBackKeyboard } from '../../utils/keyboards.js'
import { saveToSession, deleteFromSession } from '../../utils/session.js'
import { saveMessageForDelete, deleteSavedMessage } from '../../utils/message.js'
import { coingeckoApiSearch } from '../../utils/web.js'
import logger from '../../utils/logger.js'
import Telegraf from 'telegraf'
import { CoinAdd, UserCoinGet, UserCoinAdd, UserCoinRestore } from '../../../prisma/model.js'
import TelegrafI18n from 'telegraf-i18n'

const { match } = TelegrafI18n
const { leave } = Telegraf.Stage
const search = new Telegraf.BaseScene('search')

search.enter(async (ctx) => {
  logger.debug(ctx, 'Enter search scene')
  const { backKeyboard } = getBackKeyboard(ctx)
  await ctx.replyWithHTML(ctx.i18n.t('scenes.search.before_search_message'), backKeyboard)
})

search.command('reset', leave())
search.hears(match('keyboards.back_keyboard.back'), leave())

search.on('text', async (ctx) => {
  logger.debug(ctx, 'Searching for "%s"', ctx.message.text)
  try {
    deleteFromSession(ctx, 'coins')
    deleteSavedMessage(ctx)

    const results = await coingeckoApiSearch(ctx.message.text)

    if (!results || !results.length) return ctx.reply(ctx.i18n.t('scenes.search.results_not_found'))
    else {
      saveToSession(ctx, 'coins', results)
      await ctx.reply(ctx.i18n.t('scenes.search.results_count', { count: results.length }))
      const { info, menu } = SearchPagination(results, 1)
      saveMessageForDelete(ctx, await ctx.reply(ctx.i18n.t('scenes.search.results', { page: info }), menu))
    }
  } catch (e) {
    logger.error(ctx, 'Search failed with the error: %O', e)
    await ctx.reply(ctx.i18n.t('shared.something_went_wrong'))
  }
})

search.action(/coin_next/, async (ctx) => {
  const bt = JSON.parse(ctx.callbackQuery.data)
  const { info, menu } = SearchPagination(ctx.session.coins, bt.p + 1)
  await ctx.editMessageText(ctx.i18n.t('scenes.search.results', { page: info }), menu)
})

search.action(/coin_prev/, async (ctx) => {
  const bt = JSON.parse(ctx.callbackQuery.data)
  const { info, menu } = SearchPagination(ctx.session.coins, bt.p - 1)
  await ctx.editMessageText(ctx.i18n.t('scenes.search.results', { page: info }), menu)
})

search.action(/coin/, async (ctx) => {
  try {
    const selected_coin = JSON.parse(ctx.callbackQuery.data)
    if (ctx.session.coins) {
      ctx.coin = ctx.session.coins.find((c) => c.id === selected_coin.p)
      if (!ctx.coin) throw new Error(`Coin not found`)
      logger.debug(ctx, 'User is adding coin %O to own list', ctx.coin.id)

      const added_coin = await CoinAdd(ctx.coin.id, ctx.coin.name, ctx.coin.symbol)

      const user_coin = await UserCoinGet(ctx.session.user_id, added_coin.id)

      deleteSavedMessage(ctx, true)
      if (!user_coin) {
        await UserCoinAdd(ctx.session.user_id, added_coin.id)
        ctx.editMessageText(
          ctx.i18n.t('scenes.search.coin_added', {
            coin: added_coin.name,
            symbol: added_coin.symbol,
          })
        )
      } else if (user_coin.is_removed) {
        await UserCoinRestore(user_coin.id)
        ctx.editMessageText(
          ctx.i18n.t('scenes.search.coin_added', {
            coin: added_coin.name,
            symbol: added_coin.symbol,
          })
        )
      } else
        ctx.editMessageText(
          ctx.i18n.t('scenes.search.coin_already_added', {
            coin: added_coin.name,
            symbol: added_coin.symbol,
          })
        )
    }
  } catch (e) {
    logger.error(ctx, 'Choosing coin failed with the error: %O', e)
    await ctx.reply(ctx.i18n.t('shared.something_went_wrong'))
  }
  await ctx.answerCbQuery()
  ctx.scene.leave()
})

search.leave(async (ctx) => {
  logger.debug(ctx, 'Leaves search scene')
  const { mainKeyboard } = getMainKeyboard(ctx)
  deleteFromSession(ctx, 'coins')
  deleteSavedMessage(ctx)
  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard)
})

export default search
