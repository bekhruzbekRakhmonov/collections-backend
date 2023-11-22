import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCommentDto {
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    item_id: string;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    content: string;
}
