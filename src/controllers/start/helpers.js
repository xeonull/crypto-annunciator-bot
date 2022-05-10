import tgf from 'telegraf'
const { Extra } = tgf

// Returns language keyboard
export function getLanguageKeyboard() {
  return Extra.HTML().markup((markup) =>
    markup.inlineKeyboard(
      [
        markup.callbackButton(`English`, JSON.stringify({ a: 'languageChange', p: 'en' }), false),
        markup.callbackButton(`Русский`, JSON.stringify({ a: 'languageChange', p: 'ru' }), false),
      ],
      {}
    )
  )
}
