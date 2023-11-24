import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { CommentsModule } from './modules/comments/comments.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { LikesModule } from './modules/likes/likes.module';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ItemsModule } from './modules/items/items.module';
import { CustomFieldsModule } from './modules/custom_fields/custom_fields.module';
import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './modules/items/entities/item.entity';
import { User } from './modules/users/entities/user.entity';
import { Collection } from './modules/collections/entities/collection.entity';
import { Comment } from './modules/comments/entities/comment.entity';
import { AdminModule } from './modules/admin/admin.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Item, User, Collection, Comment]),
        UsersModule,
        CommentsModule,
        CollectionsModule,
        LikesModule,
        DatabaseModule,
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                POSTGRES_HOST: Joi.string().required(),
                POSTGRES_PORT: Joi.string().required(),
                POSTGRES_USER: Joi.string().required(),
                POSTGRES_PASSWORD: Joi.string().required(),
                POSTGRES_DB: Joi.string().required(),
                PORT: Joi.number(),
            }),
        }),
        AuthModule,
        ItemsModule,
        CustomFieldsModule,
        AdminModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
