import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create() {
    return 'This action adds a new user';
  }

  findAll() {
    return this.prisma.user.findMany({
      include: { role: { select: { name: true } } },
    });
  }

  findOne(id) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: { role: { select: { name: true } } },
    });
  }

  async update(
    id: number,
    { lastname, username, email, name, role_id }: UpdateUserDto,
  ) {
    const usernameExist = await this.prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (usernameExist.id !== Number(id)) {
      throw new BadRequestException('Username already exist');
    }

    const emailExist = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (emailExist.id !== Number(id)) {
      throw new BadRequestException('Email already exist');
    }
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        lastname,
        username,
        email,
        name,
        role: {
          connect: {
            id: Number(role_id),
          },
        },
      },
    });
  }

  updateUserAvatar(id: string, avatar: string) {
    return this.prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        avatar: avatar,
      },
    });
  }

  banUser(id: number, { blocked }: { blocked: boolean }) {
    return this.prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        blocked,
      },
    });
  }
}
