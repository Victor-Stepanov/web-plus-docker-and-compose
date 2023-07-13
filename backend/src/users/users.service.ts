import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ALREADY_USED_ERROR } from './users.constants';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly wishesService: WishesService,
  ) {}

  async create(dto: CreateUserDto) {
    const candidate = await this.findByUserNameOrEmail(dto.email, dto.username);
    if (candidate) {
      throw new ConflictException(ALREADY_USED_ERROR);
    }
    const hashPassword = await bcrypt.hash(dto.password, 10);
    return await this.usersRepository.save({
      ...dto,
      password: hashPassword,
    });
  }

  async findByUsername(username: string) {
    return await this.usersRepository.findOne({
      where: {
        username,
      },
    });
  }

  async findByUsernameWithoutValues(username: string) {
    return await this.usersRepository.findOne({
      where: {
        username,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        username: true,
        about: true,
        avatar: true,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findByUserNameOrEmail(email: string, username: string) {
    return !!(await this.usersRepository.findOne({
      where: [{ username }, { email }],
    }));
  }

  async findOne(id: number) {
    return await this.usersRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
      },
    });
  }

  // where: [
  //       { name: "john" },
  //       { lastName: "doe" }
  //   ]
  async findAll(query: string) {
    return await this.usersRepository.find({
      where: [{ username: query }, { email: query }],
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
      },
    });
  }

  async findCurrentUserWishes(id: number) {
    return this.wishesService.findAllUserWishes(id);
  }

  async findWishesByUsername(username: string) {
    return await this.wishesService.findAllUserWishesByUserName(username);
  }

  async updateProfileById(id: number, dto: UpdateUserDto) {
    if (dto.password) {
      const hashPassword = await bcrypt.hash(dto.password, 10);
      return this.usersRepository.update(id, {
        password: hashPassword,
      });
    }
    await this.usersRepository.update(id, {
      ...dto,
      updatedAt: new Date(),
    });
    return await this.findOne(id);
  }
}
