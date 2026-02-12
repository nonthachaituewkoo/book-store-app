import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    @InjectRepository(Book)
    private bookRepo: Repository<Book>,

    @InjectRepository(Category)
    private cateRepo: Repository<Category>,
  ) {}

  async create(dto: CreateBookDto) {
    const existsNo = await this.bookRepo.findOneBy({
      no: dto.no,
    });
    if (existsNo) throw new BadRequestException('รหัสหนังสือมีอยู่แล้ว');

    const existsName = await this.bookRepo.findOneBy({
      name: dto.name,
    });
    if (existsName) throw new BadRequestException('ชื่อหนังสือมีอยู่แล้ว');

    if (dto.categoryId) {
      const category = await this.cateRepo.findOneBy({
        id: dto.categoryId,
      });
      if (!category) {
        throw new NotFoundException('ไม่พบหมวดหมู่นี้');
      }
    }

    const book = this.bookRepo.create({
      ...dto,
      category: { id: dto.categoryId },
    });
    return await this.bookRepo.save(book);
  }

  findAll() {
    this.logger.log('มีการเรียกดูหนังสือทั้งหมด');
    return this.bookRepo.find({
      relations: ['category'],
    });
  }

  async findOne(id: number) {
    const book = await this.bookRepo.findOneBy({ id });
    if (!book) throw new NotFoundException(`Not found this book with ID ${id}`);
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    this.logger.log('กำลัง update หนังสือ');
    const book = await this.findOne(id);
    const updated = Object.assign(book, updateBookDto);
    return this.bookRepo.save(updated);
  }

  async remove(id: number) {
    this.logger.warn('กำลัง delete หนังสือ');
    const book = await this.findOne(id);
    if (!book)
      throw new NotFoundException(`Not found this book with ID: ${id}`);
    await this.bookRepo.remove(book);
    return { message: 'Data Deleted!', deletedData: book };
  }
}
