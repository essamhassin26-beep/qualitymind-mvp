import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@nissan.com.eg' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Admin@123' })
  @IsString()
  password: string;
}
