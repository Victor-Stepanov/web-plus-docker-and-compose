import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistEntity } from './entities/wishlist.entity';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';
import { UsersModule } from '../users/users.module';
import { WishesModule } from '../wishes/wishes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WishlistEntity]),
    WishesModule,
    UsersModule,
  ],
  controllers: [WishlistsController],
  providers: [WishlistsService],
  exports: [WishlistsService],
})
export class WishlistsModule {}
