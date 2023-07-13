import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AuthUser } from '../common/user.decorator';

@Controller('offers')
@UseGuards(JwtGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() dto: CreateOfferDto, @AuthUser() user) {
    return this.offersService.create(dto, user);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(+id);
  }
}
