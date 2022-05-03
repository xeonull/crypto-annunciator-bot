/*
  Warnings:

  - You are about to drop the `NotificationType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `notification_type_id` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `event_id` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "NotificationType_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NotificationType";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "is_removed" BOOLEAN NOT NULL DEFAULT false
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usercoin_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "limit_value" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    CONSTRAINT "Subscription_usercoin_id_fkey" FOREIGN KEY ("usercoin_id") REFERENCES "UserCoin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Subscription_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Subscription" ("currency", "id", "is_active", "limit_value", "updated_at", "usercoin_id") SELECT "currency", "id", "is_active", "limit_value", "updated_at", "usercoin_id" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Event_name_key" ON "Event"("name");
