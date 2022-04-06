import { Bot } from "grammy";
import nconf from "nconf";
import { userAction } from "./web.js";
//import fetch from 'node-fetch';

nconf.argv().env().file({ file: "config.json" });

const bot = new Bot(nconf.get("telegramApiKey"));

bot.api.setMyCommands([
  {
    command: "start",
    description: "Start",
  },
  {
    command: "ticker",
    description: "set ticker",
  },
]);

bot.command("start", (ctx) => {
  ctx.reply("Welcome to the Crypto Annunciator Bot", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Set ticker",
            callback_data: "set_ticker",
          },
          {
            text: "Limit",
            callback_data: "set_ticker",
          },
        ],
      ],
    },
  });
});

bot.callbackQuery("set_ticker", async (ctx) => {
  const res = await userAction();
  console.log(`Response: ${JSON.stringify(res)}`)
  ctx.reply(`Response: ${res.title}`);
});

bot.command("ticker", (ctx) =>
  ctx.reply("---", {
    text: "Please give us your phone number",
    reply_markup: JSON.stringify({
      keyboard: [
        [
          {
            text: "Share my phone number",
            request_contact: true,
          },
        ],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    }),
  })
);

bot.on("message", (ctx) =>
  ctx.api.sendMessage(ctx.message.chat.id, "Some text...", {
    reply_markup: JSON.stringify({
      hide_keyboard: true,
    }),
  })
);

bot.start();
