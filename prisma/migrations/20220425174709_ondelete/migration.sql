-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountFrom" TEXT NOT NULL,
    "accountTo" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "transactions_accountFrom_fkey" FOREIGN KEY ("accountFrom") REFERENCES "users" ("accountNumber") ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT "transactions_accountTo_fkey" FOREIGN KEY ("accountTo") REFERENCES "users" ("accountNumber") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("accountFrom", "accountTo", "amount", "createdAt", "id", "type", "updatedAt") SELECT "accountFrom", "accountTo", "amount", "createdAt", "id", "type", "updatedAt" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
