/*
  Warnings:

  - Added the required column `currency` to the `UserCoinAction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserCoinAction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usercoin_id" INTEGER NOT NULL,
    "action_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "limit_value" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    CONSTRAINT "UserCoinAction_usercoin_id_fkey" FOREIGN KEY ("usercoin_id") REFERENCES "UserCoin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserCoinAction_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "Action" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserCoinAction" ("action_id", "id", "is_active", "limit_value", "updated_at", "usercoin_id") SELECT "action_id", "id", "is_active", "limit_value", "updated_at", "usercoin_id" FROM "UserCoinAction";
DROP TABLE "UserCoinAction";
ALTER TABLE "new_UserCoinAction" RENAME TO "UserCoinAction";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "t_id" INTEGER NOT NULL,
    "username" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "language" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'usd'
);
INSERT INTO "new_User" ("created_at", "first_name", "id", "language", "last_name", "t_id", "updated_at", "username") SELECT "created_at", "first_name", "id", "language", "last_name", "t_id", "updated_at", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_t_id_key" ON "User"("t_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
