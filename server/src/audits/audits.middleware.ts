import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuditsService } from './audits.service';
import { JwtService } from '@nestjs/jwt';

const excludedPaths = ['/api/v1/audit_trails'];

@Injectable()
export class AuditsMiddleware implements NestMiddleware {
  constructor(private readonly auditService: AuditsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const ipAddress = req.ip;
    const timestamp = new Date().toISOString();
    const method = req.method;
    const path = req.originalUrl;

    if (excludedPaths.includes(path)) {
      next();
      return;
    }

    let auditData;

    const token = req['rawHeaders'].find((header) =>
      header.startsWith('Bearer '),
    );

    if (token) {
      const jwtService = new JwtService({
        secret: process.env.JWT_SECRET,
      });
      const decoded = jwtService.decode(token.split(' ')[1]);

      auditData = {
        ipAddress,
        timestamp,
        method,
        path,
        userId: Number(decoded['sub']),
      };
    } else {
      auditData = {
        ipAddress,
        timestamp,
        method,
        path,
      };
    }

    await this.auditService.logAudit(auditData);

    next();
  }
}
