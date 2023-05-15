import asyncWrapper from "./utils/error-handlers.js";
import { getMainKeyboard } from "./utils/keyboards.js";
import { getUserInfo } from "./middlewares/user-info.js";
import { isUserExist } from "./middlewares/user-check.js";
import startScene from "./controllers/start/index.js";
import searchScene from "./controllers/search/index.js";
import coinsScene from "./controllers/coins/index.js";
import detailScene from "./controllers/detail/index.js";
import settingsScene from "./controllers/settings/index.js";
import contactScene from "./controllers/contact/index.js";
import { checkActiveSubscriptions } from "./utils/notifier.js";
import { bot, session, Stage, i18n, match } from "./telegram.js";

const stage = new Stage([startScene, searchScene, coinsScene, detailScene, settingsScene, contactScene]);

bot.use(session());
bot.use(i18n.middleware());
bot.use(stage.middleware());
bot.use(getUserInfo);

bot.telegram.setMyCommands([
  {
    command: "start",
    description: "Start",
  },
  {
    command: "reset",
    description: "Reset",
  },
]);

bot.command("reset", async (ctx) => {
  const { mainKeyboard } = getMainKeyboard(ctx);
  await ctx.reply(ctx.i18n.t("shared.what_next"), mainKeyboard);
});

bot.start(asyncWrapper(async (ctx) => ctx.scene.enter("start")));

bot.hears(
  match("keyboards.main_keyboard.search"),
  isUserExist,
  asyncWrapper(async (ctx) => await ctx.scene.enter("search"))
);

bot.hears(
  match("keyboards.main_keyboard.coins"),
  isUserExist,
  asyncWrapper(async (ctx) => await ctx.scene.enter("coins"))
);

bot.hears(
  match("keyboards.main_keyboard.settings"),
  isUserExist,
  asyncWrapper(async (ctx) => await ctx.scene.enter("settings"))
);

bot.hears(
  match("keyboards.main_keyboard.contact"),
  isUserExist,
  asyncWrapper(async (ctx) => await ctx.scene.enter("contact"))
);

bot.hears(
  match("keyboards.back_keyboard.back"),
  asyncWrapper(async (ctx) => {
    // If this method was triggered, it means that bot was updated when user was not in the main menu..
    const { mainKeyboard } = getMainKeyboard(ctx);
    await ctx.reply(ctx.i18n.t("shared.what_next"), mainKeyboard);
  })
);

if (process.env.NODE_ENV == "production") {
  // if production use Webhooks
  bot
    .launch({
      webhook: {
        domain: process.env.DOMAIN,
        port: process.env.PORT || 8000,
      },
    })
    .then(() => {
      console.info(`The ${bot.context.botInfo.first_name} is running on server`);
    });
} else {
  // if local use Long-polling
  bot.launch().then(() => {
    console.info(`The ${bot.context.botInfo.first_name} is running locally`);
  });
}

setInterval(checkActiveSubscriptions, 333 * 1000);
