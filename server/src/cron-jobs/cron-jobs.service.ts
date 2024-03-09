import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class CronJobsServices {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  @Cron('* 12 * * *')
  async dailyGoodMorning() {
    const cronJob = await this.prisma.cronJob.create({
      data: {
        name: 'Daily Good Morning',
        status: 'In progress',
      },
    });

    const usersWithToken = await this.prisma.user.findMany({
      select: {
        notification_token: true,
      },
      where: {
        notification_token: {
          not: null,
        },
      },
    });

    this.notifications.create({
      title: 'Good Morning',
      description: 'Have a great day!',
      tokens: usersWithToken.map((user) => user.notification_token),
    });

    await this.prisma.cronJob.update({
      where: {
        id: cronJob.id,
      },
      data: {
        status: 'Completed',
      },
    });
  }

  //TODO:
  //@Cron('0 12 * * *')
  //async weeklyEmail() {
  //Aca obtendriamos las personas con el weeklyEmail enabled (crearlo)
  // Y enviariamos el email
  // Y tambien una notificacion de que su email semanal fue enviado solo a los que tengan token
  //}
}
