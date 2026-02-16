import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ example: 'user' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'user' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
