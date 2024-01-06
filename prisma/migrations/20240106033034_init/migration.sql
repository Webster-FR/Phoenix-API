-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "verification_codes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "iat" DATETIME NOT NULL,
    CONSTRAINT "verification_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "sum" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "is_refresh" BOOLEAN NOT NULL,
    "expires" DATETIME NOT NULL,
    "blacklisted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "todos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "deadline" DATETIME NOT NULL,
    "parent_id" INTEGER,
    "frequency" TEXT,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "todos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "todos_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "todos" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tips" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tips" TEXT NOT NULL,
    "author" TEXT,
    "order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "banks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "user_id" INTEGER,
    CONSTRAINT "banks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "bank_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "accounts_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "banks" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "recurring_transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "wording" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "next_occurrence" DATETIME NOT NULL,
    "frequency" TEXT NOT NULL,
    "category_id" INTEGER,
    "from_account_id" INTEGER,
    "to_account_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "recurring_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recurring_transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "transaction_categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "recurring_transactions_from_account_id_fkey" FOREIGN KEY ("from_account_id") REFERENCES "accounts" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "recurring_transactions_to_account_id_fkey" FOREIGN KEY ("to_account_id") REFERENCES "accounts" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transaction_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    CONSTRAINT "transaction_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "internal_ledger" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "account_id" INTEGER NOT NULL,
    "debit" REAL,
    "credit" REAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "internal_ledger_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transaction_types" (
    "ulid" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "internal_transactions" (
    "ulid" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "wording" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "debit_internal_ledger_id" INTEGER NOT NULL,
    "credit_internal_ledger_id" INTEGER NOT NULL,
    "rectification_ulid" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "internal_transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "transaction_categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "internal_transactions_debit_internal_ledger_id_fkey" FOREIGN KEY ("debit_internal_ledger_id") REFERENCES "internal_ledger" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "internal_transactions_credit_internal_ledger_id_fkey" FOREIGN KEY ("credit_internal_ledger_id") REFERENCES "internal_ledger" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "internal_transactions_rectification_ulid_fkey" FOREIGN KEY ("rectification_ulid") REFERENCES "internal_transactions" ("ulid") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "expense_transactions" (
    "ulid" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "wording" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "internal_ledger_id" INTEGER NOT NULL,
    "rectification_ulid" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "expense_transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "transaction_categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "expense_transactions_internal_ledger_id_fkey" FOREIGN KEY ("internal_ledger_id") REFERENCES "internal_ledger" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "expense_transactions_rectification_ulid_fkey" FOREIGN KEY ("rectification_ulid") REFERENCES "expense_transactions" ("ulid") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "income_transactions" (
    "ulid" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "wording" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "internal_ledger_id" INTEGER NOT NULL,
    "rectification_ulid" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "income_transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "transaction_categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "income_transactions_internal_ledger_id_fkey" FOREIGN KEY ("internal_ledger_id") REFERENCES "internal_ledger" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "income_transactions_rectification_ulid_fkey" FOREIGN KEY ("rectification_ulid") REFERENCES "income_transactions" ("ulid") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verification_codes_user_id_key" ON "verification_codes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_codes_code_key" ON "verification_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_sum_key" ON "tokens"("sum");

-- CreateIndex
CREATE UNIQUE INDEX "tips_tips_key" ON "tips"("tips");

-- CreateIndex
CREATE UNIQUE INDEX "tips_order_key" ON "tips"("order");

-- CreateIndex
CREATE UNIQUE INDEX "banks_name_user_id_key" ON "banks"("name", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_name_user_id_bank_id_key" ON "accounts"("name", "user_id", "bank_id");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_types_type_key" ON "transaction_types"("type");
