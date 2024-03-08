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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from 'src/common/decorator/customize';
import { IUser } from 'src/users/users.inferface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage('Create a new role')
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @ResponseMessage('Fetch list role with paginate')
  findAllRoles(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qr: string,
  ) {
    return this.rolesService.findAll(+currentPage, +limit, qr);
  }

  @Get(':id')
  @ResponseMessage('Fetch a role by id')
  findRoleById(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a role')
  updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: IUser,
  ) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Detele a role')
  removeRole(@Param('id') id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}
