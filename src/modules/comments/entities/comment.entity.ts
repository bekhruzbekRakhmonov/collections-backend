import { Item } from "src/modules/items/entities/item.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ fulltext: true })
    @Column({ type: 'varchar', length: 512 })
    content: string;

    @ManyToOne(() => Item, (item: Item) => item.comments, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    item: Item;

    @ManyToOne(() => User, (user: User) => user, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    owner: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
