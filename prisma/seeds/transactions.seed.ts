import {EncryptionService} from "../../src/common/services/encryption.service";
import {ulid} from "ulid";
import * as dotenv from "dotenv";

dotenv.config();

const encryptionService = new EncryptionService();
const transactionsEncryptionStrength = parseInt(process.env.TRANSACTIONS_ENCRYPTION_STRENGTH);

const ulids = [
    ulid(),
    ulid(),
    ulid(),
    ulid(),
    ulid(),
    ulid(),
    ulid(),
    ulid(),
    ulid(),
];

export function incomeTransactionsFunction(userSecret: string){
    return [
        {
            ulid: ulids[0],
            wording: encryptionService.encryptSymmetric("Income 1", userSecret, transactionsEncryptionStrength),
            category_id: 1,
            internal_ledger_id: 1,
            rectification_ulid: null,
            created_at: new Date(),
        },
        {
            ulid: ulids[1],
            wording: encryptionService.encryptSymmetric("Income 2", userSecret, transactionsEncryptionStrength),
            category_id: 1,
            internal_ledger_id: 2,
            rectification_ulid: null,
            created_at: new Date(),
        },
        {
            ulid: ulid(),
            wording: null,
            category_id: 1,
            internal_ledger_id: 3,
            rectification_ulid: ulids[1],
            created_at: new Date(),
        },
        {
            ulid: ulids[2],
            wording: encryptionService.encryptSymmetric("Income 3", userSecret, transactionsEncryptionStrength),
            category_id: 1,
            internal_ledger_id: 4,
            rectification_ulid: null,
            created_at: new Date(),
        },
        {
            ulid: ulid(),
            wording: null,
            category_id: 1,
            internal_ledger_id: 5,
            rectification_ulid: ulids[2],
            created_at: new Date(),
        },
        {
            ulid: ulid(),
            wording: null,
            category_id: 1,
            internal_ledger_id: 6,
            rectification_ulid: ulids[2],
            created_at: new Date(),
        },
    ];
}

export function expenseTransactionsFunction(userSecret: string){
    return [
        {
            ulid: ulids[3],
            wording: encryptionService.encryptSymmetric("Expense 1", userSecret, transactionsEncryptionStrength),
            category_id: 1,
            internal_ledger_id: 7,
            rectification_ulid: null,
            created_at: new Date(),
        },
        {
            ulid: ulids[4],
            wording: encryptionService.encryptSymmetric("Expense 2", userSecret, transactionsEncryptionStrength),
            category_id: 1,
            internal_ledger_id: 8,
            rectification_ulid: null,
            created_at: new Date(),
        },
        {
            ulid: ulid(),
            wording: null,
            category_id: 1,
            internal_ledger_id: 9,
            rectification_ulid: ulids[4],
            created_at: new Date(),
        },
        {
            ulid: ulids[5],
            wording: encryptionService.encryptSymmetric("Expense 3", userSecret, transactionsEncryptionStrength),
            category_id: 1,
            internal_ledger_id: 10,
            rectification_ulid: null,
            created_at: new Date(),
        },
        {
            ulid: ulid(),
            wording: null,
            category_id: 1,
            internal_ledger_id: 11,
            rectification_ulid: ulids[5],
            created_at: new Date(),
        },
        {
            ulid: ulid(),
            wording: null,
            category_id: 1,
            internal_ledger_id: 12,
            rectification_ulid: ulids[5],
            created_at: new Date(),
        },
    ];
}

export function internalTransactionsFunction(userSecret: string){
    return [
        {
            ulid: ulids[6],
            wording: encryptionService.encryptSymmetric("Internal 1", userSecret, transactionsEncryptionStrength),
            category_id: 1,
            debit_internal_ledger_id: 13,
            credit_internal_ledger_id: 14,
            rectification_ulid: null,
            created_at: new Date(),
        },
        {
            ulid: ulids[7],
            wording: encryptionService.encryptSymmetric("Internal 2", userSecret, transactionsEncryptionStrength),
            category_id: 1,
            debit_internal_ledger_id: 15,
            credit_internal_ledger_id: 16,
            rectification_ulid: null,
            created_at: new Date(),
        },
        {
            ulid: ulid(),
            wording: null,
            category_id: 1,
            debit_internal_ledger_id: 17,
            credit_internal_ledger_id: 18,
            rectification_ulid: ulids[7],
            created_at: new Date(),
        },
        {
            ulid: ulids[8],
            wording: encryptionService.encryptSymmetric("Internal 3", userSecret, transactionsEncryptionStrength),
            category_id: 1,
            debit_internal_ledger_id: 19,
            credit_internal_ledger_id: 20,
            rectification_ulid: null,
            created_at: new Date(),
        },
        {
            ulid: ulid(),
            wording: null,
            category_id: 1,
            debit_internal_ledger_id: 22,
            credit_internal_ledger_id: 21,
            rectification_ulid: ulids[8],
            created_at: new Date(),
        },
        {
            ulid: ulid(),
            wording: null,
            category_id: 1,
            debit_internal_ledger_id: 23,
            credit_internal_ledger_id: 24,
            rectification_ulid: ulids[8],
            created_at: new Date(),
        }
    ];
}
