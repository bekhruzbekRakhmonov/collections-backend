import {
    Controller,
    Get,
    Post,
    UseInterceptors,
    ClassSerializerInterceptor,
    UseGuards,
    HttpCode,
    Req,
    Body,
    BadRequestException,
    Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { APIResponse } from 'src/common/http/response/response.api';
import { UsersService } from 'src/modules/users/users.service';
import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import JwtAuthGuard from './guards/jwt-auth.guard';
import RequestWithUser from './interfaces/request-with-user.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    @HttpCode(200)
    @Post('login')
    async logIn(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { email, password } = loginDto;
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new BadRequestException('Email or password is wrong');
        }
        const refreshToken = this.authService.getJwtRefreshToken(
            user.id,
            user.role,
        );

        const accessToken = this.authService.getJwtAccessToken(
            user.id,
            user.role,
        );

        const {
            moderator_id,
            action_message,
            created_at,
            updated_at,
            currentHashedRefreshToken,
            ...userData
        } = user;
        return { accessToken, refreshToken, user: userData };
    }

    @Post('register')
    @HttpCode(200)
    async register(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);
        return APIResponse(res).statusCreated(user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(200)
    async logOut(@Req() req: RequestWithUser, @Res() res: Response) {
        try {
            await this.usersService.removeRefreshToken(req.user.id);
            APIResponse(res).statusOK();
        } catch (error) {
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    authenticate(@Req() request: RequestWithUser) {
        return request.user;
    }

    @Post('refresh')
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        const { refreshToken } = refreshTokenDto;
        const user = await this.authService.getUserFromUnuthenticatedToken(
            refreshToken,
        );
        const accessToken = this.authService.getJwtAccessToken(
            user.userId,
            user.role,
        );
        console.log(accessToken)
        return { accessToken };
    }
}
