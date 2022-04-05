import { Bot, InlineKeyboard } from 'grammy'
import nconf from 'nconf'

nconf.argv().env().file({ file: 'config.json' })

const bot = new Bot(nconf.get('telegramApiKey'))

bot.command('start', (ctx) =>
  ctx.reply('Welcome to the Crypto Annunciator Bot', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Set ticker',
            callback_data: 'set_ticker',
          },
          {
            text: 'Limit',
            callback_data: 'set_ticker',
          }
        ],
      ],
    },
  })
)

bot.command('ticker')

bot.on('message', (ctx) => ctx.reply('Got another message!'))

bot.start()
