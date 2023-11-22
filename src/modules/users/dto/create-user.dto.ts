import { ApiProperty } from '@nestjs/swagger/dist';
import { Type } from 'class-transformer';
import {
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(4)
    password: string;

    @ApiProperty({ enum: ['admin', 'user'] })
    @IsOptional()
    @IsIn(['admin', 'user'])
    role?: 'admin' | 'user';
}
