import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetToken } from 'src/common/decorators/get-token.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { createClient } from '@supabase/supabase-js';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AbilitiesGuard } from 'src/common/guards/abilities.guard';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  findOne(@GetToken() token: any) {
    return this.profileService.findOne(token.sub);
  }

  @Patch()
  update(@GetToken() token: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(token.sub, updateProfileDto);
  }

  @Patch('/update-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @GetToken() token: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const uploadedImageUrl = await this.uploadImageToSupabase(file, token.sub);

    const updateUser = await this.profileService.updateUserAvatar(
      token.sub,
      uploadedImageUrl,
    );

    return { message: 'Image updated successfully', updateUser };
  }

  async uploadImageToSupabase(
    file: Express.Multer.File,
    id: string,
  ): Promise<string> {
    const timestamp = new Date().getTime();
    const { data, error } = await supabase.storage
      .from('users')
      .upload(`${id}/${timestamp}_${file.originalname}`, file.buffer, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw new Error(error.message);

    const urlfile = `${process.env.SUPABASE_URL_BUCKET}${data?.path}`;

    return urlfile;
  }

  @Delete()
  remove(@GetToken() token: any) {
    return this.profileService.remove(token.sub);
  }

  @Post('/set-notification')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  setNotificationToken(
    @GetToken() token: any,
    @Body() notificationDto: { notificationToken: string },
  ) {
    return this.profileService.setNotificationToken(
      token.sub,
      notificationDto.notificationToken,
    );
  }
}
