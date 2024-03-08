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
import { ResumesService } from './resumes.service';
import { CreateUserCvDto } from './dto/create-resume.dto';
import {
  ResponseMessage,
  SkipCheckPermission,
  User,
} from 'src/common/decorator/customize';
import { IUser } from 'src/users/users.inferface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @SkipCheckPermission()
  @ResponseMessage('Create a new resume')
  create(@Body() createUserCvDto: CreateUserCvDto, @User() user: IUser) {
    return this.resumesService.create(createUserCvDto, user);
  }

  @Post('by-user')
  @SkipCheckPermission()
  @ResponseMessage('Get resumes by user')
  getResumesByUser(@User() user: IUser) {
    return this.resumesService.findByUser(user);
  }

  @Patch(':id')
  @ResponseMessage('Update status resume')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @User() user: IUser,
  ) {
    return this.resumesService.update(id, status, user);
  }

  @Get()
  @ResponseMessage('Fetch list resume with paginate')
  findAllResume(
    @Query('current') currentPage: string,
    @Query('pagesize') limit: string,
    @Query() qs: string,
    @User() user: IUser,
  ) {
    return this.resumesService.findAll(+currentPage, +limit, qs, user);
  }

  @Get(':id')
  @ResponseMessage('Fetch a resume by id')
  findJobById(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Delete(':id')
  @ResponseMessage('Detele a job')
  removeJob(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
