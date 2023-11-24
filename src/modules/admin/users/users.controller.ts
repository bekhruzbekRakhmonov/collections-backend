import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import JwtAuthGuard from 'src/modules/auth/guards/jwt-auth.guard';
import { Role } from 'src/modules/auth/roles/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles/roles.guard';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UsersService } from 'src/modules/users/users.service';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("admin - users")
@Controller('admin/users/')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Post()
    create(@Body() createAdminDto: CreateAdminDto) {
        // return this.usersService.create(createAdminDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
        return this.usersService.update(+id, updateAdminDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
