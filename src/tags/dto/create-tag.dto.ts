import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateTagDto {
  @ApiProperty({ example: 'Math' })
  @IsString()
  @IsNotEmpty()
  @Column({ unique: true })
  name: string;
}
