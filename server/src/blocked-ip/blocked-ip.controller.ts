import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BlockedIpService } from './blocked-ip.service';
import { checkAbilites } from '../common/decorators/abilities.decorator';
import { AbilitiesGuard } from '../common/guards/abilities.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateBlockedIpDto } from './dto/create-blocked-ip.dto';

@Controller('blocked_ip')
export class BlockedIpController {
  constructor(private readonly blockedIpService: BlockedIpService) {}

  @Post()
  @checkAbilites({ action: 'create', subject: 'BlockedIp' })
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  create(@Body() createBlockedIpDto: CreateBlockedIpDto) {
    return this.blockedIpService.blockIp(
      createBlockedIpDto.ip,
      createBlockedIpDto.reason,
    );
  }

  @Get()
  @checkAbilites({ action: 'read', subject: 'BlockedIp' })
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  findAll() {
    return this.blockedIpService.findAll();
  }

  @Get(':id')
  @checkAbilites({ action: 'read', subject: 'BlockedIp' })
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  findOne(@Param('id') id: string) {
    return this.blockedIpService.findOne(id);
  }

  @Delete(':id')
  @checkAbilites({ action: 'delete', subject: 'BlockedIp' })
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  remove(@Param('id') id: string) {
    return this.blockedIpService.remove(id);
  }
}
