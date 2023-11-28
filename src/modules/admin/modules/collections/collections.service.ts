import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResponse } from 'src/common/pagination/pagination-response.dto';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import * as fs from 'node:fs';
import { isBase64Image } from 'src/common/utils/base64ImageChecker';
import { CreateCollectionDto } from 'src/modules/collections/dto/create-collection.dto';
import { UpdateCollectionDto } from 'src/modules/collections/dto/update-collection.dto';
import { CustomField } from 'src/modules/custom_fields/entities/custom_field.entity';
import { Item } from 'src/modules/items/entities/item.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository, DeleteResult, Like } from 'typeorm';
import { Collection } from 'src/modules/collections/entities/collection.entity';

@Injectable()
export class AdminCollectionsService {
    constructor(
        @InjectRepository(Collection)
        private readonly collectionRepo: Repository<Collection>,
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
        @InjectRepository(CustomField)
        private readonly customFieldRepo: Repository<CustomField>,
    ) {}

    async create(createCollectionDto: CreateCollectionDto, owner?: User) {
        const { name, topic, description, photo, customFields } =
            createCollectionDto;

        const newCustomFields = await Promise.all(
            customFields.map(async ({ name, type }) => {
                const newCustomField = this.customFieldRepo.create({
                    name,
                    type,
                    value: '',
                });
                return await this.customFieldRepo.save(newCustomField);
            }),
        );

        let photoPath = null;
        if (photo && isBase64Image(photo)) {
            const base64Content = photo.split(',')[1];
            const photoBuffer = Buffer.from(base64Content, 'base64');

            const timestamp = Date.now();
            const fileName = `image_${timestamp}.png`;
            const filePath = `uploads/${fileName}`;
            fs.writeFileSync(filePath, photoBuffer);
            photoPath = '/' + filePath;
        }

        const newCollection = this.collectionRepo.create({
            name,
            owner,
            topic,
            description,
            photo: photoPath,
            custom_fields: newCustomFields,
        });

        return await this.collectionRepo.save(newCollection);
    }

    async findAll(query: PaginationDto): Promise<PaginationResponse> {
        const total = await this.collectionRepo.count({
            where: {
                [query.columnName]:
                    query.columnName === 'id'
                        ? Number(query.q) || null
                        : Like(`%${query.q}%`),
            },
        });
        const result = await this.collectionRepo.find({
            where: {
                [query.columnName]:
                    query.columnName === 'id'
                        ? Number(query.q) || null
                        : Like(`%${query.q}%`),
            },
            relations: {
                owner: true,
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

    async findCollectionsByUserId(id: number, query?: PaginationDto) {
        const result = await this.collectionRepo.find({
            where: {
                owner: {
                    id,
                },
            },
            relations: {
                owner: true,
            },
            order: {
                created_at: 'DESC',
            },
            skip: (query?.limit || 10) * ((query?.page || 1) - 1),
            take: query?.limit || 10,
        });
        return {
            result,
            total: result.length,
            limit: Number(query?.limit || 10),
            page: Number(query?.page || 1),
        };
    }

    async findOne(id: number): Promise<Collection> {
        const collection = await this.collectionRepo.findOne({
            where: {
                id,
            },
            relations: {
                owner: true,
                items: {
                    custom_fields: true,
                    likes: {
                        owner: {},
                    },
                },
                custom_fields: true,
            },
            order: {
                items: {
                    custom_fields: {
                        id: 'ASC',
                    },
                },
            },
        });
        if (!collection) {
            throw new NotFoundException('Collection not found');
        }

        return collection;
    }

    async update(id: number, updateCollectionDto: UpdateCollectionDto) {
        const { name, description, photo, topic, customFields } =
            updateCollectionDto;
        const collection = await this.collectionRepo.findOne({
            where: {
                id,
            },
        });
        await Promise.all(
            customFields.map(async ({ id, name, type }) => {
                if (id) {
                    await this.customFieldRepo.update(id, { name, type });
                    return await this.customFieldRepo.findOneBy({ id });
                }
                const newCustomField = this.customFieldRepo.create({
                    name,
                    type,
                    collection,
                });
                return await this.customFieldRepo.save(newCustomField);
            }),
        );

        let photoPath = null;
        if (photo && isBase64Image(photo)) {
            const base64Content = photo.split(',')[1];
            const photoBuffer = Buffer.from(base64Content, 'base64');

            const timestamp = Date.now();
            const fileName = `image_${timestamp}.png`;
            const filePath = `uploads/${fileName}`;
            fs.writeFileSync(filePath, photoBuffer);
            photoPath = '/' + filePath;
        }
        collection.name = name;
        collection.description = description;
        collection.photo = photoPath;
        collection.topic = topic;
        return await this.collectionRepo.save(collection);
    }

    async remove(id: number): Promise<DeleteResult> {
        const deletedCollection = await this.collectionRepo.delete(id);
        return deletedCollection;
    }
}
