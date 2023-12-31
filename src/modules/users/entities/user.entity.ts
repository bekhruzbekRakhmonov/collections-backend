import { Collection } from 'src/modules/collections/entities/collection.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { CustomField } from 'src/modules/custom_fields/entities/custom_field.entity';
import { Item } from 'src/modules/items/entities/item.entity';
import { Like } from 'src/modules/likes/entities/like.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({
        type: 'enum',
        enum: ['active', 'blocked'],
        default: 'active',
    })
    status: 'active' | 'blocked';

    @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
    role: 'user' | 'admin';

    @OneToMany(() => Collection, (collection: Collection) => collection.owner)
    collections: Collection[];

    @OneToMany(() => Item, (item: Item) => item.owner)
    items: Item[];

    @OneToMany(() => CustomField, (custom_field: CustomField) => custom_field.owner)
    custom_fields: CustomField[];

    @OneToMany(() => Comment, (comment: Comment) => comment.owner)
    comments: Comment[];

    @OneToMany(() => Like, (like: Like) => like.owner)
    likes: Like[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
