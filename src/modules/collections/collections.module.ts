import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { Item } from '../items/entities/item.entity';
import { CustomField } from '../custom_fields/entities/custom_field.entity';
import { User } from '../users/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Collection, Item, CustomField, User, Comment])],
    controllers: [CollectionsController],
    providers: [CollectionsService],
})
export class CollectionsModule {}
