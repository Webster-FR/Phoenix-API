import {PrismaService} from "../services/prisma.service";
import {Injectable} from "@nestjs/common";

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
