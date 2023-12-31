import {Controller, Get, HttpStatus, NotFoundException, Req, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../auth/guards/auth.guard";
import {UsersService} from "./users.service";
import {UserEntity} from "./entities/user.entity";

@Controller("users")
@ApiTags("Users")
export class UsersController{
    constructor(private readonly usersService: UsersService){}

    @Get("self")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Get self", type: UserEntity})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Missing bearer token"})
    async findSelf(@Req() req: any): Promise<UserEntity>{
        const user = await this.usersService.findOne(req.user.id);
        if(!user)
            throw new NotFoundException("User not found");
        delete user.password;
        return user;
    }
}
