import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

import { JwtAccesGuard } from '../auth/guards/jwt.guard';
import { getUser } from '../auth/decorators/getUser.decorator';
import { EditUserDto } from './dto/editUser.dto';
import { UserInfo } from 'src/auth/dto/auth.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAccesGuard)
  @Get("testUserId")
  async testUserId(@getUser("id") userID: number) {
    return { userID }
  }

  @UseGuards(JwtAccesGuard)
  @Get("profile")
  getProfile(@getUser() user: User) {
    return user
  }

  @UseGuards(JwtAccesGuard)
  @Patch("editProfile")
  async editProfile(@getUser("id") userId: number, @Body() newUser: EditUserDto): Promise<UserInfo> {
    return await this.userService.editProfile(userId, newUser)
  }

}
