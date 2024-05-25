import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EditUserDto } from './dto/editUser.dto';
import { DatabaseService } from '../database/database.service';
import { User } from '@prisma/client';
import { UserInfo } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) { }

  async editProfile(user: User, dto: EditUserDto) {
      // formate birthdate
      if (dto.birthdate) {
        dto.birthdate = new Date(dto.birthdate)
      }

      const updatedUser = await this.databaseService.user.update({
        where: {
          id: user.id
        },
        data: {
          ...dto
        }
      })

      const userOut: UserInfo = {
        id: updatedUser.id,
        username: updatedUser.username,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        birthdate: updatedUser.birthdate
      }

      return userOut

  }
}
