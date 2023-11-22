// ownership.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from 'src/modules/collections/entities/collection.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { CustomField } from 'src/modules/custom_fields/entities/custom_field.entity';
import { Item } from 'src/modules/items/entities/item.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class OwnershipGuard implements CanActivate {
    private entityRepositories: Map<string, Repository<any>>;

    constructor(
        @InjectRepository(Collection)
        private readonly collectionRepo: Repository<Collection>,
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>,
        @InjectRepository(CustomField)
        private readonly customFieldRepo: Repository<CustomField>,
    ) {
        // Populate the entity repositories map
        this.entityRepositories = new Map<string, Repository<any>>([
            [Collection.name.toLowerCase(), this.collectionRepo],
            [Item.name.toLowerCase(), this.itemRepo],
            [User.name.toLowerCase(), this.userRepo],
            [Comment.name.toLowerCase(), this.commentRepo],
            [CustomField.name.toLowerCase(), this.customFieldRepo],
        ]);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { user, params } = context.switchToHttp().getRequest();
        const resourceName = context.getClass().name.toLowerCase(); // Infer entity type from the controller name

        // Fetch the resource from the database
        const resource = await this.fetchResource(resourceName, +params.id);

        // Check ownership
        if (resource && user && this.isUserOwner(user, resource)) {
            return true;
        }

        throw new ForbiddenException(
            `You don't have permission to perform this action`,
        );
    }

    private async fetchResource(
        resourceName: string,
        resourceId: number,
    ): Promise<any> {
        const repository = this.entityRepositories.get(resourceName);

        if (!repository) {
            throw new ForbiddenException(`Invalid entity type`);
        }

        return await repository.findOneBy({id:resourceId});
    }

    private isUserOwner(user: any, resource: any): boolean {
        return user.id === resource.owner.id;
    }
}
