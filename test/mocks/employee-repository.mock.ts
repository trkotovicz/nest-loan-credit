import { getRepositoryToken } from '@nestjs/typeorm';
import { EmployeeEntity } from '../../src/employee/entity/employee.entity';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../../src/company/entity/company.entity';
import { employeeList } from './employee-list';

export const employeeRepositoryMock = {
  provide: getRepositoryToken(EmployeeEntity),
  useValue: {
    exists: jest.fn(),
    insert: jest.fn(),
    findOne: jest.fn().mockResolvedValue(employeeList[0]),
    find: jest.fn().mockResolvedValue(employeeList),
    update: jest.fn().mockImplementation(async () => {
      return { affected: 1 };
    }),
    delete: jest.fn().mockReturnValue('Funcionário deletado com sucesso.'),
  },
};

export const companyInejectedRepositoryMock = {
  provide: getRepositoryToken(CompanyEntity),
  useClass: Repository,
};
