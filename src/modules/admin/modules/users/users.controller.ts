import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Res,
    Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import JwtAuthGuard from 'src/modules/auth/guards/jwt-auth.guard';
import { Role } from 'src/modules/auth/roles/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles/roles.guard';
import { Response } from 'express';
import { APIResponse } from 'src/common/http/response/response.api';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';
import { AdminUsersService } from './users.service';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@ApiTags('admin - users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin/users')
export class AdminUsersController {
    constructor(private readonly adminUsersService: AdminUsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        const createdUser = await this.adminUsersService.create(createUserDto);
        return APIResponse(res).statusOK(createdUser);
    }

    @Get()
    async findAll(@Res() res: Response, @Query() query: PaginationDto) {
        const allUsers = await this.adminUsersService.findAll(query);
        return APIResponse(res).statusOK(allUsers);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const user = await this.adminUsersService.findOne(+id);
        return APIResponse(res).statusOK(user);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Res() res: Response,
    ) {
        const updatedUser = await this.adminUsersService.update(
            +id,
            updateUserDto,
        );
        return APIResponse(res).statusOK(updatedUser);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        await this.adminUsersService.remove(+id);
        return APIResponse(res).statusNoContent();
    }
}
