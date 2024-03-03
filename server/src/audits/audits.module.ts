import { Module } from '@nestjs/common';
import { AuditsService } from './audits.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { AuditsController } from './audits.controller';

@Module({
  providers: [AuditsService, JwtService],
  imports: [PrismaModule],
  controllers: [AuditsController],
})
export class AuditsModule {}
