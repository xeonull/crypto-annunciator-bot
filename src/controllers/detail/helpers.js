import pkg from 'telegraf'
const { Markup } = pkg
import { getObjectMenu, getObjectMenuComplex } from '../../utils/menus.js'
import { EventGetAll } from '../../../prisma/model.js'

export const showDetailMainMenu = async (ctx, text) => {
  const extra = getObjectMenu(
    [
      { id: 'sub', name: ctx.i18n.t('scenes.detail.buttons.subscribe') },
      { id: 'del', name: ctx.i18n.t('scenes.detail.buttons.delete') },
    ],
    'actionSelected'
  )
  return await ctx.reply(text, extra)
}

export const showSubsMenu = async (ctx, is_edit = false) => {
  const cells = []

  const n_types = await EventGetAll()

  n_types.forEach((e) => {
    cells.push({ id: e.name, name: ctx.i18n.t(`event.${e.name}`) })
  })

  const extra = getObjectMenu(cells, 'EventSelected')
  const text = n_types.length ? ctx.i18n.t('scenes.detail.pick_event') : ctx.i18n.t('shared.not_available')
  is_edit ? ctx.editMessageText(text, extra) : ctx.reply(text, extra)
}

/* Returns back keyboard and its buttons according to the language */
export const getCoinControlKeyboard = (ctx) => {
  const coinKeyboardSubscribe = ctx.i18n.t('keyboards.coin_detail_keyboard.subscribe')
  const coinKeyboardDelete = ctx.i18n.t('keyboards.coin_detail_keyboard.delete')
  const coinKeyboardBack = ctx.i18n.t('keyboards.back_keyboard.back')
  let coinKeyboard = Markup.keyboard([[coinKeyboardSubscribe, coinKeyboardDelete], [coinKeyboardBack]])

  coinKeyboard = coinKeyboard.resize().extra()

  return {
    coinKeyboard,
    coinKeyboardSubscribe,
    coinKeyboardDelete,
    coinKeyboardBack,
  }
}
