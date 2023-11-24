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
import { CreateCustomFieldDto } from 'src/modules/custom_fields/dto/create-custom_field.dto';
import { UpdateCustomFieldDto } from 'src/modules/custom_fields/dto/update-custom_field.dto';
import { AdminCustomFieldsService } from './custom-fields.service';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@ApiTags('admin - custom fields')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin/custom-fields')
export class AdminCustomFieldsController {
    constructor(
        private readonly adminCustomFieldsService: AdminCustomFieldsService,
    ) {}

    @Post()
    async create(
        @Body() createCustomFieldDto: CreateCustomFieldDto,
        @Res() res: Response,
    ) {
        const createdCustomField = await this.adminCustomFieldsService.create(
            createCustomFieldDto,
        );
        return APIResponse(res).statusOK(createdCustomField);
    }

    @Get()
    async findAll(@Res() res: Response, @Query() query: PaginationDto) {
        const allCustomFields = await this.adminCustomFieldsService.findAll(query);
        return APIResponse(res).statusOK(allCustomFields);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const customField = await this.adminCustomFieldsService.findOne(+id);
        return APIResponse(res).statusOK(customField);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCustomFieldDto: UpdateCustomFieldDto,
        @Res() res: Response,
    ) {
        const updatedCustomField = await this.adminCustomFieldsService.update(
            +id,
            updateCustomFieldDto,
        );
        return APIResponse(res).statusOK(updatedCustomField);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        await this.adminCustomFieldsService.remove(+id);
        return APIResponse(res).statusNoContent();
    }
}
