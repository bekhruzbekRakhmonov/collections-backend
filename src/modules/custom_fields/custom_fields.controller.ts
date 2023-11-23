import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, UseGuards, Put, ForbiddenException, Query } from '@nestjs/common';
import { CustomFieldsService } from './custom_fields.service';
import { CreateCustomFieldDto, CreateManyCustomFieldsDto } from './dto/create-custom_field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom_field.dto';
import { ApiTags } from '@nestjs/swagger';
import { APIResponse } from 'src/common/http/response/response.api';
import { Response } from 'express';
import RequestWithUser from '../auth/interfaces/request-with-user.interface';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Role } from '../auth/roles/role.enum';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@ApiTags('custom-fields')
@Controller('custom-fields')
export class CustomFieldsController {
    constructor(private readonly customFieldsService: CustomFieldsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body() createCustomFieldDto: CreateCustomFieldDto,
        @Res() res: Response,
        @Req() req: RequestWithUser,
    ) {
        const newCustomField = await this.customFieldsService.create(
            createCustomFieldDto,
        );
        return APIResponse(res).statusCreated(newCustomField);
    }

    @UseGuards(JwtAuthGuard)
    @Post('many')
    async createMany(
        @Body() createManyCustomFieldsDto: CreateManyCustomFieldsDto,
        @Res() res: Response,
        @Req() req: RequestWithUser,
    ) {
        const newCustomFields = await this.customFieldsService.createMany(
            createManyCustomFieldsDto,
            req.user.id,
        );
        return APIResponse(res).statusCreated(newCustomFields);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Res() res: Response, @Query() query: PaginationDto) {
        const customFields = await this.customFieldsService.findAll(query);
        return APIResponse(res).statusOK(customFields);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const customField = await this.customFieldsService.findOne(+id);
        return APIResponse(res).statusOK(customField);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCustomFieldDto: UpdateCustomFieldDto,
        @Res() res: Response,
        @Req() req: RequestWithUser,
    ) {
        const customField = await this.customFieldsService.findOne(+id);
        if (
            customField.owner.id !== req.user.id &&
            req.user.role !== Role.Admin
        ) {
            throw new ForbiddenException("Can't modify this custom field");
        }
        const updatedCustomField = await this.customFieldsService.update(
            +id,
            updateCustomFieldDto,
        );
        return APIResponse(res).statusOK(updatedCustomField);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put('many')
    async updateMany(
        @Body() updateManyCustomFieldsDto: CreateManyCustomFieldsDto,
        @Res() res: Response,
        @Req() req: RequestWithUser,
    ) {
        const { customFields } = updateManyCustomFieldsDto;

        for (const itemFields of customFields) {
            for (const field of itemFields) {
                const customField = await this.customFieldsService.findOne(
                    field.id,
                );

                if (
                    customField.owner.id !== req.user.id &&
                    req.user.role !== Role.Admin
                ) {
                    throw new ForbiddenException(
                        "Can't modify this custom field",
                    );
                }
            }
        }

        const updatedCustomFields = await this.customFieldsService.updateMany(
            updateManyCustomFieldsDto,
        );
        return APIResponse(res).statusOK(updatedCustomFields);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @Res() res: Response,
        @Req() req: RequestWithUser,
    ) {
        const customField = await this.customFieldsService.findOne(+id);
        if (
            customField.owner.id !== req.user.id &&
            req.user.role !== Role.Admin
        ) {
            throw new ForbiddenException("Can't modify this custom field");
        }
        await this.customFieldsService.remove(+id);
        return APIResponse(res).statusNoContent();
    }
}
