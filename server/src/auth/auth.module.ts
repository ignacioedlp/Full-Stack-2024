import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'; // Asegúrate de que esta ruta sea correcta
import { EmailService } from 'src/common/email/email.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtService, EmailService],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2d' },
    }),
  ],
})
export class AuthModule {}
