import { CompanyEntity } from '../../src/company/entity/company.entity';
import { EmployeeEntity } from '../../src/employee/entity/employee.entity';

export const employeeList: EmployeeEntity[] = [
  new EmployeeEntity({
    employeeId: 1,
    CPF: '11122233345',
    fullName: 'Employee Test One',
    email: 'firstemployee@email.com',
    password: '$2b$10$pbDDdVY3CSyI2OBYbaAOUe/RWRxbW57hREulRcyb0UdlIiCW.U8ai',
    salary: 1500,
    createdAt: new Date(),
    updatedAt: new Date(),
    company: new CompanyEntity(),
  }),
  new EmployeeEntity({
    employeeId: 2,
    CPF: '44455566678',
    fullName: 'Employee Test Two',
    email: 'secondemployee@email.com',
    password: '$2b$10$pbDDdVY3CSyI2OBYbaAOUe/RWRxbW57hREulRcyb0UdlIiCW.U8ai',
    salary: 4000,
    createdAt: new Date(),
    updatedAt: new Date(),
    company: new CompanyEntity(),
  }),
  new EmployeeEntity({
    employeeId: 3,
    CPF: '55566677789',
    fullName: 'Employee Test Three',
    email: 'thirdemployee@email.com',
    password: '$2b$10$pbDDdVY3CSyI2OBYbaAOUe/RWRxbW57hREulRcyb0UdlIiCW.U8ai',
    salary: 12000,
    createdAt: new Date(),
    updatedAt: new Date(),
    company: new CompanyEntity(),
  }),
];

export const newEmployeeEntity: EmployeeEntity = new EmployeeEntity({
  employeeId: 1,
  CPF: '11122233345',
  fullName: 'Employee Test One',
  email: 'firstemployee@email.com',
  password: '$2b$10$pbDDdVY3CSyI2OBYbaAOUe/RWRxbW57hREulRcyb0UdlIiCW.U8ai',
  salary: 5000,
  createdAt: new Date(),
  updatedAt: new Date(),
  company: new CompanyEntity(),
});

export const updatedEmployeeEntity: EmployeeEntity = new EmployeeEntity({
  employeeId: 1,
  CPF: '11122233345',
  fullName: 'Employee Test Updated',
  email: 'updated@email.com',
  password: '$2b$10$pbDDdVY3CSyI2OBYbaAOUe/RWRxbW57hREulRcyb0UdlIiCW.U8ai',
  salary: 5000,
  createdAt: new Date(),
  updatedAt: new Date(),
  company: new CompanyEntity(),
});
