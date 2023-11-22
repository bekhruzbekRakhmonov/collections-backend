import { Collection } from 'src/modules/collections/entities/collection.entity';
import { Item } from 'src/modules/items/entities/item.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('custom_fields')
export class CustomField {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ fulltext: true })
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Index({ fulltext: true })
    @Column({ type: 'varchar', nullable: true })
    value: string;

    @Column({
        type: 'enum',
        enum: ['string', 'integer', 'multiline', 'boolean', 'date'],
    })
    type: 'string' | 'integer' | 'multiline' | 'boolean' | 'date';

    @ManyToOne(
        () => Collection,
        (collection: Collection) => collection.custom_fields,
        {
            onDelete: 'CASCADE',
            cascade: true,
        },
    )
    collection: Collection;

    @ManyToOne(() => Item, (item: Item) => item.custom_fields, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    item: Item;
}
