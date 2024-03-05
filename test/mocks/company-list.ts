import { CompanyEntity } from '../../src/company/entity/company.entity';

export const companyEntityList: CompanyEntity[] = [
  new CompanyEntity({
    companyId: 1,
    CNPJ: '11222333000145',
    companyName: 'company 1',
    email: 'user@company1.com',
    password: '$2b$10$pbDDdVY3CSyI2OBYbaAOUe/RWRxbW57hREulRcyb0UdlIiCW.U8ai',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new CompanyEntity({
    companyId: 1,
    CNPJ: '22333444000165',
    companyName: 'company 2',
    email: 'user@company2.com',
    password: '$2b$10$pbDDdVY3CSyI2OBYbaAOUe/RWRxbW57hREulRcyb0UdlIiCW.U8ai',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new CompanyEntity({
    companyId: 1,
    CNPJ: '11999888000176',
    companyName: 'company 3',
    email: 'user@company3.com',
    password: '$2b$10$pbDDdVY3CSyI2OBYbaAOUe/RWRxbW57hREulRcyb0UdlIiCW.U8ai',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
];
