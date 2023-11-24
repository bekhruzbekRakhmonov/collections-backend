import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCustomFieldDto {
    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    id?: number;

    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    collection_id?: number;

    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    item_id?: number;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    value: string;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    @IsIn(['string', 'integer', 'multiline', 'boolean', 'date'])
    type: 'string' | 'integer' | 'multiline' | 'boolean' | 'date';
}


export class CreateManyCustomFieldsDto {
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Array)
    @IsArray()
    itemsIds: number[];

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Array)
    @IsArray()
    customFields: CreateCustomFieldDto[][];

    @ApiProperty()
    @IsOptional()
    @Type(() => Array)
    @IsArray()
    removedCustomFieldsIds?: number[];
}