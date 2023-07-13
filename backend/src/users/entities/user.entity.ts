import { CommonFields } from 'src/common/common.entity';
import { OfferEntity } from 'src/offers/entities/offer.entity';
import { WishEntity } from 'src/wishes/entities/wish.entity';
import { WishlistEntity } from 'src/wishlists/entities/wishlist.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('user')
export class UserEntity extends CommonFields {
  @Column({
    unique: true,
    type: 'varchar',
  })
  username: string;

  @Column({
    default: 'Пока ничего не рассказал о себе',
    type: 'varchar',
    length: 200,
  })
  about: string;

  @Column({
    default: 'https://i.pravatar.cc/300',
    type: 'varchar',
  })
  avatar: string;

  @Column({
    unique: true,
    type: 'varchar',
  })
  email: string;

  @Column({
    type: 'varchar',
  })
  password: string;
  @OneToMany(() => WishEntity, (wish) => wish.owner)
  wishes: WishEntity[];
  @OneToMany(() => OfferEntity, (offer) => offer.user)
  offers: OfferEntity[];
  @OneToMany(() => WishlistEntity, (wishlist) => wishlist.owner)
  wishlists: WishlistEntity[];
}
