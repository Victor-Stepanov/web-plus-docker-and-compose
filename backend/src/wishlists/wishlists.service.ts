import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistEntity } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { UserEntity } from '../users/entities/user.entity';
import {
  WISHES_NOT_FOUND_ERROR, WISHLIST_FORBIDDEN_DELETE_ERROR,
  WISHLIST_FORBIDDEN_UPDATE_ERROR,
  WISHLIST_NOT_FOUND_ERROR,
} from './wishlists.constants';
import { WISH_FORBIDDEN_DELETE_ERROR } from '../wishes/wishes.constants';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishlistEntity)
    private readonly wishListRepository: Repository<WishlistEntity>,
    private readonly wishesService: WishesService,
  ) {}

  async create(user: UserEntity, dto: CreateWishlistDto) {
    const wishes = await this.wishesService.findAllWishesById(
      user.id,
      dto.itemsId,
    );
    if (!wishes) {
      throw new NotFoundException(WISHES_NOT_FOUND_ERROR);
    }
    delete user.password;
    delete user.email;
    const collection = this.wishListRepository.create({
      ...dto,
      items: wishes,
      owner: user,
    });
    delete collection.owner.email;
    delete collection.owner.password;

    // wishlist.name = dto.name;
    // wishlist.image = dto.image;
    // wishlist.owner = user;
    // wishlist.items = wishes;
    return this.wishListRepository.save(collection);
  }

  async findAll() {
    return this.wishListRepository.find({
      relations: {
        owner: true,
        items: true,
      },
      select: {
        owner: {
          id: true,
          createdAt: true,
          updatedAt: true,
          username: true,
          about: true,
          avatar: true,
        },
      },
    });
  }

  async findOne(id: number) {
    return this.wishListRepository.findOne({
      where: {
        id,
      },
      relations: {
        items: true,
        owner: true,
      },
      select: {
        owner: {
          id: true,
          createdAt: true,
          updatedAt: true,
          username: true,
          about: true,
          avatar: true,
        },
      },
    });
  }

  async update(id: number, dto: UpdateWishlistDto, userId: number) {
    const collection = await this.wishListRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });
    if (!collection) {
      throw new NotFoundException(WISHLIST_NOT_FOUND_ERROR);
    }
    if (collection.owner.id !== userId) {
      throw new ConflictException(WISHLIST_FORBIDDEN_UPDATE_ERROR);
    }

    const wishes = await this.wishesService.findAllWishesById(
      userId,
      dto.itemsId,
    );
    if (!wishes) {
      throw new NotFoundException(WISHES_NOT_FOUND_ERROR);
    }
    await this.wishListRepository.save({
      ...collection,
      name: dto.name,
      image: dto.image,
      items: wishes,
    });
    return this.findOne(collection.id);
  }

  async remove(id: number, userId: number) {
    const collection = await this.findOne(id);
    if (!collection) {
      throw new NotFoundException(WISHLIST_NOT_FOUND_ERROR);
    }
    if (collection.owner.id !== userId) {
      throw new ConflictException(WISHLIST_FORBIDDEN_DELETE_ERROR);
    }
    await this.wishListRepository.remove(collection);
    return collection;
  }
}
