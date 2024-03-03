import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty()
  passwordConfirmation: string;

  @IsNotEmpty()
  @IsString()
  activationToken: string;
}
