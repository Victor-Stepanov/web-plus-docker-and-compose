import { IsArray, IsString, IsUrl } from 'class-validator';

export class CreateWishlistDto {
  @IsString({
    message:
      'Название списка не может быть длиннее 250 символов и короче одного',
  })
  name: string;
  @IsUrl()
  image: string;
  @IsArray()
  itemsId: number[];
}
