import { getObjectMenu, getObjectMenuComplex } from '../../utils/menus.js'
import { EventGetAll } from '../../../prisma/model.js'

export const showDetailMainMenu = async (ctx, text) => {
  const extra = getObjectMenuComplex(
    [
      { id: 'sub', name: ctx.i18n.t('scenes.detail.buttons.subscribe') },
      { id: 'unsub', name: ctx.i18n.t('scenes.detail.buttons.unsubscribe') },
      { id: 'del', name: ctx.i18n.t('scenes.detail.buttons.delete') },
    ],
    'actionSelected',
    2
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

