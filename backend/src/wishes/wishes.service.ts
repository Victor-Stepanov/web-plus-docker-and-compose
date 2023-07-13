import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishEntity } from './entities/wish.entity';
import {
  WISH_COPY_ERROR,
  WISH_FORBIDDEN_DELETE_ERROR,
  WISH_FORBIDDEN_UPDATE_ERROR,
  WISH_NOT_FOUND_ERROR,
  WISH_RAISED_ERROR,
} from './wishes.constants';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(WishEntity)
    private readonly wishesService: Repository<WishEntity>,
  ) {}

  async create(dto: CreateWishDto, user: UserEntity) {
    delete user.email;
    delete user.password;
    return this.wishesService.save({
      ...dto,
      owner: user,
    });
  }

  async findAll() {
    return this.wishesService.find();
  }

  async findLast() {
    return this.wishesService.find({
      take: 40,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async copy(id: number, user: UserEntity) {
    const wish = await this.findOne(id);
    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND_ERROR);
    }
    if (wish.owner.id === user.id) {
      throw new BadRequestException(WISH_COPY_ERROR);
    }
    await this.wishesService.insert({
      ...wish,
      copied: 0,
      raised: 0,
      owner: user,
    });
    await this.wishesService.update(wish.id, {
      copied: wish.copied + 1,
    });
    return {};
  }

  async findTop() {
    return this.wishesService.find({
      take: 20,
      order: {
        copied: 'DESC',
      },
    });
  }

  async findAllUserWishes(id: number) {
    return this.wishesService.find({
      where: {
        owner: {
          id,
        },
      },
      relations: {
        offers: true,
        owner: true,
        wishlists: true,
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

  async findAllUserWishesByUserName(username: string) {
    return this.wishesService.find({
      where: {
        owner: {
          username,
        },
      },
      relations: {
        offers: true,
        owner: true,
        wishlists: true,
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

  async findAllWishesById(userId: number, itemsId: number[]) {
    // const wishes = await this.findAllUserWishes(userId);
    // return itemsId.map((el) => {
    //   return wishes.find((item) => item.id === el);
    // });
    return await this.wishesService.find({
      where: {
        id: In(itemsId),
      },
    });
  }

  async findOne(id: number) {
    return this.wishesService.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
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

  async update(id: number, dto: UpdateWishDto, user: UserEntity) {
    const wish = await this.findOne(id);
    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND_ERROR);
    }
    if (wish.raised > 0) {
      throw new ConflictException(WISH_RAISED_ERROR);
    }
    if (wish.owner.id !== user.id) {
      throw new ForbiddenException(WISH_FORBIDDEN_UPDATE_ERROR);
    }
    await this.wishesService.update(wish.id, {
      ...dto,
      updatedAt: new Date(),
    });
    return {};
  }

  async updateRaise(id, raised: number) {
    return this.wishesService.update(id, {
      raised,
      updatedAt: new Date(),
    });
  }

  async remove(id: number, user: UserEntity) {
    const wish = await this.findOne(id);
    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND_ERROR);
    }
    if (wish.raised > 0) {
      throw new ConflictException(WISH_RAISED_ERROR);
    }
    if (wish.owner.id !== user.id) {
      throw new ForbiddenException(WISH_FORBIDDEN_DELETE_ERROR);
    }
    await this.wishesService.remove(wish);
    return wish;
  }
}
