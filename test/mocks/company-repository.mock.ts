import { getRepositoryToken } from '@nestjs/typeorm';
import { CompanyEntity } from '../../src/company/entity/company.entity';
import { companyEntityList } from './company-list';

export const companyRepositoryMock = {
  provide: getRepositoryToken(CompanyEntity),
  useValue: {
    exists: jest.fn(),
    insert: jest.fn(),
    findOne: jest.fn().mockResolvedValue(companyEntityList[0]),
    find: jest.fn().mockResolvedValue(companyEntityList),
    update: jest.fn().mockImplementation(async () => {
      return { affected: 1 };
    }),
    delete: jest.fn().mockReturnValue('Empresa deletada com sucesso'),
  },
};
