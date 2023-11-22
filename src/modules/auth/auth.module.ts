import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { Collection } from '../collections/entities/collection.entity';
import { Item } from '../items/entities/item.entity';
import { Comment } from '../comments/entities/comment.entity';
import { CustomField } from '../custom_fields/entities/custom_field.entity';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }), // Ensure 'jwt' is set as the default strategy
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
        UsersModule,
        TypeOrmModule.forFeature([User, Collection, Item, Comment, CustomField]),
    ],
    controllers: [AuthController],
    exports: [PassportModule, JwtModule],
    providers: [AuthService, UsersService, JwtService, ConfigService, JwtStrategy],
})
export class AuthModule {}
