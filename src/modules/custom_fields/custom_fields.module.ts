import { Module } from '@nestjs/common';
import { CustomFieldsService } from './custom_fields.service';
import { CustomFieldsController } from './custom_fields.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomField } from './entities/custom_field.entity';
import { Item } from '../items/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomField, Item])],
  controllers: [CustomFieldsController],
  providers: [CustomFieldsService],
})
export class CustomFieldsModule {}
