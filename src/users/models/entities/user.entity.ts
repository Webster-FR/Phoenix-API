import {User} from "@prisma/client";

export class UserEntity implements User{
    id: number;
    username: string;
    email: string;
    password: string;
    secret: string;
    verification_code_id: number;
    created_at: Date;
    updated_at: Date;
}
