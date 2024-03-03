import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/utils/logger';
import { EmailModule } from './common/email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { ProfileModule } from './profile/profile.module';
import { AuditsMiddleware } from './audits/audits.middleware';
import { AuditsService } from './audits/audits.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { IpBlockMiddleware } from './blocked-ip/ip-block.middleware';
import { BlockedIpService } from './blocked-ip/blocked-ip.service';
import { BlockedIpModule } from './blocked-ip/blocked-ip.module';
import { AuditsModule } from './audits/audits.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobsServices } from './cron-jobs/cron-jobs.service';
import { NotificationsService } from './notifications/notifications.service';

@Module({
  imports: [
    TasksModule,
    AuthModule,
    UsersModule,
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RolesModule,
    ProfileModule,
    PrismaModule,
    BlockedIpModule,
    AuditsModule,
    NotificationsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [
    ConfigService,
    AuditsService,
    JwtService,
    BlockedIpService,
    CronJobsServices,
    NotificationsService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(AuditsMiddleware).forRoutes('*');
    consumer.apply(IpBlockMiddleware).forRoutes('*');
  }
}
