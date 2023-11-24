import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResponse } from 'src/common/pagination/pagination-response.dto';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { CustomField } from '../custom_fields/entities/custom_field.entity';
import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { Collection } from '../collections/entities/collection.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(
      @InjectRepository(User)
      private readonly userRepo: Repository<User>,
        @InjectRepository(Collection)
        private readonly collectionRepo: Repository<Collection>,
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
        @InjectRepository(CustomField)
        private readonly customFieldRepo: Repository<CustomField>,
    ) {}
    create(createAdminDto: CreateAdminDto) {
        return 'This action adds a new admin';
    }

    async findAllForAdmin(query?: PaginationDto): Promise<PaginationResponse> {
        const total = await this.collectionRepo.count();
        const result = await this.collectionRepo.find({
            relations: {
                owner: true
            },
            order: {
                [query?.orderBy || 'id']: query?.order || 'asc',
            },
            skip: (query?.limit || 10) * ((query?.page || 1) - 1),
            take: query?.limit || 10,
        });

        return {
            result,
            total,
            limit: Number(query?.limit || 10),
            page: Number(query?.page || 1),
        };
    }

    findOne(id: number) {
        return `This action returns a #${id} admin`;
    }

    update(id: number, updateAdminDto: UpdateAdminDto) {
        return `This action updates a #${id} admin`;
    }

    remove(id: number) {
        return `This action removes a #${id} admin`;
    }
}
