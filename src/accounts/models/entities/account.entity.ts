import {Accounts} from "@prisma/client";

export class AccountEntity implements Accounts{
    name: string;
    amount: number;
    bank_id: number;
    user_id: number;
    id: number;
    created_at: Date;
    updated_at: Date;
}
