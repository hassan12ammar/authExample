import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, UserInfo, UserOut, UserOutDto } from './dto/auth.dto';
import { JwtAccesGuard, JwtRefreshTokenGuard } from './guards/jwt.guard';
import { getUser } from './decorators/getUser.decorator';

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

  @UseGuards(JwtAccesGuard)
  @Get("logout")
  logout(@getUser() user: UserOut): Promise<string>{
    return this.authService.logout(user)
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Get("refresh")
  async refresh(@getUser() user: UserOut): Promise<UserOutDto>{
    return await this.authService.refresh(user)
  }

}
