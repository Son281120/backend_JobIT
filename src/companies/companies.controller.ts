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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public, ResponseMessage, User } from 'src/common/decorator/customize';
import { IUser } from 'src/users/users.inferface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ResponseMessage('Create a new company')
  createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
    @User() user: IUser,
  ) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch list company with paginate')
  findAllCompanies(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qr: string,
  ) {
    return this.companiesService.findAll(+currentPage, +limit, qr);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Fetch a company by id')
  findCompanyById(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a company')
  updateCompany(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser,
  ) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Detele a company')
  removeCompany(@Param('id') id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }
}
