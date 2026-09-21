import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Aarav Sharma' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  fullName: string;

  @ApiProperty({ example: 'engineer@thermoshelter.drdo.in' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecureP@ssw0rd', minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message:
      'Password must include uppercase, lowercase, number, and special character',
  })
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'engineer@thermoshelter.drdo.in' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecureP@ssw0rd' })
  @IsString()
  password: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
