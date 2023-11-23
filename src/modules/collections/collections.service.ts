import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Item } from '../items/entities/item.entity';
import { CustomField } from '../custom_fields/entities/custom_field.entity';
import { PaginationResponse } from 'src/common/pagination/pagination-response.dto';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import * as fs from 'node:fs';
import { User } from '../users/entities/user.entity';
import { CreateCustomFieldDto } from '../custom_fields/dto/create-custom_field.dto';
import { isBase64 } from 'class-validator';

@Injectable()
export class CollectionsService {
    constructor(
        @InjectRepository(Collection)
        private readonly collectionRepo: Repository<Collection>,
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
        @InjectRepository(CustomField)
        private readonly customFieldRepo: Repository<CustomField>,
    ) {}

    async create(createCollectionDto: CreateCollectionDto, owner: User) {
        const {
            name,
            topic,
            description,
            photo,
            customFields,
        } = createCollectionDto;


        const newCustomFields = await Promise.all(customFields.map(async ({name, type}) => {
            const newCustomField = this.customFieldRepo.create({name, type, value: ""});
            return await this.customFieldRepo.save(newCustomField);
        }));

        let photoPath = null;
        if (photo) {
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
            custom_fields: newCustomFields
        });

        return await this.collectionRepo.save(newCollection);
    }

    async findAllForAdmin(query?: PaginationDto): Promise<PaginationResponse> {
        const total = await this.collectionRepo.count();
        const result = await this.collectionRepo.find({
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


    async findAll(query?: PaginationDto): Promise<PaginationResponse> {
        const result = await this.collectionRepo
            .createQueryBuilder('collection')
            .leftJoinAndSelect('collection.owner', 'owner')
            .leftJoin('collection.items', 'items')
            .addSelect('COUNT(items.id) as item_count')
            .groupBy('collection.id, owner.id')
            .orderBy('item_count', 'DESC')
            .addOrderBy('collection.created_at', 'DESC')
            .offset((query?.limit || 10) * ((query?.page || 1) - 1))
            .limit(query?.limit || 10)
            .getMany();

        return {
            result,
            total: result.length,
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
                        owner: {
                            
                        },
                    },
                },
                custom_fields: true,
            },
            order: {
                items: {
                    custom_fields: {
                        id: "ASC"
                    }
                }
            }
        });
        if (!collection) {
            throw new NotFoundException('Collection not found');
        }

        return collection;
    }

    async updateItems(items: Partial<Item>[], itemCustomFields: CreateCustomFieldDto[]) {
        items.map(async ({id, name, tags}) => {
            const item = await this.itemRepo.findOne({
                where: {
                    id
                }
            })

            if (item) {
                item.name = name;
                item.tags = tags;
                // item.custom_fields.map();
                itemCustomFields.map((customField, index) => {
                    if (customField) {}
                })
                if (item.custom_fields.length < itemCustomFields.length) {
                    
                } else if (item.custom_fields.length > itemCustomFields.length) {

                }
            }
        })
    }

    async update(
        id: number,
        updateCollectionDto: UpdateCollectionDto,
    ) {
        const {name, description, photo, topic, customFields} = updateCollectionDto;
        const collection = await this.collectionRepo.findOne({
            where: {
                id
            }
        })
        await Promise.all(customFields.map(async ({ id, name, type }) => {
            if (id) {
                await this.customFieldRepo.update(id, {name, type})
                return await this.customFieldRepo.findOneBy({id});
            }
            const newCustomField = this.customFieldRepo.create({
                name,
                type,
                collection,
            })
            return await this.customFieldRepo.save(newCustomField);
        }))

        let photoPath = null;
        if (photo && isBase64(photoPath)) {
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
        collection.photo = photo;
        collection.topic = topic;
        return await this.collectionRepo.save(collection)
    }

    async remove(id: number): Promise<DeleteResult> {
        const deletedCollection = await this.collectionRepo.delete(id);
        return deletedCollection;
    }
}