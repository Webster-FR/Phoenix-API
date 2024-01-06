import {Controller, UseGuards} from "@nestjs/common";
import {TransactionsService} from "./transactions.service";
import {MaintenanceGuard} from "../maintenance/guards/maintenance.guard";
import {ApiTags} from "@nestjs/swagger";

@Controller("transactions")
@UseGuards(MaintenanceGuard)
@ApiTags("Transactions")
export class TransactionsController{
    constructor(private readonly transactionsService: TransactionsService){}
}
