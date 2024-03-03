import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  findOne(id) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateProfileDto) {
    const usernameExist = await this.prisma.user.findFirst({
      where: {
        username: updateUserDto.username,
      },
    });

    if (usernameExist.id !== Number(id)) {
      throw new BadRequestException('Username already exist');
    }

    const emailExist = await this.prisma.user.findFirst({
      where: {
        email: updateUserDto.email,
      },
    });

    if (emailExist.id !== Number(id)) {
      throw new BadRequestException('Email already exist');
    }

    return this.prisma.user.update({
      where: {
        id: Number(id),
      },
      data: updateUserDto,
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

  remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
  }

  setNotificationToken(id: string, token: string) {
    return this.prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        notification_token: token,
      },
    });
  }
}
