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
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AuthUser } from '../common/user.decorator';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@AuthUser() user, @Body() dto: CreateWishlistDto) {
    return this.wishlistsService.create(user, dto);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWishlistDto,
    @AuthUser() user,
  ) {
    return this.wishlistsService.update(+id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() user) {
    return this.wishlistsService.remove(+id, user.id);
  }
}
