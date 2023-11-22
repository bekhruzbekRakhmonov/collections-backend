import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateLikeDto {
    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    item_id: number;
}
