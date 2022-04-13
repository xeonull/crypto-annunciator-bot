import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export async function GetAllCoins() {
  return await prisma.coin.findMany();
}

export async function AddUser(telegramID, userName, firstName, lastName) {
  return await prisma.user.upsert({
    create: {
      t_id: telegramID,
      username: userName,
      first_name: firstName,
      last_name: lastName,
    },
    update: { username: userName, first_name: firstName, last_name: lastName },
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
    create: { user_id: userId, coin_id: coinId }
  });
}
