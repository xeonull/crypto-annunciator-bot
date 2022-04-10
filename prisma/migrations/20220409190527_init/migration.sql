/*
  Warnings:

  - You are about to drop the column `t_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `Coin` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `Coin` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Coin` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "t_id" INTEGER NOT NULL,
    "username" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "id", "t_id") SELECT "createdAt", "id", "t_id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_t_id_key" ON "User"("t_id");
CREATE TABLE "new_Coin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cg_id" TEXT NOT NULL,
    "name" TEXT,
    "symbol" TEXT
);
INSERT INTO "new_Coin" ("cg_id", "id", "symbol") SELECT "cg_id", "id", "symbol" FROM "Coin";
DROP TABLE "Coin";
ALTER TABLE "new_Coin" RENAME TO "Coin";
CREATE UNIQUE INDEX "Coin_cg_id_key" ON "Coin"("cg_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
