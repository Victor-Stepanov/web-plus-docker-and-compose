import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: UserEntity) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload, { expiresIn: '7d' }) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    return user;
  }
}
