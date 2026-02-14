import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/entities/category.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  no: string;

  @ApiProperty()
  @Column({ unique: true })
  name: string;

  @ApiProperty()
  @Column()
  stock: number;

  @ManyToOne(() => Category, (category) => category.books, {
    onDelete: 'SET NULL',
  })
  category: Category;

  @ManyToMany(() => Tag, (tag) => tag.books, { cascade: true })
  @JoinTable()
  tags: Tag[];
}
