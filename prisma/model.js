import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export async function GetAllCoins() {
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
    },
  });
}

export async function UserUpdateLanguage(userID, language) {
  return await prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      language: language,
    },
  })
}

export async function UserInit(
  telegramID,
  userName,
  firstName,
  lastName,
  language
) {
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

export async function AddCoin(id, name, symbol) {
  return await prisma.coin.upsert({
    create: { cg_id: id, name, symbol },
    update: { name, symbol },
    where: { cg_id: id },
  });
}

export async function AddUserCoin(userId, coinId) {
  return await prisma.userCoin.upsert({
    create: { user_id: userId, coin_id: coinId },
  });
}
