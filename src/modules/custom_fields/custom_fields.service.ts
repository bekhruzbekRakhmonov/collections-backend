import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomField } from './entities/custom_field.entity';
import { CreateCustomFieldDto, CreateManyCustomFieldsDto } from './dto/create-custom_field.dto';
import { Item } from '../items/entities/item.entity';
import { UpdateCustomFieldDto } from './dto/update-custom_field.dto';
import { User } from '../users/entities/user.entity';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { PaginationResponse } from 'src/common/pagination/pagination-response.dto';

@Injectable()
export class CustomFieldsService {
    constructor(
        @InjectRepository(CustomField)
        private readonly customFieldRepo: Repository<CustomField>,
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async create(dto: CreateCustomFieldDto): Promise<CustomField> {
        const { item_id, name, value, type } = dto;
        const item = await this.itemRepo.findOneBy({
            id: item_id,
        });
        const customField = this.customFieldRepo.create({
            name,
            value,
            type,
            item,
        });
        return await this.customFieldRepo.save(customField);
    }

    async createMany(dto: CreateManyCustomFieldsDto, owner: User): Promise<CustomField[]> {
        const { customFields, itemsIds } = dto;
        const newCustomFields = await Promise.all(
            customFields.map(async (itemFields, index) => {
                const newCustomFieldsForItem = await Promise.all(
                    itemFields.map(async ({ name, type, value }) => {
                        const item = await this.itemRepo.findOneBy({
                            id: itemsIds[index],
                        });
                        const newCustomField = this.customFieldRepo.create({
                            name,
                            type,
                            value,
                            item,
                            owner,
                        });
                        const saved = await this.customFieldRepo.save(
                            newCustomField,
                        );
                        return saved;
                    }),
                );
                return newCustomFieldsForItem;
            }),
        );
        return newCustomFields.flat();
    }

    async findAll(query: PaginationDto): Promise<PaginationResponse> {
        const total = await this.customFieldRepo.count();
        const result = await this.customFieldRepo.find({
            order: {
                id: "DESC"
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

    async findOne(id: number): Promise<CustomField> {
        const customField = await this.customFieldRepo.findOne({
            relations: {
                owner: true,
            },
            where: { id },
        });
        if (!customField) {
            throw new NotFoundException('Custom field not found');
        }
        return customField;
    }

    async update(
        id: number,
        updateCustomFieldDto: UpdateCustomFieldDto,
    ): Promise<CustomField> {
        await this.customFieldRepo.update(id, updateCustomFieldDto);
        return this.findOne(id);
    }

    async updateMany(dto: CreateManyCustomFieldsDto, owner: User): Promise<CustomField[][]> {
        const { customFields, itemsIds, removedCustomFieldsIds } = dto;

        removedCustomFieldsIds?.map(async (removedCustomFieldId) => {
            await this.customFieldRepo.delete(removedCustomFieldId);
        });

        const updatedCustomFields = await Promise.all(
            customFields.map(async (itemFields, index) => {
                return Promise.all(
                    itemFields.map(async ({ id, name, type, value }) => {
                        if (id) {
                            await this.customFieldRepo.update(id, {
                                name,
                                type,
                                value,
                            });
                            const saved = await this.customFieldRepo.findOneBy({ id })
                            return saved;
                        } else {
                            const item = await this.itemRepo.findOne({
                                where: {
                                    id: itemsIds[index],
                                },
                                relations: {
                                    custom_fields: true,
                                },
                            });

                            const newCustomField = this.customFieldRepo.create({
                                name,
                                type,
                                value,
                                item,
                                owner,
                            });

                            return await this.customFieldRepo.save(
                                newCustomField,
                            );
                        }
                    }),
                );
            }),
        );

        return updatedCustomFields;
    }

    async remove(id: number): Promise<void> {
        await this.customFieldRepo.delete(id);
    }
}
