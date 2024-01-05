import {Controller, Get, HttpStatus, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {TipEntity} from "./models/entities/tip.entity";
import {AtGuard} from "../auth/guards/at.guard";
import {TipsService} from "./tips.service";

@Controller("tips")
@ApiTags("Tips")
export class TipsController{
    constructor(private readonly tipsService: TipsService){}

    @Get("tod")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Returns the tip of the day", type: TipEntity})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "No tip found for today"})
    async getTipOfTheDay(): Promise<TipEntity>{
        return await this.tipsService.getTipOfTheDay();
    }
}
