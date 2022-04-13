/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Action" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserCoinAction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usercoin_id" INTEGER NOT NULL,
    "action_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "limit_value" REAL NOT NULL,
    CONSTRAINT "UserCoinAction_usercoin_id_fkey" FOREIGN KEY ("usercoin_id") REFERENCES "UserCoin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserCoinAction_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "Action" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "t_id" INTEGER NOT NULL,
    "username" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("first_name", "id", "last_name", "t_id", "username") SELECT "first_name", "id", "last_name", "t_id", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_t_id_key" ON "User"("t_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Action_name_key" ON "Action"("name");
