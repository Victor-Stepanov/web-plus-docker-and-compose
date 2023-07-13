import { CommonFields } from '../../common/common.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { WishEntity } from '../../wishes/entities/wish.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity('wishlist')
export class WishlistEntity extends CommonFields {
  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'varchar',
  })
  image: string;

  @ManyToMany(() => WishEntity, (wish) => wish.wishlists)
  @JoinTable()
  items: WishEntity[];

  @ManyToOne(() => UserEntity, (user) => user.wishes)
  owner: UserEntity;
}
