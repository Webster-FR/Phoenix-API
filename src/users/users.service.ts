import {Injectable} from "@nestjs/common";
import {PrismaService} from "../services/prisma.service";
import {UserEntity} from "./entities/user.entity";

@Injectable()
export class UsersService{

    constructor(private prismaService: PrismaService){}

    findOne(id: number): Promise<UserEntity>{
        return this.prismaService.user.findUnique({where: {id: id}});
    }

    getUserByUsername(username: string): Promise<UserEntity>{
        return this.prismaService.user.findUnique({where: {username: username}});
    }
}
