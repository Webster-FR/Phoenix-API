import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../services/prisma.service";
import {TipEntity} from "./models/entities/tip.entity";

// noinspection TypeScriptValidateJSTypes
@Injectable()
export class TipsService{

    constructor(
        private readonly prismaService: PrismaService
    ){}

    async getTipOfTheDay(){
        const day = new Date().getDate();
        const tod = await this.prismaService.tips.findUnique({
            where: {
                order: day
            }
        });
        if(!tod)
            throw new NotFoundException("Tip of the day not found");
        return tod;
    }

    async randomizeTipsOrder(){
        const tips: TipEntity[] = await this.prismaService.tips.findMany();
        const tipsIds: number[] = tips.map(tip => tip.id);
        const randomizedTipsIds: number[] = this.randomizeArray(tipsIds);
        const maxId: number = Math.max(...tipsIds);
        await this.prismaService.$transaction(async(tx) => {
            for(const tip of tips){
                await tx.tips.update({
                    where: {
                        id: tip.id
                    },
                    data: {
                        order: maxId + tip.id + 10
                    }
                });
            }
            for(const tip of tips){
                await tx.tips.update({
                    where: {
                        id: tip.id
                    },
                    data: {
                        order: randomizedTipsIds.shift()
                    }
                });
            }
        });
    }

    private randomizeArray(array: any[]){
        let currentIndex = array.length, temporaryValue: any, randomIndex: any;
        while(0 !== currentIndex){
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return [...array];
    }
}
