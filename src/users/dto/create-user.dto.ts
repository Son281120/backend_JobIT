import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

//data transfer object // class = { }

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}
export class CreateUserDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'Age không được để trống' })
  @IsInt()
  @Min(18, { message: 'Tuổi phải lớn hơn hoặc bằng 18' })
  age: number;

  @IsNotEmpty({ message: 'Age không được để trống' })
  gender: number;

  @IsNotEmpty({ message: 'Address không được để trống' })
  address: string;

  @IsNotEmpty({ message: 'Role không được để trống' })
  @IsMongoId({ message: 'Role có định dạng mongo id' })
  role: mongoose.Schema.Types.ObjectId;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

export class RegisterUserDto {
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

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'son123@gmail.com', description: 'email' })
  readonly username: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: 'password',
  })
  readonly password: string;
}
