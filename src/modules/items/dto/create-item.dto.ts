import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreateCustomFieldDto } from "src/modules/custom_fields/dto/create-custom_field.dto";

export class CreateItemDto {
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    id?: number;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    collection_id: number;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Array)
    @IsArray()
    custom_fields?: CreateCustomFieldDto[];

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Array)
    @IsArray()
    tags: string;
}


export class CreateManyItemsDto {
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    collection_id: number;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Array)
    @IsArray()
    items: CreateItemDto[];
}