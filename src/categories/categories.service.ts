import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const existsName = await this.repo.findOneBy({
      name: dto.name,
    });
    if (existsName)
      throw new BadRequestException('this category name is exist');
    const category = this.repo.create(dto);
    return this.repo.save(category);
  }

  findAll() {
    this.logger.log('เรียกดู categories!');
    return this.repo.find();
  }

  async findOne(id: number) {
    this.logger.log(`เรียกดู category ด้วย ID: ${id}`);
    const category = await this.repo.findOneBy({ id });
    if (!category) throw new NotFoundException('Not found this category');
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    const updated = Object.assign(category, dto);
    this.logger.log(`อัปเดต Category ใน ID: ${id}`);
    return this.repo.save(updated);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('Not found this category!');
    return this.repo.remove(category);
  }
}
