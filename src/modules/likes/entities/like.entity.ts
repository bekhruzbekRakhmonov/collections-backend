import { Item } from 'src/modules/items/entities/item.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('likes')
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user: User) => user.likes, {
        onDelete: 'SET NULL',
    })
    owner: User;

    @ManyToOne(() => Item, (item: Item) => item.likes, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    item: Item;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
