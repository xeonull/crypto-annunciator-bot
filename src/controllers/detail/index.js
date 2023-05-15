import { showDetailMainMenu, showSubsMenu } from './helpers.js'
import { deleteFromSession, saveToSession } from '../../utils/session.js'
import { saveMessageForDelete, deleteSavedMessage } from '../../utils/message.js'
import { coingeckoApiPriceMarketCap } from '../../utils/web.js'
import logger from '../../utils/logger.js'
import { UserCoinRemove, SubscriptionAdd, SubscriptionGet, SubscriptionDeactivateUserCoin } from '../../../prisma/model.js'
import Telegraf from 'telegraf'
import TelegrafI18n from 'telegraf-i18n'

const { match } = TelegrafI18n
const { leave } = Telegraf.Stage
const detail = new Telegraf.BaseScene('detail')

detail.enter(async (ctx) => {
  logger.debug(ctx, 'Enter detail scene')
  let price, market_cap
  try {
    ;({ price, market_cap } = await coingeckoApiPriceMarketCap(ctx.session.usercoin.coin.cg_id, ctx.session.currency))
  } catch (e) {
    logger.error(ctx, '[coingeckoApiPriceMarketCap]::', e)
  }
  try {
    await ctx.editMessageText(
      ctx.i18n.t('scenes.detail.coin_info', {
        coin: ctx.session.usercoin.coin.name,
        symbol: ctx.session.usercoin.coin.symbol,
        price: price ? price.toLocaleString(ctx.i18n.languageCode, { minimumSignificantDigits: 1 }) : '—',
        market_cap: market_cap ? market_cap.toLocaleString(ctx.i18n.languageCode, { minimumSignificantDigits: 1 }) : '—',
        vs: ctx.session.currency.toUpperCase(),
      }),
      {
        parse_mode: 'HTML',
      }
    )

    const subs = await SubscriptionGet(ctx.session.usercoin.id)

    const subsMessage = subs.length
      ? subs.reduce(
          (s, e) => `${s}\n\t${ctx.session.usercoin.coin.symbol.toUpperCase()}/${e.currency.toUpperCase()}: ${e.limit_value} [${ctx.i18n.t('event.' + e.event.name)}]`,
          ''
        )
      : '—'

    saveMessageForDelete(
      ctx,
      await showDetailMainMenu(
        ctx,
        ctx.i18n.t('scenes.detail.coin_subs', {
          subs: subsMessage,
        })
      )
    )
  } catch (e) {
    logger.error(ctx, 'Coin info getting failed with the error: %O', e)
    await ctx.reply(ctx.i18n.t('shared.something_went_wrong'))
  }
})

detail.command('reset', leave())
detail.hears(match('keyboards.back_keyboard.back'), (ctx) => {
  ctx.scene.enter('coins')
})

detail.action(/actionSelected/, async (ctx) => {
  const data = JSON.parse(ctx.callbackQuery.data)
  if (data.p == 'del') {
    try {
      await UserCoinRemove(ctx.session.usercoin.id)
      logger.debug(ctx, 'Coin %s removed from user list', ctx.session.usercoin.coin.symbol)
      await ctx.reply(ctx.i18n.t('scenes.detail.coin_removed', { coin: ctx.session.usercoin.coin.name }))
    } catch (e) {
      logger.error(ctx, 'Removing coin from user list failed with the error: %O', e)
    }
    ctx.scene.enter('coins')

  } else if (data.p == 'unsub') {
    try {
      await SubscriptionDeactivateUserCoin(ctx.session.usercoin.id)
      logger.debug(ctx, 'Subscription deactivated for coin %s', ctx.session.usercoin.coin.symbol)
      await ctx.reply(ctx.i18n.t('scenes.detail.unsubcribe_success', { coin: ctx.session.usercoin.coin.name }))
    } catch (e) {
      logger.error(ctx, 'Deactivating subscription failed with the error: %O', e)
    }
    ctx.scene.enter('coins')

  } else if (data.p == 'sub') {
    await showSubsMenu(ctx, true)
  }

  await ctx.answerCbQuery()
})

detail.action(/EventSelected/, async (ctx) => {
  const data = JSON.parse(ctx.callbackQuery.data)
  if (data.p) {
    saveToSession(ctx, 'subscibe_to', data.p)
    await ctx.editMessageText(ctx.i18n.t('scenes.detail.pick_limit_value'))
  }
  await ctx.answerCbQuery()
})

detail.hears(/^[0-9]+[\.\,0-9]*$/, async (ctx) => {
  if (ctx.session.subscibe_to) {
    const value = parseFloat(ctx.message.text.replace(/,/, '.'))
    await SubscriptionAdd(ctx.session.usercoin.id, ctx.session.subscibe_to, value, ctx.session.currency)
    await ctx.reply(ctx.i18n.t('scenes.detail.subcribe_success'))
  }
})

detail.hears(/^.+$/, async (ctx) => {
    await ctx.reply(ctx.i18n.t('scenes.detail.incorrect_value'))
})

detail.leave(async (ctx) => {
  logger.debug(ctx, 'Leaves detail scene')
  deleteFromSession(ctx, 'usercoin')
  deleteFromSession(ctx, 'subscibe_to')
  deleteSavedMessage(ctx)
})

export default detail
