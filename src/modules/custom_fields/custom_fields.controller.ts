import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, UseGuards, Put } from '@nestjs/common';
import { CustomFieldsService } from './custom_fields.service';
import { CreateCustomFieldDto, CreateManyCustomFieldsDto } from './dto/create-custom_field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom_field.dto';
import { ApiTags } from '@nestjs/swagger';
import { APIResponse } from 'src/common/http/response/response.api';
import { Response } from 'express';
import RequestWithUser from '../auth/interfaces/request-with-user.interface';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

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
        );
        return APIResponse(res).statusCreated(newCustomFields);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Res() res: Response) {
        const customFields = await this.customFieldsService.findAll();
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
    ) {
        const updatedCustomField = await this.customFieldsService.update(
            +id,
            updateCustomFieldDto,
        );
        return APIResponse(res).statusOK(updatedCustomField);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put('many')
    async updateMany(
        @Param('id') id: string,
        @Body() updateManyCustomFieldsDto: CreateManyCustomFieldsDto,
        @Res() res: Response,
    ) {
        const updatedCustomFields = await this.customFieldsService.updateMany(
            updateManyCustomFieldsDto,
        );
        return APIResponse(res).statusOK(updatedCustomFields);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        const removedCustomField = await this.customFieldsService.remove(+id);
        return APIResponse(res).statusNoContent();
    }
}
