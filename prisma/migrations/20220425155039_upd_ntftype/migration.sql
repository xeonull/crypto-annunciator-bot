-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NotificationType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "is_removed" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_NotificationType" ("id", "name") SELECT "id", "name" FROM "NotificationType";
DROP TABLE "NotificationType";
ALTER TABLE "new_NotificationType" RENAME TO "NotificationType";
CREATE UNIQUE INDEX "NotificationType_name_key" ON "NotificationType"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
