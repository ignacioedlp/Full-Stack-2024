import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { checkAbilites } from '../common/decorators/abilities.decorator';
import { AbilitiesGuard } from '../common/guards/abilities.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @checkAbilites({ action: 'read', subject: 'User' })
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @checkAbilites({ action: 'read', subject: 'User' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @checkAbilites({ action: 'update', subject: 'User' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @checkAbilites({ action: 'update', subject: 'User' })
  remove(@Param('id') id: string, @Body() updateUserDto: { blocked: boolean }) {
    return this.usersService.banUser(+id, updateUserDto);
  }
}
