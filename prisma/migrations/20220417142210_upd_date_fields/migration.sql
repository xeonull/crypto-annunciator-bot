-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserCoin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "coin_id" INTEGER NOT NULL,
    "is_removed" BOOLEAN NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserCoin_coin_id_fkey" FOREIGN KEY ("coin_id") REFERENCES "Coin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserCoin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserCoin" ("coin_id", "id", "is_removed", "user_id") SELECT "coin_id", "id", "is_removed", "user_id" FROM "UserCoin";
DROP TABLE "UserCoin";
ALTER TABLE "new_UserCoin" RENAME TO "UserCoin";
CREATE TABLE "new_UserCoinAction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usercoin_id" INTEGER NOT NULL,
    "action_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "limit_value" REAL NOT NULL,
    CONSTRAINT "UserCoinAction_usercoin_id_fkey" FOREIGN KEY ("usercoin_id") REFERENCES "UserCoin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserCoinAction_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "Action" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserCoinAction" ("action_id", "id", "is_active", "limit_value", "usercoin_id") SELECT "action_id", "id", "is_active", "limit_value", "usercoin_id" FROM "UserCoinAction";
DROP TABLE "UserCoinAction";
ALTER TABLE "new_UserCoinAction" RENAME TO "UserCoinAction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
