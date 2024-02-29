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
import { EmployeeService } from './employee.service';
import { CreateEmployeeDTO } from './dto/create-employee.dto';
import { PutEmployeeDTO } from './dto/put-employee.dto';
import { PatchPasswordEmployeeDTO } from './dto/patch-password-employee.dto';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create(@Body() data: CreateEmployeeDTO) {
    return await this.employeeService.create(data);
  }

  @Get()
  async list() {
    return await this.employeeService.list();
  }

  @Get(':id')
  async readOne(@ParamId() id: number) {
    return await this.employeeService.readOne(id);
  }

  @Put(':id')
  async update(@Body() data: PutEmployeeDTO, @ParamId() id: number) {
    return await this.employeeService.update(id, data);
  }

  @Patch(':id')
  async updatePassword(
    @Body() data: PatchPasswordEmployeeDTO,
    @ParamId() id: number,
  ) {
    return await this.employeeService.updatePassword(id, data);
  }

  @Delete(':id')
  async delete(@ParamId() id: number) {
    return await this.employeeService.delete(id);
  }
}
