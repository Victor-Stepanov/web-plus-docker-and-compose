import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferEntity } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { UserEntity } from '../users/entities/user.entity';
import { WISH_NOT_FOUND_ERROR } from '../wishes/wishes.constants';
import {
  OFFERS_AMOUNT_NEGATIVE_ERROR,
  OFFERS_NOT_FOUND_ERROR,
  OFFERS_OVER_AMOUNT_ERROR,
  OFFERS_OWNER_ERROR,
} from './offers.constants';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(OfferEntity)
    private readonly offersRepository: Repository<OfferEntity>,
    private readonly wishesService: WishesService,
  ) {}

  async create(dto: CreateOfferDto, user: UserEntity) {
    const wish = await this.wishesService.findOne(dto.itemId);
    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND_ERROR);
    }
    if (dto.amount < 0) {
      throw new BadRequestException(OFFERS_AMOUNT_NEGATIVE_ERROR);
    }
    if (wish.owner.id === user.id) {
      throw new BadRequestException(OFFERS_OWNER_ERROR);
    }
    if (dto.amount > wish.price - wish.raised) {
      throw new BadRequestException(OFFERS_OVER_AMOUNT_ERROR);
    }
    await this.offersRepository.save({
      user: user,
      item: wish,
      ...dto,
    });
    const updRaise = wish.raised + dto.amount;
    await this.wishesService.updateRaise(wish.id, updRaise);
    return {};
  }

  async findAll() {
    return await this.offersRepository.find({
      relations: {
        user: true,
        item: true,
      },
      select: {
        user: {
          id: true,
          createdAt: true,
          updatedAt: true,
          username: true,
          about: true,
          avatar: true,
          email: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: {
        user: true,
        item: true,
      },
      select: {
        user: {
          id: true,
          createdAt: true,
          updatedAt: true,
          username: true,
          about: true,
          avatar: true,
          email: true,
        },
      },
    });
    if (!offer) {
      throw new NotFoundException(OFFERS_NOT_FOUND_ERROR);
    }
    return offer;
  }
}
