import { Bot, session } from "grammy";
import nconf from "nconf";
import { coingeckoApiPrice, coingeckoApiSearch } from "./web.js";
import { GetAllCoins, AddUser, AddCoin } from "../prisma/model.js";

nconf.argv().env().file({ file: "config.json" });

const bot = new Bot(nconf.get("telegramApiKey"));

bot.use(
  session({
    initial() {
      return { isSearch: false, searchResults: null, dbUser: null };
    },
  })
);

bot.api.setMyCommands([
  {
    command: "start",
    description: "Start",
  },
]);

bot.command("start", async (ctx) => {
  ctx.session.user = await AddUser(
    ctx.chat.id,
    ctx.chat.username,
    ctx.chat.first_name,
    ctx.chat.last_name
  );
  ctx.session.isSearch = false;
  const hello_text = ctx.chat.username ? `Hi, ${ctx.chat.username}. ` : ``;
  ctx.reply(`${hello_text}Welcome to the Crypto Annunciator Bot`, {
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

bot.callbackQuery("callback_tickers", async (ctx) => {  
  ctx.editMessageReplyMarkup(
    {
      reply_markup: {
        inline_keyboard: [
          [
          ],
        ],
      },
    }
  );

  const coins = await GetAllCoins();

  const buttons = coins.map((c) => {
    const b = {};
    b.text = c.name;
    b.callback_data = `cg_id_${c.cg_id}`;
    return b;
  });
  const coinKeyboard = [buttons];
  ctx.reply("Tickers:", {
    reply_markup: {
      inline_keyboard: coinKeyboard,
    },
  });
});

bot.callbackQuery("callback_search", (ctx) => {
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

bot.start();
