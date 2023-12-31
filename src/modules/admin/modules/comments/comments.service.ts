import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PaginationResponse } from 'src/common/pagination/pagination-response.dto';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { CreateCommentDto } from 'src/modules/comments/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/modules/comments/dto/update-comment.dto';
import { Item } from 'src/modules/items/entities/item.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class AdminCommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>,
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
    ) {}

    async create(
        createCommentDto: CreateCommentDto,
        owner?: User,
    ): Promise<Comment> {
        const { item_id, content } = createCommentDto;
        const item = await this.itemRepo.findOneBy({
            id: Number(item_id),
        });
        const comment = new Comment();
        comment.content = content;
        comment.owner = owner;
        comment.item = item;
        return await this.commentRepo.save(comment);
    }

    async findAll(query: PaginationDto): Promise<PaginationResponse> {
        const total = await this.commentRepo.count({
            where: {
                [query.columnName]:
                    query.columnName === 'id'
                        ? query.q || null
                        : Like(`%${query.q}%`),
            },
        });
        const result = await this.commentRepo
            .createQueryBuilder('comment')
            .leftJoin('comment.owner', 'owner', 'owner.id = comment.ownerId')
            .select('owner.name', 'owner')
            .addSelect('owner.id', 'owner_id')
            .addSelect('comment.id', 'id')
            .addSelect('comment.content', 'content')
            .addSelect('comment.created_at', 'created_at')
            .addSelect('comment.updated_at', 'updated_at')
            .where(`comment.${query.columnName} LIKE :search`, {
                search:
                    query.columnName === 'id'
                        ? query.q || null
                        : `%${query.q}%`,
            })
            .orderBy(
                `comment.${query?.orderBy || 'id'}`,
                (query?.order?.toUpperCase() as any) || 'ASC',
            )
            .offset((query?.limit || 10) * ((query?.page || 1) - 1))
            .limit(query?.limit || 10)
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
