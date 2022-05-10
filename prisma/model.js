import pclient from '@prisma/client'
const { PrismaClient } = pclient

const prisma = new PrismaClient()

/* Get all Coins from base */
export async function CoinGetAll() {
  return await prisma.coin.findMany()
}

/* Get User by Telegram ID */
export async function UserFindByTelegramID(telegramID) {
  return await prisma.user.findUnique({
    where: {
      t_id: telegramID,
    },
    select: {
      id: true,
      username: true,
      language: true,
      currency: true,
    },
  })
}

/* Update User language */
export async function UserUpdateLanguage(userID, language) {
  return await prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      language,
      updated_at: new Date(),
    },
  })
}

/* Update User currency */
export async function UserUpdateCurrency(userID, currency) {
  return await prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      currency,
      updated_at: new Date(),
    },
  })
}

/* Add new User to base or update User info */
export async function UserInit(telegramID, userName, firstName, lastName, language) {
  return await prisma.user.upsert({
    create: {
      t_id: telegramID,
      username: userName,
      first_name: firstName,
      last_name: lastName,
      language: language,
    },
    update: {
      username: userName,
      first_name: firstName,
      last_name: lastName,
      language: language,
      updated_at: new Date(),
    },
    where: { t_id: telegramID },
  })
}

/* Add new Coin to base */
export async function CoinAdd(id, name, symbol) {
  return await prisma.coin.upsert({
    create: { cg_id: id, name, symbol },
    update: { name, symbol },
    where: { cg_id: id },
  })
}

/* Add Coin to User list */
export async function UserCoinAdd(userId, coinId) {
  return await prisma.userCoin.create({
    data: { user_id: userId, coin_id: coinId, is_removed: false },
  })
}

/* Get Coin(s) from User list */
export async function UserCoinGet(userId, coinId) {
  if (coinId) {
    return await prisma.userCoin.findFirst({
      where: {
        user_id: userId,
        coin_id: coinId,
      },
      take: 1,
    })
  } else {
    return await prisma.userCoin.findMany({
      where: { is_removed: false, user_id: userId },
      orderBy: { coin: { name: 'asc' } },
      /* Include User and Coin info */
      include: {
        user: { select: { id: true } },
        coin: { select: { id: true, cg_id: true, name: true, symbol: true } },
      },
    })
  }
}

/* Restore Coin in User list */
export async function UserCoinRestore(userCoinId) {
  return await prisma.userCoin.update({
    where: { id: userCoinId },
    data: { is_removed: false, updated_at: new Date() },
  })
}

/* Remove Coin from User list */
export async function UserCoinRemove(userCoinId) {
  return await prisma.userCoin.update({
    where: { id: userCoinId },
    /* Mark usercoin as removed */
    data: {
      is_removed: true,
      updated_at: new Date(),
      /* Deactivate all subscriptions for usercoin */
      subsciptions: {
        updateMany: {
          where: {
            is_active: true,
          },
          data: {
            is_active: false,
            updated_at: new Date(),
          },
        },
      },
    },
  })
}

/* Add new Event */
export async function EventAdd(name) {
  return await prisma.Event.upsert({
    create: { name },
    update: { is_removed: false },
    where: { name },
  })
}

/* Get all Events */
export async function EventGetAll() {
  return await prisma.Event.findMany({
    select: { id: true, name: true, is_removed: false },
    where: { is_removed: false },
  })
}

/* Get Event by name */
export async function EventGet(name) {
  return await prisma.Event.findFirst({
    select: { id: true, name: true, is_removed: false },
    where: { is_removed: false, name },
  })
}

/* Add New Subscriptions */
export async function SubscriptionAdd(userCoinId, EventName, value, currency) {
  const Event = await EventGet(EventName)
  return await prisma.subscription.create({
    data: { usercoin_id: userCoinId, event_id: Event.id, is_active: true, limit_value: value, currency },
  })
}

/* Deactivate subscription */
export async function SubscriptionDeactivate(id) {
  return await prisma.subscription.update({
    where: { id },
    data: { is_active: false, updated_at: new Date() },
  })
}

/* Deactivate subscriptions of UserCoin */
export async function SubscriptionDeactivateUserCoin(userCoinId) {
  return await prisma.subscription.updateMany({
    where: { usercoin_id: userCoinId, is_active: true },
    data: { is_active: false, updated_at: new Date() },
  })
}

/* Get Active Subscriptions for user */
export async function SubscriptionGet(userCoinId) {

  return await prisma.subscription.findMany({
    where: {
      usercoin_id: userCoinId,
      is_active: true,
    },
    /* Include name of Event */
    include: { event: { select: { name: true } } },
  })
}

/* Get All Active Subscriptions */
export async function SubscriptionGetAll() {
  return await prisma.subscription.findMany({
    where: {
      is_active: true,
    },
    /* Include name of Event, User TelegramID and CoinGeckoID */
    include: {
      event: { select: { name: true } },
      usercoin: {
        select: {
          user: { select: { t_id: true } },
          coin: { select: { cg_id: true, symbol: true } },
        },
      },
    },
  })
}
