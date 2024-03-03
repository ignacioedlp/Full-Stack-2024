import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlockedIpDto {
  @IsNotEmpty()
  @IsString()
  ip: string;

  @IsNotEmpty()
  @IsString()
  reason: string;
}
