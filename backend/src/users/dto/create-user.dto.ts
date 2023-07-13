import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @Length(2, 30)
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  about: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
