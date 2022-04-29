import nconf from 'nconf'
//import fs from 'fs';
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import asyncWrapper from './utils/error-handlers.js'
import { getMainKeyboard } from './utils/keyboards.js'
import { getUserInfo } from './middlewares/user-info.js'
import { isUserExist } from './middlewares/user-check.js'
import Telegraf from 'telegraf'
import TelegrafI18n from 'telegraf-i18n'
import startScene from './controllers/start/index.js'
import searchScene from './controllers/search/index.js'
import coinsScene from './controllers/coins/index.js'
import detailScene from './controllers/detail/index.js'
import settingsScene from './controllers/settings/index.js'
import { checkActiveSubscriptions } from './utils/notifier.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { session, Stage } = Telegraf
const { match } = TelegrafI18n

nconf.argv().env().file({ file: 'config.json' })

const bot = new Telegraf(nconf.get('telegramApiKey'))

const stage = new Stage([startScene, searchScene, coinsScene, detailScene, settingsScene])

const i18n = new TelegrafI18n({
  defaultLanguage: 'en',
  directory: path.resolve(__dirname, 'locales'),
  useSession: true,
  allowMissing: false,
  sessionName: 'session',
})

bot.use(session())
bot.use(i18n.middleware())
bot.use(stage.middleware())
bot.use(getUserInfo)

bot.telegram.setMyCommands([
  {
    command: 'start',
    description: 'Start',
  },
])

bot.start(asyncWrapper(async (ctx) => ctx.scene.enter('start')))

bot.hears(
  match('keyboards.main_keyboard.search'),
  isUserExist,
  asyncWrapper(async (ctx) => await ctx.scene.enter('search'))
)

bot.hears(
  match('keyboards.main_keyboard.coins'),
  isUserExist,
  asyncWrapper(async (ctx) => await ctx.scene.enter('coins'))
)

bot.hears(
  match('keyboards.main_keyboard.settings'),
  isUserExist,
  asyncWrapper(async (ctx) => await ctx.scene.enter('settings'))
)

bot.hears(
  ///< (.+)/i,
  match('keyboards.back_keyboard.back'),
  asyncWrapper(async (ctx) => {
    // If this method was triggered, it means that bot was updated when user was not in the main menu..
    const { mainKeyboard } = getMainKeyboard(ctx);
    const xx = await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
  })
);

bot.launch()

checkActiveSubscriptions()
//setInterval(checkActiveSubscriptions, 10*1000);
