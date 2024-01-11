import {Body, Controller, Delete, Get, HttpStatus, Patch, Req, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UserResponse} from "./models/responses/user.response";
import {AtGuard} from "../auth/guards/at.guard";
import {UsersService} from "./users.service";
import {UpdatePasswordDto} from "./models/dto/update-password.dto";
import {UpdateUsernameDto} from "./models/dto/update-username.dto";
import {MaintenanceGuard} from "../modules/misc/maintenance/guards/maintenance.guard";

@Controller("users")
@ApiTags("Users")
@UseGuards(MaintenanceGuard)
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
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    async updatePassword(@Req() req: any, @Body() updatePasswordDto: UpdatePasswordDto): Promise<UserResponse>{
        return new UserResponse(await this.usersService.updatePassword(req.user, updatePasswordDto.password));
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
