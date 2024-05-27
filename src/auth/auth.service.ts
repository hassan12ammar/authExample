import * as argon from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SignInDto, SignUpDto, UserInfo, UserInfoSign, UserOut, UserOutDto } from './dto/auth.dto';
import { DatabaseService } from '../database/database.service';


@Injectable()
export class AuthService {

  constructor(private readonly databaseService: DatabaseService,
    private readonly jwtServide: JwtService,
    private readonly configService: ConfigService) { }

  async signUp(dto: SignUpDto): Promise<UserOutDto> {
    // check if username is already taken
    const user = await this.getUserByUsername(dto.username)
    if (user) {
      throw new BadRequestException("username already in use")
    }

    // formate birthdate
    if (dto.birthdate) {
      dto.birthdate = new Date(dto.birthdate)
    }

    // hash the password
    dto.password = await argon.hash(dto.password)

    // create the user
    const newUser = await this.databaseService.user.create({
      data: dto
    })
    // get user info to sign
    const userInfo = {
      id: newUser.id,
      username: newUser.username
    }

    // generate tokens
    const { accessToken, refreshToken } = await this.signTokens(userInfo);

    // update refresh token
    this.updateRefreshToken(userInfo.id, refreshToken)

    // generate the output
    return this.buildUserOut(newUser, accessToken, refreshToken);
  }

  async signIn(dto: SignInDto): Promise<UserOutDto> {
    const user = await this.getUserByUsername(dto.username)

    if (!user) {
      throw new NotFoundException("Credentials incorrect")
    }

    const passwordMathced = await argon.verify(user.password, dto.password)
    if (!passwordMathced) {
      throw new NotFoundException("Credentials incorrect")
    }

    // get user info to sign
    const userInfo = {
      id: user.id,
      username: user.username
    }

    // generate tokens
    const { accessToken, refreshToken } = await this.signTokens(userInfo);

    // update refresh token
    this.updateRefreshToken(userInfo.id, refreshToken)

    // generate the output
    return this.buildUserOut(user, accessToken, refreshToken);
  }

  async logout(dto: UserOut): Promise<string> {
    await this.databaseService.user.updateMany({
      where: {
        id: dto.id,
        refreshToken: {
          not: null
        },
      },
      data: {
        refreshToken: null
      }
    })

    return "Log out correctly"
  }

  async refresh(dto: UserOut): Promise<UserOutDto> {
    // get user info to sign
    const userInfo = {
      id: dto.id,
      username: dto.username
    }

    // generate tokens
    const { accessToken, refreshToken } = await this.signTokens(userInfo);

    // update refresh token
    this.updateRefreshToken(userInfo.id, refreshToken)

    // generate the output
    return this.buildUserOut(userInfo, accessToken, refreshToken);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    refreshToken = await argon.hash(refreshToken)

    await this.databaseService.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: refreshToken
      }
    })
  }

  private buildUserOut(user: User | UserInfoSign, accessToken: string, refreshToken: string) {
    // exclude the password and hashed refreshToken
    if ("password" in user) {
      delete user.password
      delete user.refreshToken
    }

    return {
      userInfo: user as UserInfo,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private async signTokens(userInfo: UserInfoSign) {
    const accessToken = await this.generateAccesToken(userInfo);
    const refreshToken = await this.generateRefreshToken(userInfo);
    return { accessToken, refreshToken }
  }

  private async generateAccesToken(userInfo: UserInfoSign) {
    const SECRET = this.configService.get<string>("ACCESS_SECRET");
    const EXP = this.configService.get<string>("ACCESS_EXP");
    const accessToken = await this.jwtServide.signAsync(userInfo, { expiresIn: EXP, secret: SECRET });
    return accessToken;
  }

  private async generateRefreshToken(userInfo: UserInfoSign) {
    const SECRET = this.configService.get<string>("REFRESH_SECRET");
    const EXP = this.configService.get<string>("REFRESH_EXP");
    const refreshToken = await this.jwtServide.signAsync(userInfo, { expiresIn: EXP, secret: SECRET });
    return refreshToken;
  }

  private async getUserByUsername(username: string) {
    return await this.databaseService.user.findUnique({
      where: {
        username: username
      }
    });
  }

}
