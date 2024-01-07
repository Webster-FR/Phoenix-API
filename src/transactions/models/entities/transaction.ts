interface Transaction {
    ulid: string;
    amount: number;
    wording: string;
    category_id: number;
    rectification_ulid: string;
    created_at: Date;
}
