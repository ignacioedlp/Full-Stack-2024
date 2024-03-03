import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  Permission: {
    action: string;
    subject: string;
    conditions?: string;
  }[];
}
