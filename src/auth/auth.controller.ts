import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, UserInfo, UserOut, UserOutDto } from './dto/auth.dto';
import { JwtAccesGuard, JwtRefreshTokenGuard } from './guards/jwt.guard';
import { getUser } from './decorators/getUser.decorator';
import { Response } from 'express';
import { COOKIE_OPTIONS, parseExpireDate } from './utils/utils';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) { }

  @Post("signUp")
  async signUp(@Body() dto: SignUpDto,
    @Res({ passthrough: true }) response: Response): Promise<UserOutDto> {
    const userInfo = await this.authService.signUp(dto)

    this.setCookies(response, userInfo.accessToken, userInfo.refreshToken)
    return userInfo
  }

  @Get("signIn")
  async signIn(@Body() dto: SignInDto,
    @Res({ passthrough: true }) response: Response): Promise<UserOutDto> {
    const userInfo = await this.authService.signIn(dto)

    this.setCookies(response, userInfo.accessToken, userInfo.refreshToken)
    return userInfo
  }

  @UseGuards(JwtAccesGuard)
  @Get("logout")
  async logout(@getUser() user: UserOut,
    @Res({ passthrough: true }) response: Response): Promise<Record<string, string>> {
    await this.authService.logout(user)

    this.clearCookies(response)
    return { "message": "Log out successfully" }
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Get("refresh")
  async refresh(@getUser() user: UserOut,
    @Res({ passthrough: true }) response: Response): Promise<UserOutDto> {
    const userInfo = await this.authService.refresh(user)

    this.setCookies(response, userInfo.accessToken, userInfo.refreshToken)
    return userInfo
  }


  private clearCookies(response: Response) {
    response.clearCookie('accessToken', COOKIE_OPTIONS)
    response.clearCookie('refreshToken', COOKIE_OPTIONS)
  }

  private setCookies(response: Response, accessToken: string, refreshToken: string) {
    if (accessToken != undefined) {
      response.cookie('accessToken', accessToken, {
        ...COOKIE_OPTIONS,
        expires: parseExpireDate(this.configService.get<string>("ACCESS_EXP")),
      });
    }

    if (refreshToken != undefined) {
      response.cookie('refreshToken', refreshToken, {
        ...COOKIE_OPTIONS,
        expires: parseExpireDate(this.configService.get<string>("REFRESH_EXP")),
      });
    }
  }

}
