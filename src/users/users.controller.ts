import {Body, Controller, Delete, Get, HttpStatus, Patch, Req, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UpdatePasswordDto} from "./models/dto/update-password.dto";
import {UpdateUsernameDto} from "./models/dto/update-username.dto";
import {UserResponse} from "./models/responses/user.response";
import {AtGuard} from "../auth/guards/at.guard";
import {UsersService} from "./users.service";

@Controller("users")
@ApiTags("Users")
export class UsersController{
    constructor(
        private readonly usersService: UsersService
    ){}

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

    @Patch("/me/username")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "User's username updated successfully", type: UserResponse})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    async updateUsername(@Req() req: any, @Body() updateUsernameDto: UpdateUsernameDto): Promise<UserResponse>{
        const user = await this.usersService.updateUsername(req.user.id, updateUsernameDto.username);
        return new UserResponse(user);
    }

    @Patch("/me/password")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "User's password updated successfully", type: UserResponse})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    async updatePassword(@Req() req: any, @Body() updatePasswordDto: UpdatePasswordDto): Promise<UserResponse>{
        const user = await this.usersService.updatePassword(req.user.id, updatePasswordDto.password);
        return new UserResponse(user);
    }

    @Delete("/me")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "User deleted successfully"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    async deleteUser(@Req() req: any): Promise<void>{
        await this.usersService.deleteUser(req.user.id);
    }
}
