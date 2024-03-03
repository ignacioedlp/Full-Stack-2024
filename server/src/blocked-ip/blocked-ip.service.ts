import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class BlockedIpService {
  constructor(private readonly prisma: PrismaService) {}

  async blockIp(ip: string, reason: string) {
    return this.prisma.blockedIp.create({
      data: {
        ip,
        reason,
      },
    });
  }

  async findBlockedIp(ip: string) {
    return this.prisma.blockedIp.findFirst({
      where: {
        ip,
      },
    });
  }

  async findAll() {
    return this.prisma.blockedIp.findMany();
  }

  async findOne(id: string) {
    return this.prisma.blockedIp.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.blockedIp.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
