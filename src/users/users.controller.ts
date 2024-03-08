import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  UpdateInfoUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto/update-user.dto';
import {
  Public,
  ResponseMessage,
  SkipCheckPermission,
  User,
} from 'src/common/decorator/customize';
import { IUser } from './users.inferface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users') // => /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Create a new user!')
  createUser(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  @ResponseMessage('Fetch list user with paginate!')
  findAllUser(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qr: string,
  ) {
    return this.usersService.findAll(+currentPage, +limit, qr);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Fetch user by id!')
  findUserById(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @ResponseMessage('Update user!')
  updateUser(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.update(updateUserDto, user);
  }

  @Patch(':id')
  @ResponseMessage('Update user by id!')
  @SkipCheckPermission()
  updateUserById(
    @Body() updateInfoUserDto: UpdateInfoUserDto,
    @Param('id') id: string,
  ) {
    return this.usersService.updateInfo(id, updateInfoUserDto);
  }

  @Patch('password/:id')
  @ResponseMessage('Update password!')
  @SkipCheckPermission()
  updatePasswordById(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @ResponseMessage('Delete user by id!')
  removeUser(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
