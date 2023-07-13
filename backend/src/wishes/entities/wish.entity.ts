import { CommonFields } from 'src/common/common.entity';
import { OfferEntity } from 'src/offers/entities/offer.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { WishlistEntity } from '../../wishlists/entities/wishlist.entity';

@Entity('wish')
export class WishEntity extends CommonFields {
  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'varchar',
  })
  link: string;

  @Column({
    type: 'varchar',
  })
  image: string;

  @Column({
    type: 'int',
    default: 0,
  })
  price: number;

  @Column({ default: 0, type: 'int' })
  raised: number;

  @ManyToOne(() => UserEntity, (user) => user.wishes)
  owner: UserEntity;

  @Column({
    type: 'varchar',
  })
  description: string;

  @ManyToOne(() => OfferEntity, (offer) => offer.item)
  offers: OfferEntity[];

  @Column({ default: 0, type: 'int' })
  copied: number;

  @ManyToMany(() => WishlistEntity, (wishlist) => wishlist.items)
  wishlists: WishlistEntity[];
}
