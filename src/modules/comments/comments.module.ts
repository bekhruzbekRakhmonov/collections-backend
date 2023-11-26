import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsGateway } from './comments.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Item } from '../items/entities/item.entity';
import { CommentsController } from './comments.controller';
import { Collection } from '../collections/entities/collection.entity';
import { UsersModule } from '../users/users.module';
import { Like } from '../likes/entities/like.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Comment, User, Item, Like, Collection]), AuthModule],
    providers: [CommentsGateway, CommentsService, AuthService, UsersService, ConfigService],
    controllers: [CommentsController]
})
export class CommentsModule {}
