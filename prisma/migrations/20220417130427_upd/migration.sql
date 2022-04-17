/*
  Warnings:

  - Added the required column `is_removed` to the `UserCoin` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserCoin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "coin_id" INTEGER NOT NULL,
    "is_removed" BOOLEAN NOT NULL,
    CONSTRAINT "UserCoin_coin_id_fkey" FOREIGN KEY ("coin_id") REFERENCES "Coin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserCoin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserCoin" ("coin_id", "id", "user_id") SELECT "coin_id", "id", "user_id" FROM "UserCoin";
DROP TABLE "UserCoin";
ALTER TABLE "new_UserCoin" RENAME TO "UserCoin";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
