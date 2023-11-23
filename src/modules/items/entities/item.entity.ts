import {
    Column,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Like } from 'src/modules/likes/entities/like.entity';
import { Collection } from 'src/modules/collections/entities/collection.entity';
import { CustomField } from 'src/modules/custom_fields/entities/custom_field.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('items')
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ fulltext: true })
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Index({ fulltext: true })
    @Column({ type: 'varchar', length: 255, nullable: true })
    tags: string;

    @ManyToOne(() => User, (user: User) => user.items, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    owner: User;

    @OneToMany(() => Comment, (comment: Comment) => comment.item)
    comments: Comment[];

    @OneToMany(() => Like, (like: Like) => like.item)
    likes: Like[];

    @ManyToOne(() => Collection, (collection: Collection) => collection.items, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    collection: Collection;

    @OneToMany(() => CustomField, (field: CustomField) => field.item)
    custom_fields: CustomField[];
}
