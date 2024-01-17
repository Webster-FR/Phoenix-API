import {Body, Controller, Delete, Get, HttpStatus, Patch, Req, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UserResponse} from "./models/responses/user.response";
import {AtGuard} from "../auth/guards/at.guard";
import {UsersService} from "./users.service";
import {UpdatePasswordDto} from "./models/dto/update-password.dto";
import {UpdateUsernameDto} from "./models/dto/update-username.dto";
import {UserCountResponse} from "../../accounting/accounts/models/responses/user-count.response";

@Controller("users")
@ApiTags("Users")
export class UsersController{

    constructor(
        private readonly usersService: UsersService
    ){}

    @Get("/count")
    @ApiResponse({status: HttpStatus.OK, description: "Returns the number of users", type: UserCountResponse})
    async countUsers(): Promise<UserCountResponse>{
        return await this.usersService.countUsers();
    }

    @Get("/me")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Returns the authenticated user's information", type: UserResponse})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    async getMe(@Req() req: any): Promise<UserResponse>{
        return new UserResponse(req.user);
    }

    @Patch("/me/username")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "User's username updated successfully", type: UserResponse})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    async updateUsername(@Req() req: any, @Body() updateUsernameDto: UpdateUsernameDto): Promise<UserResponse>{
        return new UserResponse(await this.usersService.updateUsername(req.user, updateUsernameDto.username));
    }

    @Patch("/me/password")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "User's password updated successfully", type: UserResponse})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: "Invalid or missing fields"})
    @ApiResponse({status: HttpStatus.FORBIDDEN, description: "Invalid old password"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    async updatePassword(@Req() req: any, @Body() updatePasswordDto: UpdatePasswordDto): Promise<UserResponse>{
        return new UserResponse(await this.usersService.updatePassword(req.user, updatePasswordDto.old_password, updatePasswordDto.password));
    }

    @Delete("/me")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "User deleted successfully"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    async deleteUser(@Req() req: any): Promise<UserResponse>{
        return new UserResponse(await this.usersService.deleteUser(req.user));
    }
}
