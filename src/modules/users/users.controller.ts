import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Res,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { APIResponse } from 'src/common/http/response/response.api';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/roles/role.enum';
import RequestWithUser from '../auth/interfaces/request-with-user.interface';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        try {
            const user = await this.usersService.create(createUserDto);
            return APIResponse(res).statusCreated(user);
        } catch (error) {
            throw error;
        }
    }

    @Get()
    async findAll(@Query() dto: PaginationDto, @Res() res: Response) {
        const users = await this.usersService.findAll(dto);
        return APIResponse(res).statusOK(users);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const user = await this.usersService.findOne(+id);
        return APIResponse(res).statusOK(user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Res() res: Response,
    ) {
        const updatedUser = await this.usersService.update(+id, updateUserDto);
        return APIResponse(res).statusOK(updatedUser);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        await this.usersService.remove(+id);
        return APIResponse(res).statusNoContent();
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update-account')
    async updateAccount(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Res() res: Response,
        @Req() req: RequestWithUser,
    ) {
        const updatedUser = await this.usersService.update(req.user.id, updateUserDto);
        return APIResponse(res).statusOK(updatedUser);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete-account')
    async removeAccount(
        @Param('id') id: string,
        @Res() res: Response,
        @Req() req: RequestWithUser,
    ) {
        await this.usersService.remove(req.user.id);
        return APIResponse(res).statusNoContent();
    }
}
