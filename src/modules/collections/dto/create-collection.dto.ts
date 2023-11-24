import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { CreateCustomFieldDto } from 'src/modules/custom_fields/dto/create-custom_field.dto';
import { CreateItemDto } from 'src/modules/items/dto/create-item.dto';

export class CreateCollectionDto {
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    topic: string;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    description: string;

    @ApiProperty({ description: 'Paste link' })
    @IsOptional()
    @Type(() => String)
    @IsString()
    photo: string;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Array)
    @IsArray()
    customFields: CreateCustomFieldDto[];

    @ApiProperty()
    @IsOptional()
    @Type(() => Array)
    @IsArray()
    removedCustomFieldsIds?: number[];
}
