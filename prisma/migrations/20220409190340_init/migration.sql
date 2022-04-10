/*
  Warnings:

  - You are about to drop the column `name` on the `Coin` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cg_id" TEXT NOT NULL,
    "username" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "symbol" TEXT
);
INSERT INTO "new_Coin" ("cg_id", "id", "symbol") SELECT "cg_id", "id", "symbol" FROM "Coin";
DROP TABLE "Coin";
ALTER TABLE "new_Coin" RENAME TO "Coin";
CREATE UNIQUE INDEX "Coin_cg_id_key" ON "Coin"("cg_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
