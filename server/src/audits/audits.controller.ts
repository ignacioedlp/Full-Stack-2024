import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuditsService } from './audits.service';
import { checkAbilites } from '../common/decorators/abilities.decorator';
import { AbilitiesGuard } from '../common/guards/abilities.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('audit_trails')
export class AuditsController {
  constructor(private readonly auditService: AuditsService) {}

  @Get()
  @checkAbilites({ action: 'read', subject: 'Audits' })
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  findAll() {
    return this.auditService.findAll();
  }
}
