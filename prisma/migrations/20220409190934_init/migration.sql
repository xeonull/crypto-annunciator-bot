/*
  Warnings:

  - Made the column `name` on table `Coin` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cg_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT
);
INSERT INTO "new_Coin" ("cg_id", "id", "name", "symbol") SELECT "cg_id", "id", "name", "symbol" FROM "Coin";
DROP TABLE "Coin";
ALTER TABLE "new_Coin" RENAME TO "Coin";
CREATE UNIQUE INDEX "Coin_cg_id_key" ON "Coin"("cg_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
