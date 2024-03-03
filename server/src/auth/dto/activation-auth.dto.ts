import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  activationToken: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @ApiProperty()
  activationCode: string;
}
