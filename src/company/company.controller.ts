import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ParamId } from '../decorators/param-id.decorator';
import {
  CreateCompanySwagger,
  PatchCompanySwagger,
} from '../swagger/company.swagger';
import { ErrorSwagger } from '../swagger/error.swagger';
import { CompanyService } from './company.service';
import { CreateCompanyDTO } from './dto/create-company.dto';
import { PatchPasswordCompanyDTO } from './dto/patch-password-company.dto';
import { PutCompanyDTO } from './dto/put-company.dto';

@Controller('companies')
@ApiTags('Companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({
    status: 201,
    description: 'Company created successfully',
    type: CreateCompanySwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Inputs',
    type: ErrorSwagger,
  })
  async create(@Body() data: CreateCompanyDTO) {
    return await this.companyService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'List all companies' })
  @ApiResponse({
    status: 200,
    description: 'Companies list',
    type: CreateCompanySwagger,
    isArray: true,
  })
  async list() {
    return await this.companyService.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find an especific company' })
  @ApiParam({ name: 'companyId', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Company informations',
    type: CreateCompanySwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Company Not Found',
    type: ErrorSwagger,
  })
  async readOne(@ParamId() id: number) {
    return await this.companyService.readOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an company' })
  @ApiParam({ name: 'companyId', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Company updated',
    type: CreateCompanySwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Inputs',
    type: ErrorSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Company Not Found',
    type: ErrorSwagger,
  })
  async update(@Body() data: PutCompanyDTO, @ParamId() id: number) {
    return await this.companyService.update(id, data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update password of an company' })
  @ApiParam({ name: 'companyId', type: 'number' })
  @ApiBody({ type: PatchCompanySwagger })
  @ApiResponse({
    status: 200,
    description: 'Password updated',
    type: 'string',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Inputs',
    type: ErrorSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Company Not Found',
    type: ErrorSwagger,
  })
  async updatePassword(
    @Body() data: PatchPasswordCompanyDTO,
    @ParamId() id: number,
  ) {
    return await this.companyService.updatePassword(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an especific company' })
  @ApiParam({ name: 'companyId', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Company updated',
    type: 'string',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Inputs',
    type: ErrorSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Company Not Found',
    type: ErrorSwagger,
  })
  async delete(@ParamId() id: number) {
    return await this.companyService.delete(id);
  }
}
