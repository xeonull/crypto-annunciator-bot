import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import nconf from 'nconf'
import Telegraf from 'telegraf'
import TelegrafI18n from 'telegraf-i18n'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const { session, Stage } = Telegraf
export const { match } = TelegrafI18n

nconf.argv().env().file({ file: 'config.json' })

export const bot = new Telegraf(nconf.get('telegramApiKey'))

export const i18n = new TelegrafI18n({
  defaultLanguage: 'en',
  directory: path.resolve(__dirname, 'locales'),
  useSession: true,
  allowMissing: false,
  sessionName: 'session',
})
