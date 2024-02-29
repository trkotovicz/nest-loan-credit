import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDTO } from './create-employee.dto';

export class PatchPasswordEmployeeDTO extends PartialType(CreateEmployeeDTO) {}
