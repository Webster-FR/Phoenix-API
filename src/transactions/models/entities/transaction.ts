interface Transaction {
    ulid: string;
    wording: string;
    category_id: number;
    rectification_ulid: string;
    created_at: Date;
}
