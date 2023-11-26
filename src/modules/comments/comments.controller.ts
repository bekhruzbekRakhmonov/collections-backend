import {
    Controller,
    Get,
    Param,
    Query,
    Res,
    Post,
    Body,
    Put,
    Delete,
    Patch,
    UseGuards,
    Req,
    ForbiddenException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { Response } from 'express';
import { APIResponse } from 'src/common/http/response/response.api';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import RequestWithUser from '../auth/interfaces/request-with-user.interface';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/roles/role.enum';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Get()
    async findAll(@Res() res: Response, @Query() dto: PaginationDto) {
        const comments = await this.commentsService.findAll(dto);
        return APIResponse(res).statusOK(comments);
    }

    @Get('poll/:id')
    async findCommentsByItemId(@Param('id') id: number, @Res() res: Response) {
        const comments = await this.commentsService.findCommentsByItemId(id);
        return APIResponse(res).statusOK(comments);
    }

    @Get(':id')
    async findOne(@Param('id') id: number, @Res() res: Response) {
        const comment = await this.commentsService.findOne(id);
        return APIResponse(res).statusOK(comment);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async create(
        @Res() res: Response,
        @Res() req: RequestWithUser,
        @Body() dto: CreateCommentDto,
    ) {
        const createdComment = await this.commentsService.create(dto, req.user);
        return APIResponse(res).statusOK(createdComment);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    async update(
        @Param('id') id: number,
        @Body() dto: UpdateCommentDto,
        @Res() res: Response,
        @Req() req: RequestWithUser,
    ) {
        const comment = await this.commentsService.findOne(+id);
        if (comment.owner.id !== req.user.id) {
            throw new ForbiddenException("Can't modify this comment");
        }
        const updatedComment = await this.commentsService.update(id, dto);
        return APIResponse(res).statusOK(updatedComment);
    }

    @Delete(':id')
    async delete(
        @Param('id') id: number,
        @Res() res: Response,
        @Req() req: RequestWithUser,
    ) {
        const comment = await this.commentsService.findOne(+id);
        if (comment.owner.id !== req.user.id) {
            throw new ForbiddenException("Can't modify this comment");
        }
        await this.commentsService.remove(id);
        return APIResponse(res).statusNoContent();
    }
}
