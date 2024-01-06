import {TransactionCategories} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class TransactionCategoryEntity implements TransactionCategories{
    @ApiProperty()
        id: number;
    @ApiProperty()
        user_id: number;
    @ApiProperty()
        name: string;
    @ApiProperty()
        icon: string;
    @ApiProperty()
        color: string;
}
