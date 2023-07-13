import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';
import { AuthUser } from '../common/user.decorator';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() dto: CreateWishDto, @AuthUser() user) {
    return this.wishesService.create(dto, user);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(@Param('id') id: string, @AuthUser() user) {
    return this.wishesService.copy(+id, user);
  }

  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  @Get()
  @UseGuards(JwtGuard)
  findAllUserWishes(@AuthUser() user) {
    return this.wishesService.findAllUserWishes(user);
  }

  @Get('last')
  findLastWishes() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTopWishes() {
    return this.wishesService.findTop();
  }

  @Get(':id')
  findOneWishes(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWishDto,
    @AuthUser() user,
  ) {
    return this.wishesService.update(+id, dto, user);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  removeOneWishes(@Param('id') id: string, @AuthUser() user) {
    return this.wishesService.remove(+id, user);
  }
}
