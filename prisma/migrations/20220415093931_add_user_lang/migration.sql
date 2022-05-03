-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "t_id" INTEGER NOT NULL,
    "username" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "language" TEXT
);
INSERT INTO "new_User" ("created_at", "first_name", "id", "last_name", "t_id", "username") SELECT "created_at", "first_name", "id", "last_name", "t_id", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_t_id_key" ON "User"("t_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
