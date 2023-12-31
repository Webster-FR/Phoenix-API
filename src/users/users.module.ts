import {Module} from "@nestjs/common";
import {UsersService} from "./users.service";
import {UsersController} from "./users.controller";
import {PrismaService} from "../services/prisma.service";
import {JwtService} from "../services/jwt.service";

@Module({
    controllers: [UsersController],
    providers: [UsersService, PrismaService, JwtService],
    exports: [UsersService],
})
export class UsersModule{}
