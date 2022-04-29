import logger from "./logger.js";
import { SubscriptionGetAll } from "../../prisma/model.js";
import { coingeckoApiPrice } from "./web.js";

export async function checkActiveSubscriptions() {
  logger.debug(undefined, "Starting to check active subscriptions");

  const activeSubscriptions = await SubscriptionGetAll();

  const cryptos = {};
  const currencies = {};
  for (const sub of activeSubscriptions) {
    cryptos[sub.usercoin.coin.cg_id] = true;
    currencies[sub.currency] = true;
  }

  logger.debug(undefined, "cryptos:: %o", Object.keys(cryptos).join(','),);
  logger.debug(undefined, "currencies:: %o", Object.keys(currencies).join(','));

  const data = await coingeckoApiPrice(Object.keys(cryptos).join(','), Object.keys(currencies).join(','));

  logger.debug(undefined, "data:: %o", data);

  logger.debug(undefined, "Finish checking active subscriptions");
}

async function notifyUsers(coin) {}
