import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';

export class UpdateWishDto {
  @Length(1, 250)
  @IsOptional()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  link: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  image: string;

  @Min(1)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price: number;

  @IsString()
  @Length(1, 1024)
  @IsOptional()
  description: string;
}
