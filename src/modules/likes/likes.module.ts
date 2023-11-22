import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Item } from '../items/entities/item.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Like, Item])],
    controllers: [LikesController],
    providers: [LikesService],
})
export class LikesModule {}
