import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateSubscriberDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'skills không được để trống' })
  @IsArray({ message: 'skills có định dạng là array' })
  skills: string[];

  @IsNotEmpty({ message: 'Gmail không được để trống' })
  @IsEmail({}, { message: 'Gmail không đúng định dạng' })
  gmail: string;
}
