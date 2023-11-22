import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, MinLength, IsOptional, IsIn } from "class-validator";


export class UpdateUserDto {
    @ApiProperty()
    @IsOptional()
    @Type(() => String)
    @IsString()
    name?: string;

    @ApiProperty()
    @IsOptional()
    email?: string;

    @ApiProperty({ enum: ['admin', 'user'] })
    @IsOptional()
    @IsIn(['admin', 'user'])
    role?: 'admin' | 'user';

    @ApiProperty({ enum: ['active', 'blocked'] })
    @IsOptional()
    @IsIn(['active', 'blocked'])
    status?: 'active' | 'blocked';
}
