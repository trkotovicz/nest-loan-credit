import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../src/company/entity/company.entity';
import { EmployeeService } from '../src/employee/employee.service';
import { EmployeeEntity } from '../src/employee/entity/employee.entity';
import { CreateLoanDTO } from '../src/loan/dto/create-loan.dto';
import { LoanEntity, LoanStatus } from '../src/loan/entity/loan.entity';
import { PaymentApiService } from '../src/loan/external-services/payment-api.service';
import { ScoreApiService } from '../src/loan/external-services/score-api.service';
import { LoanService } from '../src/loan/loan.service';
import {
  employeeServiceMock,
  loanRepositoryMock,
  paymentApiServiceMock,
  scoreApiServiceMock,
} from './mocks/loan-repository.mock';

describe('LoanService', () => {
  let loanService: LoanService;
  let loanRepository: Repository<LoanEntity>;
  let scoreApiService: ScoreApiService;
  let paymentApiService: PaymentApiService;

  beforeEach(async () => {
    const createLoanRepositoryMock = () => ({
      insert: jest.fn().mockResolvedValue(loanRepositoryMock),
    });

    const loanRepositoryProvider = {
      provide: getRepositoryToken(LoanEntity),
      useFactory: createLoanRepositoryMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanService,
        { provide: EmployeeService, useValue: employeeServiceMock },
        { provide: ScoreApiService, useValue: scoreApiServiceMock },
        { provide: PaymentApiService, useValue: paymentApiServiceMock },
        loanRepositoryProvider,
      ],
    }).compile();

    loanService = module.get<LoanService>(LoanService);
    loanRepository = module.get<Repository<LoanEntity>>(
      getRepositoryToken(LoanEntity),
    );
    scoreApiService = module.get<ScoreApiService>(ScoreApiService);
    paymentApiService = module.get<PaymentApiService>(PaymentApiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(loanService).toBeDefined();
    expect(loanRepository).toBeDefined();
  });

  describe('getScore', () => {
    it('should return an object with the employee score', async () => {
      const scoreData = { score: 580 };
      (scoreApiService.fetchData as jest.Mock).mockResolvedValueOnce(scoreData);

      const result = await loanService.getScore();

      expect(result).toEqual(scoreData);
      expect(scoreApiService.fetchData).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPaymentStatus', () => {
    it('should return an object with the status of payment service', async () => {
      const paymentStatusData = { message: true };
      (paymentApiService.fetchData as jest.Mock).mockResolvedValueOnce(
        paymentStatusData,
      );

      const result = await loanService.getPaymentStatus();

      expect(result).toEqual(paymentStatusData);
      expect(paymentApiService.fetchData).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEmployeeCompany', () => {
    it('should return true when the employee is associated with the provided company', async () => {
      const employeeId = 1;
      const companyId = 1;
      const employee = new EmployeeEntity();
      employee.company = new CompanyEntity();
      employee.company.companyId = 1;
      jest.spyOn(employeeServiceMock, 'readOne').mockResolvedValue(employee);

      const result = await loanService.getEmployeeCompany(
        employeeId,
        companyId,
      );

      expect(result).toBe(true);
      expect(employeeServiceMock.readOne).toHaveBeenCalledWith(employeeId);
    });

    it('should throw a BadRequestException when the employee is not associated with the provided company', async () => {
      const employeeId = 1;
      const companyId = 2;
      const employee = new EmployeeEntity();
      employee.company = new CompanyEntity();
      employee.company.companyId = 1;
      jest.spyOn(employeeServiceMock, 'readOne').mockResolvedValue(employee);

      const testFunction = async () => {
        await loanService.getEmployeeCompany(employeeId, companyId);
      };

      await expect(testFunction()).rejects.toThrow(BadRequestException);
      expect(employeeServiceMock.readOne).toHaveBeenCalledWith(employeeId);
    });
  });

  describe('getEmployeeSalary', () => {
    it('should return the salary of the employee', async () => {
      const employeeId = 1;
      const expectedSalary = 3000;
      const employee = new EmployeeEntity();
      employee.salary = expectedSalary;

      jest.spyOn(employeeServiceMock, 'readOne').mockResolvedValue(employee);

      const result = await loanService.getEmployeeSalary(employeeId);

      expect(result).toBe(expectedSalary);
      expect(employeeServiceMock.readOne).toHaveBeenCalledWith(employeeId);
    });
  });

  describe('verifyIfHasScore', () => {
    it('should return true if the employee has a score of 400 and a salary of 2000', async () => {
      const employeeId = 1;
      const salary = 2000;
      const score = 400;

      jest.spyOn(loanService, 'getScore').mockResolvedValue({ score });
      jest.spyOn(loanService, 'getEmployeeSalary').mockResolvedValue(salary);

      const result = await loanService.verifyIfHasScore(employeeId);

      expect(result).toBe(true);
      expect(loanService.getScore).toHaveBeenCalledTimes(1);
      expect(loanService.getEmployeeSalary).toHaveBeenCalledWith(employeeId);
    });

    it('should return true if the employee has a score of 500 and a salary of 4000', async () => {
      const employeeId = 1;
      const salary = 4000;
      const score = 500;

      jest.spyOn(loanService, 'getScore').mockResolvedValue({ score });
      jest.spyOn(loanService, 'getEmployeeSalary').mockResolvedValue(salary);

      const result = await loanService.verifyIfHasScore(employeeId);

      expect(result).toBe(true);
      expect(loanService.getScore).toHaveBeenCalledTimes(1);
      expect(loanService.getEmployeeSalary).toHaveBeenCalledWith(employeeId);
    });

    it('should return false if the employee has a score of 300 and a salary of 2000', async () => {
      const employeeId = 1;
      const salary = 2000;
      const score = 300;

      jest.spyOn(loanService, 'getScore').mockResolvedValue({ score });
      jest.spyOn(loanService, 'getEmployeeSalary').mockResolvedValue(salary);

      const result = await loanService.verifyIfHasScore(employeeId);

      expect(result).toBe(false);
      expect(loanService.getScore).toHaveBeenCalledTimes(1);
      expect(loanService.getEmployeeSalary).toHaveBeenCalledWith(employeeId);
    });
  });

  describe('verifyAmountLimit', () => {
    it('should calculate the amount limit correctly based on the employee salary', async () => {
      const employeeId = 1;
      const salary = 5000;
      const amount = 10000;
      const expectedAmountAvailable = salary * 0.35 * 60; // 35% of the salary times 60 months

      jest.spyOn(loanService, 'getEmployeeSalary').mockResolvedValue(salary);

      const result = await loanService.verifyAmountLimit(employeeId, amount);

      expect(result.amountAvailable).toBe(expectedAmountAvailable);
      expect(result.monthlyFinancingApproved).toBe(salary * 0.35);
      expect(result.amountRequested).toBe(amount);
      expect(result.monthlyFinancingRequested).toBe(amount / 60);
      expect(loanService.getEmployeeSalary).toHaveBeenCalledWith(employeeId);
    });
  });

  describe('loanRequest', () => {
    it('should create a loan request with pending status if score is too low', async () => {
      const employeeId = 1;
      const companyId = 1;
      const amount = 5000;

      loanService.getEmployeeCompany = jest.fn().mockResolvedValueOnce(true);
      loanService.getPaymentStatus = jest
        .fn()
        .mockResolvedValueOnce({ message: true });
      loanService.verifyIfHasScore = jest.fn().mockResolvedValueOnce(false);

      await expect(
        loanService.loanRequest(companyId, amount, employeeId),
      ).rejects.toThrow(BadRequestException);

      expect(loanService.getEmployeeCompany).toHaveBeenCalledWith(
        employeeId,
        companyId,
      );
      expect(loanService.getPaymentStatus).toHaveBeenCalledTimes(1);
      expect(loanService.verifyIfHasScore).toHaveBeenCalledWith(employeeId);
      expect(employeeServiceMock.readOne).toHaveBeenCalledWith(employeeId);
      expect(loanRepository.insert).toHaveBeenCalledWith({
        employee: expect.any(EmployeeEntity),
        amount,
        status: LoanStatus.rejected,
      });
    });

    it('should create a loan request with pending status if amount exceeds available limit', async () => {
      const employeeId = 1;
      const companyId = 1;
      const amount = 1000000;

      loanService.getEmployeeCompany = jest.fn().mockResolvedValueOnce(true);
      loanService.getPaymentStatus = jest
        .fn()
        .mockResolvedValueOnce({ message: false });
      loanService.verifyIfHasScore = jest.fn().mockResolvedValueOnce(true);
      loanService.verifyAmountLimit = jest.fn().mockResolvedValueOnce({
        amountAvailable: 50000,
        monthlyFinancingApproved: 2000,
        amountRequested: 1000000,
        monthlyFinancingRequested: 16666.67,
      });

      const result = await loanService.loanRequest(
        companyId,
        amount,
        employeeId,
      );

      expect(result.statusPayment).toEqual(LoanStatus.rejected);

      expect(loanService.getEmployeeCompany).toHaveBeenCalledWith(
        employeeId,
        companyId,
      );
      expect(loanService.getPaymentStatus).toHaveBeenCalledTimes(1);
      expect(loanService.verifyIfHasScore).toHaveBeenCalledWith(employeeId);
      expect(loanService.verifyAmountLimit).toHaveBeenCalledWith(
        employeeId,
        amount,
      );
      expect(employeeServiceMock.readOne).toHaveBeenCalledWith(employeeId);
      expect(loanRepository.insert).toHaveBeenCalledWith({
        employee: expect.any(EmployeeEntity),
        amount,
        status: LoanStatus.rejected,
      });
    });

    it('should create a loan request with pending status if payment status is false', async () => {
      const employeeId = 1;
      const companyId = 1;
      const amount = 5000;

      loanService.getEmployeeCompany = jest.fn().mockResolvedValueOnce(true);
      loanService.getPaymentStatus = jest
        .fn()
        .mockResolvedValueOnce({ message: false });
      loanService.verifyIfHasScore = jest.fn().mockResolvedValueOnce(true);
      loanService.verifyAmountLimit = jest.fn().mockResolvedValueOnce({
        amountAvailable: 10000,
        monthlyFinancingApproved: 500,
        amountRequested: 5000,
        monthlyFinancingRequested: 83.33,
      });

      const result = await loanService.loanRequest(
        companyId,
        amount,
        employeeId,
      );

      expect(result).toEqual({
        amountAvailable: 10000,
        monthlyFinancingApproved: 500,
        amountRequested: 5000,
        monthlyFinancingRequested: 83.33,
        statusPayment: LoanStatus.pending,
      });
      expect(loanService.getEmployeeCompany).toHaveBeenCalledWith(
        employeeId,
        companyId,
      );
      expect(loanService.getPaymentStatus).toHaveBeenCalledTimes(1);
      expect(loanService.verifyIfHasScore).toHaveBeenCalledWith(employeeId);
      expect(loanService.verifyAmountLimit).toHaveBeenCalledWith(
        employeeId,
        amount,
      );
      expect(employeeServiceMock.readOne).toHaveBeenCalledWith(employeeId);
      expect(loanRepository.insert).toHaveBeenCalledWith({
        employee: expect.any(EmployeeEntity),
        amount,
        status: LoanStatus.pending,
      });
    });

    it('should create a loan request with approved status if all conditions are met', async () => {
      const employeeId = 1;
      const companyId = 1;
      const amount = 5000;

      loanService.getEmployeeCompany = jest.fn().mockResolvedValueOnce(true);
      loanService.getPaymentStatus = jest
        .fn()
        .mockResolvedValueOnce({ message: true });
      loanService.verifyIfHasScore = jest.fn().mockResolvedValueOnce(true);
      loanService.verifyAmountLimit = jest.fn().mockResolvedValueOnce({
        amountAvailable: 10000,
        monthlyFinancingApproved: 500,
        amountRequested: 5000,
        monthlyFinancingRequested: 83.33,
      });

      const result = await loanService.loanRequest(
        companyId,
        amount,
        employeeId,
      );

      expect(result).toEqual({
        amountAvailable: 10000,
        monthlyFinancingApproved: 500,
        amountRequested: 5000,
        monthlyFinancingRequested: 83.33,
        statusPayment: LoanStatus.approved,
      });
      expect(loanService.getEmployeeCompany).toHaveBeenCalledWith(
        employeeId,
        companyId,
      );
      expect(loanService.getPaymentStatus).toHaveBeenCalledTimes(1);
      expect(loanService.verifyIfHasScore).toHaveBeenCalledWith(employeeId);
      expect(loanService.verifyAmountLimit).toHaveBeenCalledWith(
        employeeId,
        amount,
      );
      expect(employeeServiceMock.readOne).toHaveBeenCalledWith(employeeId);
      expect(loanRepository.insert).toHaveBeenCalledWith({
        employee: expect.any(EmployeeEntity),
        amount,
        status: LoanStatus.approved,
      });
    });
  });

  describe('saveRequest', () => {
    it('should save the loan request with the correct data', async () => {
      const createLoanDTO: CreateLoanDTO = {
        employee: 1,
        amount: 5000,
        status: LoanStatus.pending,
      };

      const companyEntityMock: CompanyEntity = {
        companyId: 1,
        CNPJ: '11222333000145',
        companyName: 'company 1',
        email: 'user@company1.com',
        password:
          '$2b$10$pbDDdVY3CSyI2OBYbaAOUe/RWRxbW57hREulRcyb0UdlIiCW.U8ai',
        createdAt: new Date(),
        updatedAt: new Date(),
        employees: [],
      };

      const employeeEntityMock: EmployeeEntity = {
        CPF: '11122233345',
        fullName: 'Employee Test One',
        email: 'firstemployee@email.com',
        password:
          '$2b$10$pbDDdVY3CSyI2OBYbaAOUe/RWRxbW57hREulRcyb0UdlIiCW.U8ai',
        salary: 4500,
        createdAt: new Date(),
        updatedAt: new Date(),
        company: companyEntityMock,
        employeeId: 1,
        loans: [],
      };

      employeeServiceMock.readOne.mockResolvedValue(employeeEntityMock);

      await loanService.saveLoanRequest(createLoanDTO);

      expect(employeeServiceMock.readOne).toHaveBeenCalledWith(
        createLoanDTO.employee,
      );
      expect(loanRepository.insert).toHaveBeenCalledWith({
        employee: employeeEntityMock,
        amount: createLoanDTO.amount,
        status: createLoanDTO.status,
      });
    });
  });
});
