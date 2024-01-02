import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../services/prisma.service";
import {UserEntity} from "./models/entities/user.entity";

@Injectable()
export class UsersService{
    constructor(
        private readonly prismaService: PrismaService
    ){}

    async findById(id: number, exception: boolean = true): Promise<UserEntity>{
        const user = await this.prismaService.user.findUnique({where: {id: id}});
        if(!user && exception)
            throw new NotFoundException("User not found");
        return user;
    }

    async findByEmail(email: string, exception: boolean = true): Promise<UserEntity>{
        const user = await this.prismaService.user.findUnique({where: {email: email}});
        if(!user && exception)
            throw new NotFoundException("User not found");
        return user;
    }
}
