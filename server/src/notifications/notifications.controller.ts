import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { checkAbilites } from '../common/decorators/abilities.decorator';
import { AbilitiesGuard } from '../common/guards/abilities.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @checkAbilites({ action: 'create', subject: 'Notification' })
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }
}
