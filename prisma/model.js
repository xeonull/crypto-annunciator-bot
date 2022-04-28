import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export async function CoinGetAll() {
  return await prisma.coin.findMany();
}

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
  });
}

export async function UserUpdateLanguage(userID, language) {
  return await prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      language,
      updated_at: new Date(),
    },
  });
}

export async function UserUpdateCurrency(userID, currency) {
  return await prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      currency,
      updated_at: new Date(),
    },
  });
}

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
  });
}

export async function CoinAdd(id, name, symbol) {
  return await prisma.coin.upsert({
    create: { cg_id: id, name, symbol },
    update: { name, symbol },
    where: { cg_id: id },
  });
}

export async function UserCoinAdd(userId, coinId) {
  return await prisma.userCoin.create({
    data: { user_id: userId, coin_id: coinId, is_removed: false },
  });
}

export async function UserCoinGet(userId, coinId) {
  if (coinId) {
    return await prisma.userCoin.findFirst({
      where: {
        user_id: userId,
        coin_id: coinId,
      },
      take: 1,
    });
  } else {
    return await prisma.coin.findMany({
      where: { users: { some: { user_id: userId, is_removed: false } } },
      orderBy: { name: "asc" },
      include: { users: { select: { id: true } } },
    });
  }
}

export async function UserCoinRestore(userCoinId) {
  return await prisma.userCoin.update({
    where: { id: userCoinId },
    data: { is_removed: false, updated_at: new Date() },
  });
}

export async function UserCoinRemove(userCoinId) {
  return await prisma.userCoin.update({
    where: { id: userCoinId },
    data: { is_removed: true, updated_at: new Date() },
  });
}

export async function NotificationTypeAdd(name) {
  return await prisma.notificationType.create({
    data: { name },
  });
}

export async function NotificationTypeGetAll() {
  return await prisma.notificationType.findMany({
    select: { id: true, name: true, is_removed: false },
    where: { is_removed: false },
  });
}

export async function NotificationTypeGet(name) {
  return await prisma.notificationType.findFirst({
    select: { id: true, name: true, is_removed: false },
    where: { is_removed: false, name },
  });
}

export async function SubscriptionAdd(userCoinId, notificationTypeName, value, currency) {
  const notificationType = await NotificationTypeGet(notificationTypeName);
  return await prisma.subscription.create({
    data: { usercoin_id: userCoinId, notification_type_id: notificationType.id, is_active: true, limit_value: value, currency },
  });
}
