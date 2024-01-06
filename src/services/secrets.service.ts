import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {PrismaService} from "./prisma.service";


@Injectable()
export class SecretsService{

    constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService,
    ){}

    async runSecretsRotation(){
        // TODO
    }
}
