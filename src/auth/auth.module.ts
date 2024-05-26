import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshTokenStrategy } from './strategy/refreshToken.strategy';
import { JwtAccesTokenStrategy } from './strategy/accessToken.strategy';

import { DatabaseService } from '../database/database.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, DatabaseService, 
              JwtAccesTokenStrategy, JwtRefreshTokenStrategy],
})
export class AuthModule { }
