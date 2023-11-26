import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Collection } from '../collections/entities/collection.entity';
import { Item } from '../items/entities/item.entity';
import { Like } from '../likes/entities/like.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User,Collection, Item,Like])],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
