import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Item } from 'src/modules/items/entities/item.entity';
import { CustomField } from 'src/modules/custom_fields/entities/custom_field.entity';

@Entity('collections')
export class Collection {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ fulltext: true })
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Index({ fulltext: true })
    @Column({ type: 'varchar', length: 512, nullable: true })
    description: string;

    @Index({ fulltext: true })
    @Column({ type: 'varchar', length: 255 })
    topic: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    photo: string;

    @ManyToOne(() => User, (user: User) => user.collections, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    owner: User;

    @OneToMany(() => Item, (item: Item) => item.collection)
    items: Item[];

    @OneToMany(() => CustomField, (field: CustomField) => field.collection)
    custom_fields: CustomField[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
