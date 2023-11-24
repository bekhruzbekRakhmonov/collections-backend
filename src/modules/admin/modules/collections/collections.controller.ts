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
import { Response, query } from 'express';
import { APIResponse } from 'src/common/http/response/response.api';
import { CreateCollectionDto } from 'src/modules/collections/dto/create-collection.dto';
import { UpdateCollectionDto } from 'src/modules/collections/dto/update-collection.dto';
import { AdminCollectionsService } from './collections.service';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@ApiTags('admin - collections')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin/collections')
export class AdminCollectionsController {
    constructor(
        private readonly adminCollectionsService: AdminCollectionsService,
    ) {}

    @Post()
    async create(
        @Body() createCollectionDto: CreateCollectionDto,
        @Res() res: Response,
    ) {
        const createdCollection = await this.adminCollectionsService.create(
            createCollectionDto,
        );
        return APIResponse(res).statusOK(createdCollection);
    }

    @Get()
    async findAll(@Res() res: Response, @Query() query: PaginationDto) {
        const allCollections = await this.adminCollectionsService.findAll(query);
        return APIResponse(res).statusOK(allCollections);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const collection = await this.adminCollectionsService.findOne(+id);
        return APIResponse(res).statusOK(collection);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCollectionDto: UpdateCollectionDto,
        @Res() res: Response,
    ) {
        const updatedCollection = await this.adminCollectionsService.update(
            +id,
            updateCollectionDto,
        );
        return APIResponse(res).statusOK(updatedCollection);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        await this.adminCollectionsService.remove(+id);
        return APIResponse(res).statusNoContent();
    }
}
