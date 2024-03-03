import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  GetActivationToken,
  GetResfreshToken,
} from 'src/common/decorators/get-token.decorator';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { ActivationDto } from './dto/activation-auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: RegisterAuthDto) {
    try {
      if (body.password !== body.password_confirmation)
        throw new HttpException(
          'Password must be the same as the password confirmation',
          HttpStatus.BAD_REQUEST,
        );
      const activationToken = await this.authService.register(
        body.email,
        body.password,
        body.name,
        body.lastname,
        body.username,
      );
      return { success: true, activationToken };
    } catch (error) {
      throw new HttpException('Error while creating', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() body: LoginAuthDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.blocked) {
      throw new HttpException(
        'You are not allowed to access',
        HttpStatus.FORBIDDEN,
      );
    }

    const tokens = await this.authService.login(user);
    return {
      success: true,
      data: tokens,
    };
  }

  @Get('refresh')
  async refresh(@GetResfreshToken() token: any) {
    const tokens = await this.authService.refresh(
      token.email,
      token.sub,
      token.role.name,
      token.name,
      token.avatar,
    );

    return {
      success: true,
      data: tokens,
    };
  }

  @Post('activate')
  async activate(
    @Body('activationCode') activationCode: string,
    @GetActivationToken() activationToken: string,
  ) {
    const user = await this.authService.activateUser({
      activationCode,
      activationToken,
    } as ActivationDto);
    if (!user) {
      throw new HttpException('Code not found', HttpStatus.BAD_REQUEST);
    }
    return {
      success: true,
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const forgotPasswordToken =
      await this.authService.forgotPassword(forgotPasswordDto);
    if (!forgotPasswordToken) {
      throw new HttpException('Email not found', HttpStatus.BAD_REQUEST);
    }
    return {
      success: true,
      message: 'An email has been sent to reset the password',
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Body('password') password: string,
    @Body('passwordConfirmation') passwordConfirmation: string,
    @GetActivationToken() activationToken: string,
  ) {
    const resetPassword = await this.authService.resetPassword({
      password,
      passwordConfirmation,
      activationToken,
    } as ResetPasswordDto);
    if (!resetPassword) {
      throw new HttpException(
        'User with the provided email was not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      success: true,
      message: 'Password has been reset',
    };
  }
}
