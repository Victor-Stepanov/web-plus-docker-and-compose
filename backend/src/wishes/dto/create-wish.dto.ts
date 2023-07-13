import {
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';

export class CreateWishDto {
  @Length(1, 250)
  @IsString()
  name: string;

  @IsString()
  @IsUrl()
  link: string;

  @IsString()
  @IsUrl()
  image: string;

  @Min(1)
  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @Length(1, 1024)
  description: string;
}
