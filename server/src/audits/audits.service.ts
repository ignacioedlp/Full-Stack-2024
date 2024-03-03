import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AuditsService {
  constructor(private readonly prisma: PrismaService) {}

  async logAudit(auditData): Promise<void> {
    await this.prisma.audit.create({ data: auditData });
  }

  async findAll() {
    return this.prisma.audit.findMany();
  }
}
