import { Module } from '@nestjs/common';
import { BlockedIpService } from './blocked-ip.service';
import { BlockedIpController } from './blocked-ip.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  controllers: [BlockedIpController],
  providers: [BlockedIpService],
  imports: [PrismaModule],
})
export class BlockedIpModule {}
