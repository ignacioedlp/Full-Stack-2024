import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { BlockedIpService } from './blocked-ip.service';

@Injectable()
export class IpBlockMiddleware implements NestMiddleware {
  constructor(private readonly blockedIpService: BlockedIpService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const ipAddress = req.ip;

    const blockedIp = await this.blockedIpService.findBlockedIp(ipAddress);
    if (blockedIp) {
      throw new UnauthorizedException(
        `Acceso bloqueado desde la dirección IP ${ipAddress}: ${blockedIp.reason}`,
      );
    }

    next();
  }
}
