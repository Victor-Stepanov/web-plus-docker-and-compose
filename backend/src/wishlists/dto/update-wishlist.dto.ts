import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateWishlistDto {
  @IsString({
    message:
      'Название списка не может быть длиннее 250 символов и короче одного',
  })
  @IsOptional()
  name: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @IsArray()
  @IsOptional()
  itemsId?: number[];
}
