import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Expo } from 'expo-server-sdk';

@Injectable()
export class NotificationsService {
  create(createNotificationDto: CreateNotificationDto) {
    const expo = new Expo();

    const messages = [];

    for (const pushToken of createNotificationDto.tokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      messages.push({
        to: pushToken,
        sound: 'default',
        title: createNotificationDto.title,
        body: createNotificationDto.description,
        data: { withSome: createNotificationDto.description },
      });
    }

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    (async () => {
      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }
}
