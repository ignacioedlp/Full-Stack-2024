import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { checkAbilites } from '../common/decorators/abilities.decorator';
import { AbilitiesGuard } from '../common/guards/abilities.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Post()
  @checkAbilites({ action: 'create', subject: 'Role' })
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @checkAbilites({ action: 'read', subject: 'Role' })
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @checkAbilites({ action: 'read', subject: 'Role' })
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @checkAbilites({ action: 'update', subject: 'Role' })
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @checkAbilites({ action: 'delete', subject: 'Role' })
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
