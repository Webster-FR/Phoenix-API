import {Injectable} from "@nestjs/common";
import {PrismaService} from "../services/prisma.service";

@Injectable()
export class TipsService{

    constructor(
        private readonly prismaService: PrismaService
    ){}

    async getTipOfTheDay(){
        const day = new Date().getDay();
        return this.prismaService.tips.findFirst({
            where: {
                order: day
            }
        });
    }
}
