import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,
  ) {}

  async create(dto: CreateTagDto) {
    const existsTag = await this.tagRepo.findOneBy({ name: dto.name });
    if (existsTag) throw new BadRequestException('this tag name is exist');
    const tag = this.tagRepo.create(dto);
    return this.tagRepo.save(tag);
  }

  findAll() {
    return this.tagRepo.find();
  }

  async findOne(id: number) {
    const tag = await this.tagRepo.findOneBy({ id });
    if (!tag) throw new NotFoundException('Not found this tag id');
    return tag;
  }

  async update(id: number, dto: UpdateTagDto) {
    const tag = await this.findOne(id);
    if (!tag) throw new NotFoundException(`Not found this tag ID: ${id}`);
    const updated = Object.assign(tag, dto);
    return this.tagRepo.save(updated);
  }

  async remove(id: number) {
    const tag = await this.findOne(id);
    if (!tag) throw new NotFoundException(`Not found this tag ID: ${id}`);
    return this.tagRepo.remove(tag);
  }
}
