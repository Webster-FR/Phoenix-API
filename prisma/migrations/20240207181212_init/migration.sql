-- CreateTable
CREATE TABLE "statistics" (
    "id" SERIAL NOT NULL,
    "global_request_count" INTEGER NOT NULL,
    "get_global_request_count" INTEGER NOT NULL,
    "post_global_request_count" INTEGER NOT NULL,
    "put_global_request_count" INTEGER NOT NULL,
    "patch_global_request_count" INTEGER NOT NULL,
    "delete_global_request_count" INTEGER NOT NULL,
    "global_response_time_average" DOUBLE PRECISION NOT NULL,
    "get_global_response_time_average" DOUBLE PRECISION NOT NULL,
    "post_global_response_time_average" DOUBLE PRECISION NOT NULL,
    "put_global_response_time_average" DOUBLE PRECISION NOT NULL,
    "patch_global_response_time_average" DOUBLE PRECISION NOT NULL,
    "delete_global_response_time_average" DOUBLE PRECISION NOT NULL,
    "global_response_time_max" DOUBLE PRECISION NOT NULL,
    "get_global_response_time_max" DOUBLE PRECISION NOT NULL,
    "post_global_response_time_max" DOUBLE PRECISION NOT NULL,
    "put_global_response_time_max" DOUBLE PRECISION NOT NULL,
    "patch_global_response_time_max" DOUBLE PRECISION NOT NULL,
    "delete_global_response_time_max" DOUBLE PRECISION NOT NULL,
    "global_response_time_min" DOUBLE PRECISION NOT NULL,
    "get_global_response_time_min" DOUBLE PRECISION NOT NULL,
    "post_global_response_time_min" DOUBLE PRECISION NOT NULL,
    "put_global_response_time_min" DOUBLE PRECISION NOT NULL,
    "patch_global_response_time_min" DOUBLE PRECISION NOT NULL,
    "delete_global_response_time_min" DOUBLE PRECISION NOT NULL,
    "global_content_length_average" DOUBLE PRECISION NOT NULL,
    "get_global_content_length_average" DOUBLE PRECISION NOT NULL,
    "post_global_content_length_average" DOUBLE PRECISION NOT NULL,
    "put_global_content_length_average" DOUBLE PRECISION NOT NULL,
    "patch_global_content_length_average" DOUBLE PRECISION NOT NULL,
    "delete_global_content_length_average" DOUBLE PRECISION NOT NULL,
    "global_content_length_max" DOUBLE PRECISION NOT NULL,
    "get_global_content_length_max" DOUBLE PRECISION NOT NULL,
    "post_global_content_length_max" DOUBLE PRECISION NOT NULL,
    "put_global_content_length_max" DOUBLE PRECISION NOT NULL,
    "patch_global_content_length_max" DOUBLE PRECISION NOT NULL,
    "delete_global_content_length_max" DOUBLE PRECISION NOT NULL,
    "global_content_length_min" DOUBLE PRECISION NOT NULL,
    "get_global_content_length_min" DOUBLE PRECISION NOT NULL,
    "post_global_content_length_min" DOUBLE PRECISION NOT NULL,
    "put_global_content_length_min" DOUBLE PRECISION NOT NULL,
    "patch_global_content_length_min" DOUBLE PRECISION NOT NULL,
    "delete_global_content_length_min" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_sum" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_codes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "iat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_recovery_codes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "iat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "password_recovery_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "sum" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "refresh_token_id" INTEGER,
    "expires" TIMESTAMP(3) NOT NULL,
    "blacklisted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "sum" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "blacklisted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "todo_lists" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "todo_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "deadline" TIMESTAMP(3),
    "todo_list_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tips" (
    "id" SERIAL NOT NULL,
    "tips" TEXT NOT NULL,
    "author" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "tips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banks" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "bank_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recurring_transactions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "wording" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "next_occurrence" TIMESTAMP(3) NOT NULL,
    "frequency" TEXT NOT NULL,
    "category_id" INTEGER,
    "from_account_id" INTEGER,
    "to_account_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recurring_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_categories" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "transaction_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internal_ledger" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "debit" TEXT,
    "credit" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "internal_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_types" (
    "ulid" TEXT NOT NULL,
    "transaction_type" TEXT NOT NULL,

    CONSTRAINT "transaction_types_pkey" PRIMARY KEY ("ulid")
);

-- CreateTable
CREATE TABLE "future_transactions" (
    "id" SERIAL NOT NULL,
    "amount" TEXT NOT NULL,
    "wording" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "debit_account_id" INTEGER,
    "credit_account_id" INTEGER,
    "transaction_type" TEXT NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "future_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internal_transactions" (
    "ulid" TEXT NOT NULL,
    "wording" TEXT,
    "category_id" INTEGER NOT NULL,
    "debit_internal_ledger_id" INTEGER NOT NULL,
    "credit_internal_ledger_id" INTEGER NOT NULL,
    "rectification_ulid" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "internal_transactions_pkey" PRIMARY KEY ("ulid")
);

-- CreateTable
CREATE TABLE "expense_transactions" (
    "ulid" TEXT NOT NULL,
    "wording" TEXT,
    "category_id" INTEGER NOT NULL,
    "internal_ledger_id" INTEGER NOT NULL,
    "rectification_ulid" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expense_transactions_pkey" PRIMARY KEY ("ulid")
);

-- CreateTable
CREATE TABLE "income_transactions" (
    "ulid" TEXT NOT NULL,
    "wording" TEXT,
    "category_id" INTEGER NOT NULL,
    "internal_ledger_id" INTEGER NOT NULL,
    "rectification_ulid" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "income_transactions_pkey" PRIMARY KEY ("ulid")
);

-- CreateIndex
CREATE UNIQUE INDEX "verification_codes_user_id_key" ON "verification_codes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_codes_code_key" ON "verification_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "password_recovery_codes_user_id_key" ON "password_recovery_codes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "password_recovery_codes_code_key" ON "password_recovery_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "access_tokens_sum_key" ON "access_tokens"("sum");

-- CreateIndex
CREATE UNIQUE INDEX "access_tokens_token_key" ON "access_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "access_tokens_refresh_token_id_key" ON "access_tokens"("refresh_token_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_sum_key" ON "refresh_tokens"("sum");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "todo_lists_user_id_idx" ON "todo_lists"("user_id");

-- CreateIndex
CREATE INDEX "tasks_todo_list_id_idx" ON "tasks"("todo_list_id");

-- CreateIndex
CREATE UNIQUE INDEX "tips_tips_key" ON "tips"("tips");

-- CreateIndex
CREATE UNIQUE INDEX "tips_order_key" ON "tips"("order");

-- CreateIndex
CREATE UNIQUE INDEX "banks_name_user_id_key" ON "banks"("name", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_name_user_id_bank_id_key" ON "accounts"("name", "user_id", "bank_id");

-- CreateIndex
CREATE UNIQUE INDEX "internal_transactions_debit_internal_ledger_id_key" ON "internal_transactions"("debit_internal_ledger_id");

-- CreateIndex
CREATE UNIQUE INDEX "internal_transactions_credit_internal_ledger_id_key" ON "internal_transactions"("credit_internal_ledger_id");

-- CreateIndex
CREATE UNIQUE INDEX "expense_transactions_internal_ledger_id_key" ON "expense_transactions"("internal_ledger_id");

-- CreateIndex
CREATE UNIQUE INDEX "income_transactions_internal_ledger_id_key" ON "income_transactions"("internal_ledger_id");

-- AddForeignKey
ALTER TABLE "verification_codes" ADD CONSTRAINT "verification_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_recovery_codes" ADD CONSTRAINT "password_recovery_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_tokens" ADD CONSTRAINT "access_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_tokens" ADD CONSTRAINT "access_tokens_refresh_token_id_fkey" FOREIGN KEY ("refresh_token_id") REFERENCES "refresh_tokens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todo_lists" ADD CONSTRAINT "todo_lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_todo_list_id_fkey" FOREIGN KEY ("todo_list_id") REFERENCES "todo_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banks" ADD CONSTRAINT "banks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "transaction_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_from_account_id_fkey" FOREIGN KEY ("from_account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_to_account_id_fkey" FOREIGN KEY ("to_account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_categories" ADD CONSTRAINT "transaction_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_ledger" ADD CONSTRAINT "internal_ledger_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_transactions" ADD CONSTRAINT "internal_transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "transaction_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_transactions" ADD CONSTRAINT "internal_transactions_debit_internal_ledger_id_fkey" FOREIGN KEY ("debit_internal_ledger_id") REFERENCES "internal_ledger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_transactions" ADD CONSTRAINT "internal_transactions_credit_internal_ledger_id_fkey" FOREIGN KEY ("credit_internal_ledger_id") REFERENCES "internal_ledger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_transactions" ADD CONSTRAINT "internal_transactions_rectification_ulid_fkey" FOREIGN KEY ("rectification_ulid") REFERENCES "internal_transactions"("ulid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_transactions" ADD CONSTRAINT "expense_transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "transaction_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_transactions" ADD CONSTRAINT "expense_transactions_internal_ledger_id_fkey" FOREIGN KEY ("internal_ledger_id") REFERENCES "internal_ledger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_transactions" ADD CONSTRAINT "expense_transactions_rectification_ulid_fkey" FOREIGN KEY ("rectification_ulid") REFERENCES "expense_transactions"("ulid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "income_transactions" ADD CONSTRAINT "income_transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "transaction_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "income_transactions" ADD CONSTRAINT "income_transactions_internal_ledger_id_fkey" FOREIGN KEY ("internal_ledger_id") REFERENCES "internal_ledger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "income_transactions" ADD CONSTRAINT "income_transactions_rectification_ulid_fkey" FOREIGN KEY ("rectification_ulid") REFERENCES "income_transactions"("ulid") ON DELETE SET NULL ON UPDATE CASCADE;
