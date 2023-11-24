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
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/roles/role.enum';
import { UsersService } from '../users/users.service';
import { CollectionsService } from '../collections/collections.service';
import { ItemsService } from '../items/items.service';
import { CustomFieldsService } from '../custom_fields/custom_fields.service';
import { CommentsService } from '../comments/comments.service';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly usersService: UsersService,
        private readonly collectionsService: CollectionsService,
        private readonly itemsService: ItemsService,
        private readonly customFieldsService: CustomFieldsService,
        private readonly commentsService: CommentsService
    ) {}

    @Post()
    create(@Body() createAdminDto: CreateAdminDto) {
        // return this.usersService.create(createAdminDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('users')
    findAllUsers() {
        // return this.usersService.findAllForAdmin();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('collections')
    findAllCollections() {
        // return this.usersService.findAllForAdmin();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('items')
    findAllItems() {
        // return this.usersService.findAllForAdmin();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('comments')
    findAllComments() {
        // return this.usersService.findAllForAdmin();
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
