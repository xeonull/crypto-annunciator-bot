import logger from "./logger.js";
import { SubscriptionGetAll, SubscriptionDeactivate, UserFindByTelegramID } from "../../prisma/model.js";
import { coingeckoApiPriceData } from "./web.js";
import { PRICE_LIMIT_UP, PRICE_LIMIT_DOWN } from "../../prisma/event.js";
import { bot, i18n } from "../telegram.js";

export async function checkActiveSubscriptions() {
  logger.debug(undefined, "Starting to check active subscriptions");

  const activeSubscriptions = await SubscriptionGetAll();

  if (activeSubscriptions && activeSubscriptions.length) {
    const cryptos = {};
    const currencies = {};
    for (const sub of activeSubscriptions) {
      cryptos[sub.usercoin.coin.cg_id] = true;
      currencies[sub.currency] = true;
    }

    const data = await coingeckoApiPriceData(Object.keys(cryptos).join(","), Object.keys(currencies).join(","));

    for (const sub of activeSubscriptions) {
      switch (sub.event.name) {
        case PRICE_LIMIT_UP:
          if (sub.limit_value <= data[sub.usercoin.coin.cg_id][sub.currency])
            notifyUser(sub.id, sub.usercoin.user.t_id, sub.usercoin.coin.symbol, sub.currency, sub.event.name, sub.limit_value);
          break;
        case PRICE_LIMIT_DOWN:
          if (sub.limit_value >= data[sub.usercoin.coin.cg_id][sub.currency])
            notifyUser(sub.id, sub.usercoin.user.t_id, sub.usercoin.coin.symbol, sub.currency, sub.event.name, sub.limit_value);
          break;
      }
    }
  }

  logger.debug(undefined, "Finish checking active subscriptions");
}

async function notifyUser(subscriptionId, userTelegramId, symbol, currency, event, value) {
  const { language } = await UserFindByTelegramID(userTelegramId);
  await bot.telegram.sendMessage(
    userTelegramId,
    i18n.t(language, `notify.${event}`, { symbol: symbol.toUpperCase(), currency: currency.toUpperCase(), value }),
    {
      parse_mode: "HTML",
    }
  );
  await SubscriptionDeactivate(subscriptionId);
}
