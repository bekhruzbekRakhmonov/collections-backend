import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { query } from 'express';
import { PaginationDto } from './common/pagination/pagination.dto';
import { Repository } from 'typeorm';
import { Item } from './modules/items/entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService, 
        ) {}

    @Get('search')
    async search(@Query() query: PaginationDto) {
        return await this.appService.getHello(query);
    }
}
