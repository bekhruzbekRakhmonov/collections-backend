
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemDto, CreateManyItemsDto } from './dto/create-item.dto';
import { Collection } from '../collections/entities/collection.entity';
import { UpdateItemDto } from './dto/update-item.dto';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { PaginationResponse } from 'src/common/pagination/pagination-response.dto';
import { Comment } from '../comments/entities/comment.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
        @InjectRepository(Collection)
        private readonly collectionRepo: Repository<Collection>,
    ) {}

    async create(dto: CreateItemDto, owner: User): Promise<Item> {
        const { collection_id, name, tags } = dto;
        const collection = await this.collectionRepo.findOneBy({
            id: collection_id,
        });
        const item = this.itemRepo.create({ collection, name, tags, owner });
        return this.itemRepo.save(item);
    }

    async createMany(dto: CreateManyItemsDto, owner: User): Promise<Item[]> {
        const { collection_id, items } = dto;
        const collection = await this.collectionRepo.findOneBy({
            id: collection_id,
        });
        const newItems = await Promise.all(
            items.map(async ({ name, tags }) => {
                const newItem = this.itemRepo.create({
                    collection,
                    name,
                    tags,
                    owner
                });
                return await this.itemRepo.save(newItem);
            }),
        );
        return newItems;
    }

    async findAllComments(id: number): Promise<Comment[]> {
        const item = await this.itemRepo.findOne({
            where: {
                id,
            },
            relations: {
                comments: {
                    owner: true,
                },
            },
        });
        return item.comments;
    }

    async findAll(query?: PaginationDto): Promise<PaginationResponse> {
        const total = await this.itemRepo.count();
        const result = await this.itemRepo.find({
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
    async findItemsByCollectionId(collection_id: number) {
        const items = await this.itemRepo.find({
            relations: {
                custom_fields: true,
            },
            where: {
                collection: {
                    id: collection_id
                }
            }
        })
        return items;
    }

    async findOne(id: number): Promise<Item> {
        const item = await this.itemRepo.findOne({
            where: {id},
            relations: {
                owner: true,
                custom_fields: true,
                likes: {
                    owner: true
                }
            }
        });
        if (!item) {
            throw new NotFoundException("Item not found");
        }
        return item;
    }

    async update(id: number, itemData: UpdateItemDto): Promise<Item> {
        await this.itemRepo.update(id, itemData);
        const updatedItem = await this.itemRepo.findOneBy({ id });
        return updatedItem;
    }

    async updateMany(dto: CreateManyItemsDto): Promise<Item[]> {
        const { collection_id, items } = dto;
        const collection = await this.collectionRepo.findOneBy({
            id: collection_id,
        });
        const newItems = await Promise.all(
            items.map(async ({ id, name, tags }) => {
                if (id) {
                    await this.itemRepo.update(id, {name, tags})
                    return await this.itemRepo.findOneBy({ id })
                }
                const newItem = this.itemRepo.create({
                    collection,
                    name,
                    tags,
                });
                return await this.itemRepo.save(newItem);
            }),
        );
        return newItems;
    }

    async remove(id: number): Promise<void> {
        await this.itemRepo.delete(id);
    }
}
