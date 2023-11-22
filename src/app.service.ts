import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './modules/items/entities/item.entity';
import { PaginationDto } from './common/pagination/pagination.dto';

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
    ) {}

    async getHello(query: PaginationDto) {
        const result = await this.itemRepo
            .createQueryBuilder()
            .where('name ILIKE :searchQuery', {searchQuery: `%${query.q}%`})
            .orWhere('tags ILIKE :searchQuery', {searchQuery: `%${query.q}%`})
            .getMany();
        console.log(result);
        return result;
    }
}
