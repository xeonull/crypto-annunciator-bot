import nconf from "nconf";
//import fs from 'fs';
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { coingeckoApiPrice, coingeckoApiSearch } from "./utils/web.js";
import { GetAllCoins, AddCoin } from "../prisma/model.js";
import asyncWrapper from "./utils/error-handlers.js";
import { getUserInfo } from "./middlewares/user-info.js";
import Telegraf from "telegraf";
import TelegrafI18n from "telegraf-i18n";
import startScene from "./controllers/start/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { session, Stage } = Telegraf;
const { match } = TelegrafI18n;

nconf.argv().env().file({ file: "config.json" });

const bot = new Telegraf(nconf.get("telegramApiKey"));

const stage = new Stage([startScene]);

const i18n = new TelegrafI18n({
  defaultLanguage: "en",
  directory: path.resolve(__dirname, "locales"),
  useSession: true,
  allowMissing: false,
  sessionName: "session",
});

bot.use(session());
bot.use(i18n.middleware());
bot.use(stage.middleware());
bot.use(getUserInfo);

bot.telegram.setMyCommands([
  {
    command: "start",
    description: "Start",
  },
]);

bot.start(asyncWrapper(async (ctx) => ctx.scene.enter("start")));

bot.hears(
  match("keyboards.main_keyboard.coins"),
  //updateUserTimestamp,
  asyncWrapper(async (ctx) => await ctx.scene.enter("coins"))
);

bot.action("callback_tickers", async (ctx) => {
  // ctx.editMessageReplyMarkup({
  //   reply_markup: {
  //     inline_keyboard: [[]],
  //   },
  // });

  const coins = await GetAllCoins();

  const buttons = coins.map((c) => {
    const b = {};
    b.text = c.name;
    b.callback_data = `cg_id_${c.cg_id}`;
    return b;
  });
  const coinKeyboard = [buttons];
  ctx.reply("Your coins:", {
    reply_markup: {
      inline_keyboard: coinKeyboard,
    },
  });
});

bot.action("callback_search", (ctx) => {
  ctx.session.isSearch = true;
  ctx.reply(`Enter the name of the crypto asset to search:`);
});

bot.on("message", async (ctx) => {
  //console.log("ctx", ctx);
  if (ctx.session.isSearch && ctx.message.text) {
    //console.log("ctx.message:", ctx.message);
    ctx.session.searchResults = await coingeckoApiSearch(ctx.message.text);
    //console.log("res_coins:", res_coins);
    const buttons = ctx.session.searchResults.map((c) => {
      const b = {};
      b.text = `${c.name} (${c.symbol})`;
      b.callback_data = `cg_id_${c.id}`;
      return b;
    });
    //console.log("buttons:", buttons);
    const findKeyboard = [buttons.slice(0, 3)];
    ctx.reply("Results:", {
      reply_markup: {
        inline_keyboard: findKeyboard,
        hide_keyboard: true,
      },
    });
  }
});

bot.on("callback_query:data", async (ctx) => {
  const prefix = ctx.update.callback_query.data.substring(0, 6);
  const coin_id = ctx.update.callback_query.data.substring(6);
  if (prefix == "cg_id_") {
    if (ctx.session.isSearch) {
      const coin = ctx.session.searchResults.find((item) => item.id == coin_id);
      console.log("coin:", coin);
      const my_coin = await AddCoin(coin.id, coin.name, coin.symbol);
      //AddUserCoin();
      ctx.session.isSearch = false;
    } else {
      const price = await coingeckoApiPrice(coin_id);
      ctx.reply(`Price: ${price}`);
    }
  }
});

bot.startPolling();
