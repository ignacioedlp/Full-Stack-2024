/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const GetResfreshToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { rawHeaders } = ctx.switchToHttp().getRequest();

    const token = rawHeaders.find((header) => header.startsWith('Bearer '));

    const jwtService = new JwtService({
      secret: process.env.REFRESH_JWT_SECRET,
    });

    const decoded = jwtService.decode(token.split(' ')[1]);

    if (!token) {
      return null;
    }

    return decoded;
  },
);

export const GetToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { rawHeaders } = ctx.switchToHttp().getRequest();

    const token = rawHeaders.find((header) => header.startsWith('Bearer '));

    const jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
    });


    const decoded = jwtService.decode(token.split(' ')[1]);

    if (!token) {
      return null;
    }

    return decoded;
  },
);

export const GetActivationToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { rawHeaders } = ctx.switchToHttp().getRequest();

    const token = rawHeaders.find((header) => header.startsWith('Bearer '));

    return token.split(' ')[1];
  },
);
