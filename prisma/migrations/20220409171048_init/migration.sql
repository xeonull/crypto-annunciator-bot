-- CreateTable
CREATE TABLE "Coin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cg_id" TEXT NOT NULL,
    "name" TEXT,
    "symbol" TEXT
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "t_id" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Coin_cg_id_key" ON "Coin"("cg_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_t_id_key" ON "User"("t_id");
