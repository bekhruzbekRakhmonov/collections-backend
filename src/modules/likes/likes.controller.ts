import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Res,
    UseGuards,
    Req,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { APIResponse } from 'src/common/http/response/response.api';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import RequestWithUser from '../auth/interfaces/request-with-user.interface';

@ApiTags('likes')
@Controller('likes')
export class LikesController {
    constructor(private readonly likesService: LikesService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async likeOrUnlike(
        @Body() createLikeDto: CreateLikeDto,
        @Res() res: Response,
        @Req() req: RequestWithUser,
    ) {
        const likedOrUnlikedItem = await this.likesService.likeOrUnlike(
            createLikeDto,
            req.user,
        );
        return APIResponse(res).statusCreated(likedOrUnlikedItem);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Res() res: Response) {
        const likes = await this.likesService.findAll();
        return APIResponse(res).statusOK(likes);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const like = await this.likesService.findOne(+id);
        return APIResponse(res).statusOK(like);
    }
}
