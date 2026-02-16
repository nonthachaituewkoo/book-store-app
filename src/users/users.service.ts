import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async register(dto: CreateUserDto) {
    const { username, password } = dto;

    const exists = await this.repo.findOneBy({ username });
    if (exists) throw new ConflictException('Username นี้ถูกใช้งานแล้ว');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.repo.create({
      username,
      password: hashedPassword,
    });

    const savedUser = await this.repo.save(user);

    return savedUser;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repo.findOne({
      where: { username },
      select: ['username', 'password'],
    });
  }
}
