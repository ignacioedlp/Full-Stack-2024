import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../common/email/email.service';
import { ActivationDto } from './dto/activation-auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

type UserData = {
  email: string;
  password: string;
  name: string;
  lastname: string;
  username: string;
  role_id: number;
};

const EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7;
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
    lastname: string,
    username: string,
  ): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = await this.prisma.role.findFirst({
      where: {
        name: 'User',
      },
    });
    const user: UserData = {
      email,
      password: hashedPassword,
      name,
      lastname,
      username,
      role_id: userRole.id,
    };

    const activationToken = await this.createActivationToken(user);

    const activationCode = activationToken.activationCode;

    await this.emailService.sendEmail({
      subject: 'Activate your account',
      email: user.email,
      name: user.name,
      activationCode: activationCode,
      template: 'activation_mail',
    });

    return activationToken.token;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role.name,
      name: user.name,
      avatar: user.avatar,
    };
    return {
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_SECRET,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.REFRESH_JWT_SECRET,
        }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
      user: payload,
    };
  }

  async refresh(email: string, sub: string, role, name, avatar) {
    const payload = {
      email: email,
      sub: sub,
      role: role,
      name: name,
      avatar: avatar,
    };
    return {
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_SECRET,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.REFRESH_JWT_SECRET,
        }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
      user: payload,
    };
  }

  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = await this.jwtService.signAsync(
      { user, activationCode },
      {
        expiresIn: '5m',
        secret: process.env.ACTIVATION_SECRET,
      },
    );

    return { token, activationCode };
  }

  async activateUser(activationDto: ActivationDto) {
    const { activationCode, activationToken } = activationDto;

    const newUser = await this.jwtService.verifyAsync(activationToken, {
      secret: process.env.ACTIVATION_SECRET,
    });

    if (newUser.activationCode !== activationCode) {
      throw new Error('Invalid activation code');
    }

    const { email, password, name, lastname, username, role_id } = newUser.user;

    const existUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) {
      throw new Error('User already activated');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        password,
        name,
        lastname,
        username,
        role_id,
      },
    });

    return user;
  }

  async generateForgotPasswordLink(user: UserData) {
    const forgotPasswordToken = this.jwtService.sign(
      { user },
      {
        expiresIn: '1d',
        secret: process.env.FORGOT_PASSWORD_SECRET,
      },
    );

    return forgotPasswordToken;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const forgotPasswordToken = await this.generateForgotPasswordLink(user);

    const resetPasswordUrl = `${process.env.CLIENT_URL}/reset-password?verify=${forgotPasswordToken}`;

    await this.emailService.sendEmail({
      subject: 'Reset your password',
      email: user.email,
      name: user.name,
      activationCode: resetPasswordUrl,
      template: 'forgot_password_mail',
    });

    return forgotPasswordToken;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, activationToken, passwordConfirmation } =
      resetPasswordDto;

    if (password !== passwordConfirmation) {
      throw new Error('Passwords do not match');
    }

    const decoded = await this.jwtService.verifyAsync(activationToken, {
      secret: process.env.FORGOT_PASSWORD_SECRET,
    });

    if (!decoded) {
      throw new Error('Invalid token');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.prisma.user.findUnique({
      where: {
        email: decoded.user.email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: decoded.user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return updatedUser;
  }
}
