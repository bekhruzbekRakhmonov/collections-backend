import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';
import TokenPayload from '../interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UsersService,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: TokenPayload): Promise<any> {
        const user = await this.userService.findOne(payload.userId);
        const { password, ...rest } = user;
        if (!user) {
            throw new UnauthorizedException();
        }
        return { ...rest };
    }
    async authenticate(request: any, options?: any): Promise<any> {
        return super.authenticate(request, options);
    }
}

