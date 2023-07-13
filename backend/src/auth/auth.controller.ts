import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() data) {
    return this.authService.auth(data.user);
  }

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    this.authService.auth(user);
    delete user.password;
    return user;
  }
}
