import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

import { JwtAccesGuard } from '../auth/guards/jwt.guard';
import { getUser } from '../auth/decorators/getUser.decorator';
import { EditUserDto } from './dto/editUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @UseGuards(JwtAccesGuard)
  @Get("profile")
  getProfile(@getUser() user: User) {
    return user
  }

  @UseGuards(JwtAccesGuard)
  @Patch("editProfile")
  editProfile(@getUser() user: User, @Body() newUser: EditUserDto) {
    return this.userService.editProfile(user, newUser)
  }

}
