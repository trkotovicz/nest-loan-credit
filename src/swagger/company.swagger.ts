import { ApiProperty } from '@nestjs/swagger';
import { CompanyEntity } from '../company/entity/company.entity';

export class CreateCompanySwagger extends CompanyEntity {}

export class PatchCompanySwagger {
  @ApiProperty()
  password: string;
}
