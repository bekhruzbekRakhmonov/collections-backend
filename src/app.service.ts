import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './modules/items/entities/item.entity';
import { User } from './modules/users/entities/user.entity';
import { Collection } from './modules/collections/entities/collection.entity';
import { Comment } from './modules/comments/entities/comment.entity';
import { PaginationDto } from './common/pagination/pagination.dto';

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Collection)
        private readonly collectionRepo: Repository<Collection>,
        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>,
    ) {}

    async searchTags(tag: string) {
        const tagsResults = await this.itemRepo
            .createQueryBuilder('item')
            .select('item.tags')
            .where('item.tags ILIKE :tag', { tag: `%${tag}%` })
            .limit(5)
            .getRawMany();

        if (tagsResults) {
            const similarTags = tagsResults.map(({ item_tags }) => item_tags);

            // Use Set to ensure uniqueness
            const uniqueTagsSet = new Set(similarTags.join(',').split(','));

            // Convert the Set back to an array
            const uniqueTagsArray = Array.from(uniqueTagsSet);

            return uniqueTagsArray;
        }

        return [];
    }

    async search(query: PaginationDto) {
        const page = query.page || 1;
        const limit = query.limit || 10;

        const formattedQuery = query.q.trim().replace(/ /g, ' & ');

        const itemResults = await this.itemRepo
            .createQueryBuilder()
            .where(
                `to_tsvector('simple', name || ' ' || tags) @@ to_tsquery('simple', :query)`,
                { query: `${formattedQuery}:*` },
            )
            .select(`'/show-item/' || '' || id as link`)
            .addSelect('name')
            .addSelect('tags')
            .skip((page - 1) * limit)
            .take(limit)
            .getRawMany();

        const userResults = await this.userRepo
            .createQueryBuilder()
            .where(
                `to_tsvector('simple', name || ' ' || email) @@ to_tsquery('simple', :query)`,
                { query: `${formattedQuery}:*` },
            )
            .select(`'/users/' || '' || id as link`)
            .addSelect('name')
            .addSelect('email')
            .skip((page - 1) * limit)
            .take(limit)
            .getRawMany();

        const collectionResults = await this.collectionRepo
            .createQueryBuilder()
            .where(
                `to_tsvector('simple', name || ' ' || description || ' ' || topic) @@ to_tsquery('simple', :query)`,
                { query: `${formattedQuery}:*` },
            )
            .select(`'/show-collection/' || '' || id as link`)
            .addSelect('name')
            .addSelect('description')
            .addSelect('topic')
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();

        const commentResults = await this.commentRepo
            .createQueryBuilder('comment')
            .leftJoinAndSelect(Item, 'item', 'item.id = comment.itemId')
            .leftJoinAndSelect(
                Collection,
                'collection',
                'collection.id = item.collectionId',
            )
            .select(`'/show-item/' || '' || item.id as link`)
            .addSelect('comment.id', 'id')
            .addSelect('comment.content', 'name')
            .addSelect('item.id', 'item_id')
            .addSelect('collection.id', 'collection_id')
            .where(
                `to_tsvector('simple', content) @@ to_tsquery('simple', :query)`,
                { query: `${formattedQuery}:*` },
            )
            .skip((page - 1) * limit)
            .take(limit)
            .getRawMany();

        return {
            userResults,
            collectionResults,
            itemResults,
            commentResults,
        };
    }
}