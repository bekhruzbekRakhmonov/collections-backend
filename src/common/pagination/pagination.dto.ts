import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsBoolean,
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class PaginationDto {
    @ApiPropertyOptional({ description: 'Search from query' })
    @IsOptional()
    @Type(() => String)
    @IsString()
    q?: string;

    @ApiPropertyOptional({ description: 'Filter by status' })
    @IsOptional()
    @Type(() => String)
    @IsIn(['active', 'inactive', 'removed'])
    status?: 'active' | 'inactive' | 'removed';

    @ApiPropertyOptional({ description: 'Number of page' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(1000000)
    @Transform(({ value }) => Number(value))
    page?: number;

    @ApiPropertyOptional({ description: 'Items for each page' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit?: number;

    @ApiPropertyOptional({ description: 'Order' })
    @IsOptional()
    @Type(() => String)
    @IsString()
    @IsIn(['asc', 'desc'])
    order?: 'asc' | 'desc';

    @ApiPropertyOptional({ description: 'Order by' })
    @IsOptional()
    @Type(() => String)
    @IsString()
    orderBy?: string;

    @ApiPropertyOptional({ description: 'Detail set `true` or `false`' })
    @IsOptional()
    @Type(() => String)
    @Transform(({ value }) => (value === 'true' ? true : false))
    detail?: boolean;

    @ApiPropertyOptional({ description: 'Order by' })
    @IsOptional()
    @Type(() => String)
    @IsString()
    columnName?: string;
}
