import { CommonFields } from 'src/common/common.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { WishEntity } from 'src/wishes/entities/wish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('offer')
export class OfferEntity extends CommonFields {
  @Column({
    type: 'int',
  })
  amount: number;
  @Column({
    type: 'boolean',
    default: false,
  })
  hidden: boolean;

  @ManyToOne(() => UserEntity, (user) => user.offers)
  user: UserEntity;
  @ManyToOne(() => WishEntity, (wish) => wish.offers)
  item: WishEntity;
}
