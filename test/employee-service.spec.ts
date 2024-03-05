import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyService } from '../src/company/company.service';
import { EmployeeService } from '../src/employee/employee.service';
import { EmployeeEntity } from '../src/employee/entity/employee.entity';
import {
  companyInejectedRepositoryMock,
  employeeRepositoryMock,
} from './mocks/employee-repository.mock';

describe('EmployeeService', () => {
  let employeeService: EmployeeService;
  let employeeRepository: Repository<EmployeeEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        CompanyService,
        employeeRepositoryMock,
        companyInejectedRepositoryMock,
      ],
    }).compile();

    employeeService = module.get<EmployeeService>(EmployeeService);
    employeeRepository = module.get<Repository<EmployeeEntity>>(
      getRepositoryToken(EmployeeEntity),
    );
  });

  it('Should be defined', () => {
    expect(employeeService).toBeDefined();
    expect(employeeRepository).toBeDefined();
  });
});
