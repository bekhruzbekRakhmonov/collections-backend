import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Collection } from '../collections/entities/collection.entity';
import { Item } from '../items/entities/item.entity';
import { CustomField } from '../custom_fields/entities/custom_field.entity';
import { Comment } from '../comments/entities/comment.entity';
import { AdminCollectionsController } from './modules/collections/collections.controller';
import { AdminItemsController } from './modules/items/items.controller';
import { AdminUsersController } from './modules/users/users.controller';
import { AdminCustomFieldsController } from './modules/custom_fields/custom-fields.controller';
import { AdminCommentsController } from './modules/comments/comments.controller';
import { AdminUsersService } from './modules/users/users.service';
import { AdminCollectionsService } from './modules/collections/collections.service';
import { AdminItemsService } from './modules/items/items.service';
import { AdminCustomFieldsService } from './modules/custom_fields/custom-fields.service';
import { AdminCommentsService } from './modules/comments/comments.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Collection,
            Item,
            CustomField,
            Comment,
        ]),
    ],
    controllers: [
        AdminUsersController,
        AdminCollectionsController,
        AdminItemsController,
        AdminCustomFieldsController,
        AdminCommentsController,
    ],
    providers: [
        AdminUsersService,
        AdminCollectionsService,
        AdminItemsService,
        AdminCustomFieldsService,
        AdminCommentsService
    ],
})
export class AdminModule {}
