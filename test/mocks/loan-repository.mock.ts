import { getRepositoryToken } from '@nestjs/typeorm';
import { LoanEntity, LoanStatus } from '../../src/loan/entity/loan.entity';

export const loanResponseMock = {
  amountAvailable: 176418.69,
  monthlyFinancingApproved: 2940.3115,
  amountRequested: 5000,
  monthlyFinancingRequested: 83.33333333333333,
  statusPayment: 'Aprovado',
};

export const loanEntityMock = {
  loanId: 1,
  amount: 1000,
  status: LoanStatus.pending,
  createdAt: new Date(),
  employee: {
    CPF: '11122233345',
    fullName: 'Employee Test',
    email: 'employee@email.com',
    password: '$2b$10$pbDDdVY3CSyI2OBYbaAOUe/RWRxbW57hREulRcyb0UdlIiCW.U8ai',
    salary: 4500,
    createdAt: new Date(),
    updatedAt: new Date(),
    company: 1,
  },
};

export const loanRepositoryMock = {
  provide: getRepositoryToken(LoanEntity),
  useValue: {
    insert: jest.fn().mockResolvedValue({
      loanId: 1,
      amount: 1000,
      status: LoanStatus.pending,
      createdAt: new Date(),
      employee: {
        CPF: '11122233345',
        fullName: 'Employee Test',
        email: 'employee@email.com',
        password:
          '$2b$10$pbDDdVY3CSyI2OBYbaAOUe/RWRxbW57hREulRcyb0UdlIiCW.U8ai',
        salary: 4500,
        createdAt: new Date(),
        updatedAt: new Date(),
        company: 1,
      },
    }),
  },
};

export const scoreApiServiceMock = {
  fetchData: jest.fn().mockReturnValueOnce(Promise.resolve({ score: 580 })),
};

export const paymentApiServiceMock = {
  fetchData: jest.fn().mockReturnValueOnce(Promise.resolve({ message: true })),
};

export const employeeServiceMock = {
  readOne: jest.fn().mockResolvedValue({
    CPF: '11122233345',
    fullName: 'Employee Test One',
    email: 'firstemployee@email.com',
    password: '$2b$10$pbDDdVY3CSyI2OBYbaAOUe/RWRxbW57hREulRcyb0UdlIiCW.U8ai',
    salary: 4500,
    createdAt: new Date(),
    updatedAt: new Date(),
    company: 1,
  }),
};
