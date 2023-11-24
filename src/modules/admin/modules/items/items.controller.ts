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
    HttpStatus,
    Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import JwtAuthGuard from 'src/modules/auth/guards/jwt-auth.guard';
import { Role } from 'src/modules/auth/roles/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles/roles.guard';
import { Response } from 'express';
import { APIResponse } from 'src/common/http/response/response.api';
import { CreateItemDto } from 'src/modules/items/dto/create-item.dto';
import { UpdateItemDto } from 'src/modules/items/dto/update-item.dto';
import { AdminItemsService } from './items.service';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@ApiTags('admin - items')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin/items')
export class AdminItemsController {
    constructor(private readonly adminItemsService: AdminItemsService) {}

    @Post()
    async create(@Body() createItemDto: CreateItemDto, @Res() res: Response) {
        const createdItem = await this.adminItemsService.create(createItemDto);
        return APIResponse(res).statusOK(createdItem);
    }

    @Get()
    async findAll(@Res() res: Response, @Query() query: PaginationDto) {
        const allItems = await this.adminItemsService.findAll(query);
        return APIResponse(res).statusOK(allItems);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const item = await this.adminItemsService.findOne(+id);
        return APIResponse(res).statusOK(item);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateItemDto: UpdateItemDto,
        @Res() res: Response,
    ) {
        const updatedItem = await this.adminItemsService.update(
            +id,
            updateItemDto,
        );
        return APIResponse(res).statusOK(updatedItem);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        await this.adminItemsService.remove(+id);
        return APIResponse(res).statusNoContent();
    }
}
