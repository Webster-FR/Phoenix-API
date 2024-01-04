import {Controller, Get, HttpStatus, Req, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UserResponse} from "./models/responses/user.response";
import {AtGuard} from "../auth/guards/at.guard";
import {UsersService} from "./users.service";

@Controller("users")
@ApiTags("Users")
export class UsersController{
    constructor(private readonly usersService: UsersService){}

    @Get("/me")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Returns the authenticated user's information", type: UserResponse})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    async getMe(@Req() req: any): Promise<UserResponse>{
        const user = await this.usersService.findById(req.user.id);
        return new UserResponse(user);
    }
}
