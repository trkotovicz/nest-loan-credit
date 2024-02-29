import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ParamId } from 'src/decorators/param-id.decorator';
import { CompanyService } from './company.service';
import { CreateCompanyDTO } from './dto/create-company.dto';
import { PatchPasswordDTO } from './dto/patch-password-company.dto';
import { PutCompanyDTO } from './dto/put-company.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async create(@Body() data: CreateCompanyDTO) {
    return await this.companyService.create(data);
  }

  @Get()
  async list() {
    return await this.companyService.list();
  }

  @Get(':id')
  async readOne(@ParamId() id: number) {
    return await this.companyService.readOne(id);
  }

  @Put(':id')
  async update(@Body() data: PutCompanyDTO, @ParamId() id: number) {
    return await this.companyService.update(id, data);
  }

  @Patch(':id')
  async updatePassword(@Body() data: PatchPasswordDTO, @ParamId() id: number) {
    return await this.companyService.updatePassword(id, data);
  }

  @Delete(':id')
  async delete(@ParamId() id: number) {
    return await this.companyService.delete(id);
  }
}
