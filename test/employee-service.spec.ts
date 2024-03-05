import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyService } from '../src/company/company.service';
import { CreateEmployeeDTO } from '../src/employee/dto/create-employee.dto';
import { PutEmployeeDTO } from '../src/employee/dto/put-employee.dto';
import { EmployeeService } from '../src/employee/employee.service';
import { EmployeeEntity } from '../src/employee/entity/employee.entity';
import { companyEntityList } from './mocks/company-list';
import { employeeList } from './mocks/employee-list';
import {
  companyInejectedRepositoryMock,
  employeeRepositoryMock,
} from './mocks/employee-repository.mock';

const companyServiceMock = {
  readOne: jest.fn().mockResolvedValue(companyEntityList[0]),
};

describe('EmployeeService', () => {
  let employeeService: EmployeeService;
  let employeeRepository: Repository<EmployeeEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        { provide: CompanyService, useValue: companyServiceMock },
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

  describe('list', () => {
    it('should return a list of employees', async () => {
      const result = await employeeService.list();

      expect(result).toEqual(employeeList);
      expect(employeeRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest.spyOn(employeeRepository, 'find').mockRejectedValueOnce(new Error());

      expect(employeeService.list()).rejects.toThrow();
    });
  });

  describe('readOne', () => {
    it('should return a employ', async () => {
      jest.spyOn(employeeRepository, 'exists').mockResolvedValueOnce(true);

      const findOneSpy = jest
        .spyOn(employeeRepository, 'findOne')
        .mockResolvedValueOnce(employeeList[0]);

      const result = await employeeService.readOne(1);

      expect(result).toEqual(employeeList[0]);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a not found exception', () => {
      jest
        .spyOn(employeeRepository, 'findOne')
        .mockRejectedValueOnce(new Error());

      expect(employeeService.exists(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a employee successfully', async () => {
      const createEmployeeDTO: CreateEmployeeDTO = {
        CPF: '12312312345',
        fullName: 'Employee Test',
        email: 'test@example.com',
        password: 'P@assword123',
        salary: 2500,
        company: 1,
      };

      (employeeRepository.exists as jest.Mock).mockResolvedValue(false);
      (employeeRepository.insert as jest.Mock).mockResolvedValue({
        generatedMaps: [{ id: 1 }],
      });

      (companyServiceMock.readOne as jest.Mock).mockResolvedValue(
        companyEntityList[0],
      );

      const result = await employeeService.create(createEmployeeDTO);

      expect(result).toEqual({
        ...createEmployeeDTO,
        id: 1,
        password: expect.any(String),
      });
      expect(employeeRepository.exists).toHaveBeenCalledWith({
        where: [
          { email: createEmployeeDTO.email },
          { CPF: createEmployeeDTO.CPF },
        ],
      });
      expect(employeeRepository.insert).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if CPF or email already exists', async () => {
      (employeeRepository.exists as jest.Mock).mockResolvedValue(true);

      await expect(
        employeeService.create({
          CPF: '12312312345',
          fullName: 'Employee Test',
          email: 'test@example.com',
          password: 'P@assword123',
          salary: 2500,
          company: 1,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update an employee successfully', async () => {
      // const employeeId = 1;
      // const putEmployeeDTO: PutEmployeeDTO = {
      //   fullName: 'Updated Employee Test',
      //   email: 'employee@update.com',
      //   password: 'updatepassword',
      //   CPF: '99999999900',
      //   salary: 5000,
      // };
      // (employeeRepository.exists as jest.Mock).mockResolvedValue(true);
      // (companyServiceMock.readOne as jest.Mock).mockResolvedValue(
      //   companyEntityList[0],
      // );
      // (employeeRepository.update as jest.Mock).mockResolvedValue({
      //   affected: 1,
      // });
      // const result = await employeeService.update(employeeId, putEmployeeDTO);
      // expect(result).toEqual(putEmployeeDTO);
    });

    it('should throw NotFoundException id employee does not exists', async () => {
      const employeeId = 1;
      const putEmployeeDTO: PutEmployeeDTO = {
        fullName: 'Updated Employee Test',
        email: 'employee@update.com',
        password: 'updatepassword',
        CPF: '99999999900',
        salary: 5000,
      };

      (employeeRepository.exists as jest.Mock).mockResolvedValue(false);

      await expect(
        employeeService.update(employeeId, putEmployeeDTO),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an employee successfully', async () => {
      jest.spyOn(employeeRepository, 'exists').mockResolvedValueOnce(true);

      const result = await employeeService.delete(1);

      expect(result).toBeUndefined();
      expect(employeeRepository.delete).toHaveBeenCalledTimes(1);
    });
    it('should throw NotDoundException if employee does not exist', async () => {
      (employeeRepository.exists as jest.Mock).mockResolvedValue(false);

      await expect(employeeService.delete(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
