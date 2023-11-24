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
import { CreateCommentDto } from 'src/modules/comments/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/modules/comments/dto/update-comment.dto';
import { AdminCommentsService } from './comments.service';
import { APIResponse } from 'src/common/http/response/response.api';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@ApiTags('admin - comments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin/comments')
export class AdminCommentsController {
    constructor(private readonly adminCommentsService: AdminCommentsService) {}

    @Post()
    async create(
        @Body() createCommentDto: CreateCommentDto,
        @Res() res: Response,
    ) {
        const createdComment = await this.adminCommentsService.create(
            createCommentDto,
        );
        return APIResponse(res).statusOK(createdComment);
    }

    @Get()
    async findAll(@Res() res: Response, @Query() query: PaginationDto) {
        const allComments = await this.adminCommentsService.findAll(query);
        return APIResponse(res).statusOK(allComments);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const comment = await this.adminCommentsService.findOne(+id);
        return APIResponse(res).statusOK(comment);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCommentDto: UpdateCommentDto,
        @Res() res: Response,
    ) {
        const updatedComment = await this.adminCommentsService.update(
            +id,
            updateCommentDto,
        );
        return APIResponse(res).statusOK(updatedComment);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        await this.adminCommentsService.remove(+id);
        return APIResponse(res).statusNoContent();
    }
}
