-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "blacklisted" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("accountNumber", "balance", "blacklisted", "createdAt", "email", "id", "name", "updatedAt") SELECT "accountNumber", "balance", "blacklisted", "createdAt", "email", "id", "name", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_accountNumber_key" ON "users"("accountNumber");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE TABLE "new_transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountFrom" TEXT NOT NULL,
    "accountTo" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "transactions_accountFrom_fkey" FOREIGN KEY ("accountFrom") REFERENCES "users" ("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transactions_accountTo_fkey" FOREIGN KEY ("accountTo") REFERENCES "users" ("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("accountFrom", "accountTo", "amount", "createdAt", "id", "type", "updatedAt") SELECT "accountFrom", "accountTo", "amount", "createdAt", "id", "type", "updatedAt" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
