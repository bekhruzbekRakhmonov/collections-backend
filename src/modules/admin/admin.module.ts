import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Collection } from '../collections/entities/collection.entity';
import { Item } from '../items/entities/item.entity';
import { CustomField } from '../custom_fields/entities/custom_field.entity';
import { Comment } from '../comments/entities/comment.entity';
import { UsersService } from '../users/users.service';
import { CollectionsService } from '../collections/collections.service';
import { ItemsService } from '../items/items.service';
import { CustomFieldsService } from '../custom_fields/custom_fields.service';
import { CommentsService } from '../comments/comments.service';
import { UsersController } from './users/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Collection, Item, CustomField, Comment])],
  controllers: [AdminController,UsersController],
  providers: [AdminService, UsersService, CollectionsService, ItemsService, CustomFieldsService, CommentsService],
})
export class AdminModule {}
