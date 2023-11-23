import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { Item } from '../items/entities/item.entity';
import { PaginationResponse } from 'src/common/pagination/pagination-response.dto';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>,
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
    ) {}

    async create(
        createCommentDto: CreateCommentDto,
        owner: User,
    ): Promise<Comment> {
        const {item_id, content} = createCommentDto;
        const item = await this.itemRepo.findOneBy({
            id: Number(item_id),
        });
        const comment = new Comment();
        comment.content = content;
        comment.owner = owner;
        comment.item = item;
        return await this.commentRepo.save(comment);
    }

    async findAll(query?: PaginationDto): Promise<PaginationResponse> {
        const total = await this.commentRepo.count();
        const result = await this.commentRepo
            .createQueryBuilder('comment')
            .leftJoin('comment.owner', 'owner', 'owner.id = comment.ownerId')
            .select('owner.name', 'owner')
            .addSelect('owner.id', 'owner_id')
            .addSelect('comment.id', 'id')
            .addSelect('comment.content', 'content')
            .addSelect('comment.created_at', 'created_at')
            .addSelect('comment.updated_at', 'updated_at')
            .orderBy(
                `comment.${query?.orderBy || 'id'}`,
                (query?.order?.toUpperCase() as any) || 'ASC',
            )
            .skip((query?.limit || 10) * ((query?.page || 1) - 1))
            .take(query?.limit || 10)
            .getRawMany();


        return {
            result,
            total,
            limit: Number(query?.limit || 10),
            page: Number(query?.page || 1),
        };
    }

    async findOne(id: number): Promise<Comment | undefined> {
        return await this.commentRepo.findOneBy({ id });
    }

    async update(
        id: number,
        updateCommentDto: UpdateCommentDto,
    ): Promise<Comment | undefined> {
        const comment = await this.commentRepo.findOneBy({ id });

        if (!comment) {
            return undefined;
        }

        comment.content = updateCommentDto.content;

        return await this.commentRepo.save(comment);
    }

    async remove(id: number): Promise<void> {
        await this.commentRepo.delete(id);
    }
}
