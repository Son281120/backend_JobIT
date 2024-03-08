import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsInt, IsNotEmpty, Min, MinLength } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  @IsNotEmpty({ message: 'Id không được để trống' })
  _id: string;
}

export class UpdateInfoUserDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @MinLength(6, {message: "Độ dài password phải từ 6 ký tự trở lên."})
  password: string;

  @IsNotEmpty({ message: 'Age không được để trống' })
  @IsInt()
  @Min(18, { message: 'Tuổi phải lớn hơn hoặc bằng 18' })
  age: number;

  @IsNotEmpty({ message: 'Age không được để trống' })
  gender: number;

  @IsNotEmpty({ message: 'Address không được để trống' })
  address: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'newPassword không được để trống' })
  @MinLength(6, {message: "Độ dài password phải từ 6 ký tự trở lên."})
  newPassword: string;
}