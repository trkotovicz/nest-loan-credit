import { getRepositoryToken } from '@nestjs/typeorm';
import { EmployeeEntity } from '../../src/employee/entity/employee.entity';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../../src/company/entity/company.entity';

export const employeeRepositoryMock = {
  provide: getRepositoryToken(EmployeeEntity),
  useValue: {
    exists: jest.fn(),
    insert: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

export const companyInejectedRepositoryMock = {
  provide: getRepositoryToken(CompanyEntity),
  useClass: Repository,
};
