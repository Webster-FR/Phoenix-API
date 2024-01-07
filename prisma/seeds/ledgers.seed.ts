import {EncryptionService} from "../../src/services/encryption.service";

const encryptionService = new EncryptionService();
const ledgersEncryptionStrength = parseInt(process.env.LEDGERS_ENCRYPTION_STRENGTH);

function makeTransaction(userSecret: string, accountId: number, amount: number){
    if(amount < 0){
        return {
            account_id: accountId,
            credit: null,
            debit: encryptionService.encryptSymmetric(amount.toString(), userSecret, ledgersEncryptionStrength),
            created_at: new Date(),
        };
    }else if(amount > 0){
        return {
            account_id: accountId,
            credit: encryptionService.encryptSymmetric(amount.toString(), userSecret, ledgersEncryptionStrength),
            debit: null,
            created_at: new Date(),
        };
    }
    throw new Error("Amount must be non null");
}

function makeInternalTransaction(userSecret: string, fromAccountId: number, toAccountId: number, amount: number){
    return [
        makeTransaction(userSecret, fromAccountId, -amount),
        makeTransaction(userSecret, toAccountId, amount)
    ];
}

export default (userSecret: string) => [
    // Income transactions
    makeTransaction(userSecret, 1, 37.85), // Income transaction 1
    makeTransaction(userSecret, 1, 811.25), // Income transaction 2
    makeTransaction(userSecret, 1, 23.48), // Income transaction 2 rectification 1
    makeTransaction(userSecret, 1, 456.18), // Income transaction 3
    makeTransaction(userSecret, 1, 13.48), // Income transaction 3 rectification 1
    makeTransaction(userSecret, 1, -48.18), // Income transaction 3 rectification 2

    // Expense transactions
    makeTransaction(userSecret, 1, -18.16), // Expense transaction 1
    makeTransaction(userSecret, 1, -95.48), // Expense transaction 2
    makeTransaction(userSecret, 1, -21.5), // Expense transaction 2 rectification 1
    makeTransaction(userSecret, 1, -78.15), // Expense transaction 3
    makeTransaction(userSecret, 1, 1.28), // Expense transaction 3 rectification 1
    makeTransaction(userSecret, 1, -26.25), // Expense transaction 3 rectification 2

    // Internal transactions
    ...makeInternalTransaction(userSecret, 2, 1, 515.97), // Internal transaction 1
    ...makeInternalTransaction(userSecret, 1, 2, 48.18), // Internal transaction 2
    ...makeInternalTransaction(userSecret, 1, 2, 12.8), // Internal transaction 2 rectification 1
    ...makeInternalTransaction(userSecret, 1, 2, 26.25), // Internal transaction 3
    ...makeInternalTransaction(userSecret, 1, 2, -1.28), // Internal transaction 3 rectification 1
    ...makeInternalTransaction(userSecret, 1, 2, 21.5), // Internal transaction 3 rectification 2
];
