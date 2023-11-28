import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Query, Put, Req, ForbiddenException } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto, CreateManyItemsDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { APIResponse } from 'src/common/http/response/response.api';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import RequestWithUser from '../auth/interfaces/request-with-user.interface';

@ApiTags('items')
@Controller('items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async create(@Body() createItemDto: CreateItemDto, @Res() res: Response, @Req() req: RequestWithUser) {
        const newItem = await this.itemsService.create(createItemDto, req.user);
        return APIResponse(res).statusCreated(newItem);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('many')
    async createMany(
        @Body() createManyItemsDto: CreateManyItemsDto,
        @Res() res: Response,
        @Req() req: RequestWithUser,
    ) {
        const newItems = await this.itemsService.createMany(createManyItemsDto, req.user);
        return APIResponse(res).statusCreated(newItems);
    }

    @Get()
    async findAll(@Res() res: Response, @Query() dto: PaginationDto) {
        const items = await this.itemsService.findAll(dto);
        return APIResponse(res).statusOK(items);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const item = await this.itemsService.findOne(+id);
        return APIResponse(res).statusOK(item);
    }

    @Get(':id/collections')
    async findItemsByCollectionId(
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        const items = await this.itemsService.findItemsByCollectionId(+id);
        return APIResponse(res).statusOK(items);
    }

    @Get(':id/comments')
    async findAllComments(@Param('id') id: string, @Res() res: Response) {
        const comments = await this.itemsService.findAllComments(+id);
        return APIResponse(res).statusOK(comments);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateItemDto: UpdateItemDto,
        @Res() res: Response,
        @Req() req: RequestWithUser,
    ) {
        const item = await this.itemsService.findOne(+id);
        if (item.owner.id !== req.user.id) {
            throw new ForbiddenException("Can't modify this item");
        }
        const updatedItem = await this.itemsService.update(+id, updateItemDto);
        return APIResponse(res).statusOK(updatedItem);
    }

    @UseGuards(JwtAuthGuard)
    @Put('many')
    async updateMany(
        @Body() updateManyItemsDto: CreateManyItemsDto,
        @Res() res: Response,
        @Req() req: RequestWithUser,
    ) {
        const { items } = updateManyItemsDto;

        // items.map(async (itemData) => {
        //     const item = await this.itemsService.findOne(itemData.id);
        //     if (item.owner.id !== req.user.id) {
        //         throw new ForbiddenException("Can't modify this item");
        //     }
        // })

        const updatedItems = await this.itemsService.updateMany(
            updateManyItemsDto,
            req.user
        );
        return APIResponse(res).statusOK(updatedItems);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @Res() res: Response,
        @Req() req: RequestWithUser,
    ) {
        const item = await this.itemsService.findOne(+id);
        if (item.owner.id !== req.user.id) {
            throw new ForbiddenException("Can't modify this item");
        }
        await this.itemsService.remove(+id);
        return APIResponse(res).statusNoContent();
    }
}
