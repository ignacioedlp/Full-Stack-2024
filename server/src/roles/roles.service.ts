import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const createdRole = await this.prisma.role.create({
      data: {
        name: createRoleDto.name,
      },
    });

    const permissions = createRoleDto.Permission.map((permission) => {
      return {
        action: permission.action,
        subject: permission.subject,
        role_id: createdRole.id,
        conditions: permission.conditions,
      };
    });

    await this.prisma.permission.createMany({
      data: permissions,
    });
  }

  findAll() {
    return this.prisma.role.findMany({
      include: {
        Permission: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.role.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        Permission: true,
      },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    await this.prisma.role.update({
      where: {
        id: Number(id),
      },
      data: {
        name: updateRoleDto.name,
      },
    });

    const permissions = updateRoleDto.Permission.map((permission) => {
      return {
        action: permission.action,
        subject: permission.subject,
        role_id: Number(id),
        conditions: permission.conditions,
      };
    });

    await this.prisma.permission.deleteMany({
      where: {
        role_id: Number(id),
      },
    });

    await this.prisma.permission.createMany({
      data: permissions,
    });
  }

  async remove(id: string) {
    await this.prisma.permission.deleteMany({
      where: {
        role_id: Number(id),
      },
    });

    return this.prisma.role.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
