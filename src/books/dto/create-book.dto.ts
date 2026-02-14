import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: '1234' })
  @IsString({ message: 'รหัสหนังสือต้องเป็นข้อความ' })
  @IsNotEmpty({ message: 'กรุณากรอกรหัสหนังสือ' })
  no: string;

  @ApiProperty({ example: 'Math' })
  @IsString({ message: 'ชื่อหนังสือต้องเป็นข้อความ' })
  @IsNotEmpty({ message: 'กรุณาใสชื่อหนังสือ' })
  name: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0, { message: 'จำนวนสินค้าในสต๊อก จะไม่ติดลบ' })
  stock: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ example: [1] })
  @IsArray()
  @IsOptional()
  tagIds?: number[];
}
