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
import { CreateCompanyDTO } from '../company/dto/create-company.dto';
import { ParamId } from '../decorators/param-id.decorator';
import {
  CreateEmployeeSwagger,
  PatchEmployeeSwagger,
} from '../swagger/employee.swagger';
import { ErrorSwagger } from '../swagger/error.swagger';
import { CreateEmployeeDTO } from './dto/create-employee.dto';
import { PatchPasswordEmployeeDTO } from './dto/patch-password-employee.dto';
import { PutEmployeeDTO } from './dto/put-employee.dto';
import { EmployeeService } from './employee.service';

@Controller('employees')
@ApiTags('Employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({
    status: 201,
    description: 'Employee created successfully',
    type: CreateEmployeeSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Inputs',
    type: ErrorSwagger,
  })
  async create(@Body() data: CreateEmployeeDTO) {
    return await this.employeeService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'List all employees' })
  @ApiResponse({
    status: 200,
    description: 'Employees list',
    type: CreateEmployeeSwagger,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Bad Request', type: ErrorSwagger })
  async list() {
    return await this.employeeService.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find an especific employee' })
  @ApiParam({ name: 'employeeId', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Employee informations',
    type: CreateEmployeeSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Employee Not Found',
    type: ErrorSwagger,
  })
  async readOne(@ParamId() id: number) {
    return await this.employeeService.readOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an employee' })
  @ApiParam({ name: 'employeeId', type: 'number', description: 'Employee Id' })
  @ApiBody({ type: CreateCompanyDTO })
  @ApiResponse({
    status: 200,
    description: 'Employee updated',
    type: CreateEmployeeSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Inputs',
    type: ErrorSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Employee Not Found',
    type: ErrorSwagger,
  })
  async update(@Body() data: PutEmployeeDTO, @ParamId() id: number) {
    return await this.employeeService.update(id, data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update password of an employee' })
  @ApiParam({ name: 'employeeId', type: 'number' })
  @ApiBody({ type: PatchEmployeeSwagger })
  @ApiResponse({ status: 200, description: 'Password updated', type: 'string' })
  @ApiResponse({
    status: 400,
    description: 'Invalid Inputs',
    type: ErrorSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Employee Not Found',
    type: ErrorSwagger,
  })
  async updatePassword(
    @Body() data: PatchPasswordEmployeeDTO,
    @ParamId() id: number,
  ) {
    return await this.employeeService.updatePassword(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an especific employee' })
  @ApiParam({ name: 'employeeId', type: 'number' })
  @ApiResponse({ status: 200, description: 'Employee updated', type: 'string' })
  @ApiResponse({
    status: 400,
    description: 'Invalid Inputs',
    type: ErrorSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Employee Not Found',
    type: ErrorSwagger,
  })
  async delete(@ParamId() id: number) {
    return await this.employeeService.delete(id);
  }
}
