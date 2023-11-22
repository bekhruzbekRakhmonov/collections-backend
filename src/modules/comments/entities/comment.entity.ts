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

    @ManyToOne(() => Item, (item: Item) => item.comments)
    item: Item;

    @ManyToOne(() => User, (user: User) => user)
    owner: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
