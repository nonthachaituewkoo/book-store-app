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

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    @InjectRepository(Book)
    private bookRepo: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const existsNo = await this.bookRepo.findOneBy({
      no: createBookDto.no,
    });
    if (existsNo) throw new BadRequestException('รหัสหนังสือมีอยู่แล้ว');
    const existsName = await this.bookRepo.findOneBy({
      name: createBookDto.name,
    });
    if (existsName) throw new BadRequestException('ชื่อหนังสือมีอยู่แล้ว');

    return this.bookRepo.save(this.bookRepo.create(createBookDto));
  }

  findAll() {
    this.logger.log('มีการเรียกดูหนังสือทั้งหมด');
    return this.bookRepo.find();
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
