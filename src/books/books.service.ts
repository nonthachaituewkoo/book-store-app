import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Tag } from 'src/tags/entities/tag.entity';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    @InjectRepository(Book)
    private bookRepo: Repository<Book>,

    @InjectRepository(Category)
    private cateRepo: Repository<Category>,

    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,
  ) {}

  async create(dto: CreateBookDto) {
    const existsNo = await this.bookRepo.findOneBy({
      no: dto.no,
    });
    if (existsNo) throw new ConflictException('รหัสหนังสือมีอยู่แล้ว');

    const existsName = await this.bookRepo.findOneBy({
      name: dto.name,
    });
    if (existsName) throw new ConflictException('ชื่อหนังสือมีอยู่แล้ว');

    if (dto.categoryId) {
      const category = await this.cateRepo.findOneBy({
        id: dto.categoryId,
      });
      if (!category) {
        throw new NotFoundException('ไม่พบหมวดหมู่นี้');
      }
    }

    if (dto.tagIds && dto.tagIds.length > 0) {
      const existsTags = await this.tagRepo.findBy({
        id: In(dto.tagIds),
      });
      if (existsTags.length !== dto.tagIds.length) {
        throw new BadRequestException('มีบาง Tag ID ที่ระบุมาไม่มีอยู่ในระบบ');
      }
    }

    const book = this.bookRepo.create({
      ...dto,
      category: { id: dto.categoryId },
      tags: dto.tagIds ? dto.tagIds.map((id) => ({ id })) : [],
    });
    return await this.bookRepo.save(book);
  }

  findAll() {
    this.logger.log('มีการเรียกดูหนังสือทั้งหมด');
    return this.bookRepo.find({
      relations: ['category', 'tags'],
    });
  }

  async findOne(id: number) {
    const book = await this.bookRepo.findOne({
      where: { id },
      relations: ['category', 'tags'],
    });
    if (!book) throw new NotFoundException(`Not found this book with ID ${id}`);
    return book;
  }

  async update(id: number, dto: UpdateBookDto) {
    this.logger.log('update หนังสือ');
    const book = await this.bookRepo.findOne({
      where: { id },
      relations: ['category', 'tags'],
    });
    if (!book) throw new NotFoundException('ไม่พบหนังสือเล่มนี้');

    const { tagIds, categoryId, ...updateData } = dto;

    if (categoryId !== undefined) {
      book.category = categoryId ? ({ id: categoryId } as any) : null;
    }
    if (tagIds !== undefined) {
      book.tags =
        tagIds.length > 0 ? (tagIds.map((id) => ({ id })) as any) : [];
    }

    if (categoryId) {
      const category = await this.cateRepo.findOneBy({
        id: categoryId,
      });
      if (!category) {
        throw new NotFoundException('ไม่พบหมวดหมู่นี้');
      }
    }

    if (tagIds && tagIds.length > 0) {
      const count = await this.tagRepo.countBy({ id: In(tagIds) });
      if (count !== tagIds.length) {
        throw new BadRequestException(`บาง Tag ID ไม่มีอยู่ในระบบ`);
      }
    }

    Object.assign(book, updateData);

    return await this.bookRepo.save(book);
  }

  async remove(id: number) {
    this.logger.warn('delete หนังสือ');
    const book = await this.findOne(id);
    if (!book)
      throw new NotFoundException(`Not found this book with ID: ${id}`);
    await this.bookRepo.remove(book);
    return { message: 'Data Deleted!', deletedData: book };
  }
}
