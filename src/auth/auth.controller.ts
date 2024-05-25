import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, UserInfo, UserOutDto } from './dto/auth.dto';
import { JwtRefreshTokenGuard } from './guards/jwt.guard';
import { getUser } from './decorators/getUser.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signUp")
  async signUp(@Body() dto: SignUpDto): Promise<UserOutDto>{    
    return await this.authService.signUp(dto)
  }

  @Get("signIn")
  async signIn(@Body() dto: SignInDto): Promise<UserOutDto>{
    return await this.authService.signIn(dto)
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Get("refresh")
  async refresh(@getUser() user: User): Promise<UserOutDto>{
    return await this.authService.refresh(user)
  }

}
