import pkg from 'telegraf';

export function getCoinControlMenu(ctx) {
  return Extra.HTML().markup((m) =>
    m.inlineKeyboard(
      [
        m.callbackButton(
          ctx.i18n.t('scenes.coins.back_button'),
          JSON.stringify({ a: 'back', p: undefined }),
          false
        ),
        m.callbackButton(
          ctx.i18n.t('scenes.coins.delete_button'),
          JSON.stringify({ a: 'delete', p: ctx.coin._id }),
          false
        )
      ],
      {}
    )
  );
}
