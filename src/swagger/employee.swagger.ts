import { ApiProperty } from '@nestjs/swagger';
import { EmployeeEntity } from '../employee/entity/employee.entity';

export class CreateEmployeeSwagger extends EmployeeEntity {}

export class PatchEmployeeSwagger {
  @ApiProperty()
  password: string;
}
