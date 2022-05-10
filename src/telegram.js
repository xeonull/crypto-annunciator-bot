import 'dotenv/config' 
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import Telegraf from 'telegraf'
import TelegrafI18n from 'telegraf-i18n'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const { session, Stage } = Telegraf
export const { match } = TelegrafI18n

export const bot = new Telegraf(process.env.TELEGRAM_API_KEY)

export const i18n = new TelegrafI18n({
  defaultLanguage: 'en',
  directory: path.resolve(__dirname, 'locales'),
  useSession: true,
  allowMissing: false,
  sessionName: 'session',
})
