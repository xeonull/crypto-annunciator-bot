import { Bot } from "grammy";
import nconf from "nconf";
import { coingeckoApiPrice, coingeckoApiSearch } from "./web.js";
import { get_coins, init_coins } from "./json.js";

nconf.argv().env().file({ file: "config.json" });

let coins = [];

const bot = new Bot(nconf.get("telegramApiKey"));

bot.api.setMyCommands([
  {
    command: "start",
    description: "Start",
  },
  // {
  //   command: "ticker",
  //   description: "set ticker",
  // },
]);

bot.command("start", (ctx) => {
  ctx.reply("Welcome to the Crypto Annunciator Bot", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "My tickers",
            callback_data: "callback_tickers",
          },
          {
            text: "Input",
            callback_data: "callback_search",
          },
        ],
      ],
    },
  });
});

let coinKeyboard = [];

bot.callbackQuery("callback_tickers", (ctx) => {
  coins = get_coins();
  const buttons = coins.map((c) => {
    const b = {};
    b.text = c.name;
    b.callback_data = `cg_id_${c.cg_id}`;
    return b;
  });
  coinKeyboard = [buttons]
  ctx.reply("Tickers:", {
    reply_markup: {
      inline_keyboard: coinKeyboard,      
    },
  });
});

bot.callbackQuery("callback_search", (ctx) => {
  const res_coins = await coingeckoApiSearch("polkadot");
  console.log("res_coins:", res_coins);
});

bot.on("callback_query:data", async (ctx) => {
  if (ctx.update.callback_query.data.substring(0, 6) == 'cg_id_')
  {
    const price = await coingeckoApiPrice(ctx.update.callback_query.data.substring(6));
    ctx.reply(`Price: ${price}`);
  }
});

bot.start();
