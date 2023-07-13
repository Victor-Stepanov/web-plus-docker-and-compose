import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { AuthUser } from '../common/user.decorator';
import {
  USER_NOT_FOUND_BY_USERNAME_ERROR,
  USER_NOT_FOUND_ERROR,
} from './users.constants';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getUser(@AuthUser() user) {
    return this.usersService.findOne(user.id);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsernameWithoutValues(username);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_BY_USERNAME_ERROR);
    }
    return user;
  }

  @Patch('me')
  async updateProfile(@AuthUser() user, @Body() dto: UpdateUserDto) {
    const currentUser = await this.usersService.findOne(user.id);
    if (!currentUser) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    return this.usersService.updateProfileById(currentUser.id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post('find')
  findByQuery(@Body('query') query: string) {
    return this.usersService.findAll(query);
  }

  @Get('me/wishes')
  findAllUserWishes(@AuthUser() user) {
    return this.usersService.findCurrentUserWishes(user.id);
  }

  @Get(':username/wishes')
  getWishesByUsername(@Param('username') username: string) {
    return this.usersService.findWishesByUsername(username);
  }
}
