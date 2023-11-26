import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';
import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LikesService {
    constructor(
        @InjectRepository(Like)
        private readonly likeRepo: Repository<Like>,
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
    ) {}

    async likeOrUnlike(dto: CreateLikeDto, user: User): Promise<Item> {
        const { item_id } = dto;
        const item = await this.itemRepo.findOneBy({ id: item_id });

        const like = await this.likeRepo
            .createQueryBuilder('like')
            .leftJoin('like.owner', 'owner', 'owner.id = like.ownerId')
            .leftJoin('like.item', 'item', 'item.id = like.itemId')
            .where('item.id = :item_id', { item_id })
            .andWhere('owner.id = :user_id', { user_id: user.id })
            .select([
                'like.id as id',
                'owner.id as ownerId',
                'item.id as itemId',
            ])
            .getRawOne();


        if (!item) {
            throw new NotFoundException('Item not found');
        }

        if (!like) {
            const newLike = this.likeRepo.create({ item, owner: user });
            await this.likeRepo.save(newLike);
        } else {
            await this.likeRepo.remove(like);
        }
        return await this.itemRepo.findOne({
            where: {
                id: item.id,
            },
            relations: {
                custom_fields: true,
                likes: {
                    owner: true,
                },
            },
            order: {
                custom_fields: {
                    id: 'ASC',
                },
            },
        });
    }

    async findAll(): Promise<Like[]> {
        const likes = await this.likeRepo.find({
            order: {
                id: 'DESC',
            },
        });
        return likes;
    }

    async findOne(id: number) {
        const like = await this.likeRepo.findOneBy({ id });
        return like;
    }
}
