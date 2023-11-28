import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Res,
    UseGuards,
    Req,
    ForbiddenException,
    Query,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { ApiTags } from '@nestjs/swagger';
import { APIResponse } from 'src/common/http/response/response.api';
import { Response } from 'express';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import RequestWithUser from '../auth/interfaces/request-with-user.interface';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@ApiTags('collections')
@Controller('collections')
export class CollectionsController {
    constructor(private readonly collectionsService: CollectionsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body() createCollectionDto: CreateCollectionDto,
        @Res() res: Response,
        @Req() req: RequestWithUser,
    ) {
        const newCollection = await this.collectionsService.create(
            createCollectionDto,
            req.user,
        );
        return APIResponse(res).statusOK(newCollection);
    }

    @Get()
    async findAll(@Res() res: Response, @Query() dto: PaginationDto) {
        const collections = await this.collectionsService.findAll(dto);
        return APIResponse(res).statusOK(collections);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/list')
    async findCollectionsByUserId(
        @Param('id') id: string,
        @Res() res: Response,
        @Query() dto: PaginationDto,
    ) {
        const collections =
            await this.collectionsService.findCollectionsByUserId(+id, dto);
        return APIResponse(res).statusOK(collections);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const collection = await this.collectionsService.findOne(+id);
        return APIResponse(res).statusOK(collection);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCollectionDto: UpdateCollectionDto,
        @Req() req: RequestWithUser,
        @Res() res: Response,
    ) {
        const collection = await this.collectionsService.findOne(+id);
        if (
            collection.owner.id !== req.user.id
        ) {
            throw new ForbiddenException("Can't modify this collection");
        }
        const updatedCollection = await this.collectionsService.update(
            +id,
            updateCollectionDto,
        );
        return APIResponse(res).statusOK(updatedCollection);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @Req() req: RequestWithUser,
        @Res() res: Response,
    ) {
        const collection = await this.collectionsService.findOne(+id);
        if (
            collection.owner.id !== req.user.id
        ) {
            throw new ForbiddenException("Can't delete this collection");
        }
        await this.collectionsService.remove(+id);
        return APIResponse(res).statusNoContent();
    }
}
