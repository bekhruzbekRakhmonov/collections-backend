import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Collection } from '../collections/entities/collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Collection])],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
