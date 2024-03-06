import { Test, TestingModule } from '@nestjs/testing';
import { CreateEmployeeDTO } from '../src/employee/dto/create-employee.dto';
import { EmployeeController } from '../src/employee/employee.controller';
import { EmployeeService } from '../src/employee/employee.service';
import {
  employeeList,
  newEmployeeEntity,
  updatedEmployeeEntity,
} from './mocks/employee-list';
import { PutEmployeeDTO } from '../src/employee/dto/put-employee.dto';
import { PatchPasswordEmployeeDTO } from '../src/employee/dto/patch-password-employee.dto';

describe('EmployeeController', () => {
  let employeeController: EmployeeController;
  let employeeService: EmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: {
            create: jest.fn().mockResolvedValue(newEmployeeEntity),
            list: jest.fn().mockResolvedValue(employeeList),
            readOne: jest.fn().mockResolvedValue(employeeList[0]),
            update: jest.fn().mockResolvedValue(updatedEmployeeEntity),
            updatePassword: jest
              .fn()
              .mockResolvedValue('Senha alterada com sucesso'),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    employeeController = module.get<EmployeeController>(EmployeeController);
    employeeService = module.get<EmployeeService>(EmployeeService);
  });

  it('Should be defined', () => {
    expect(employeeController).toBeDefined();
    expect(employeeService).toBeDefined();
  });

  describe('create', () => {
    const body: CreateEmployeeDTO = {
      CPF: '11122233345',
      fullName: 'Employee Test One',
      email: 'firstemployee@email.com',
      password: 'P@ssword123',
      salary: 5000,
      company: 1,
    };
    it('Should create a new company successfully', async () => {
      const result = await employeeController.create(body);

      expect(result).toEqual(newEmployeeEntity);
      expect(employeeService.create).toHaveBeenCalledTimes(1);
      expect(employeeService.create).toHaveBeenCalledWith(body);
    });

    it('Should throw an exception', () => {
      jest.spyOn(employeeService, 'create').mockRejectedValueOnce(new Error());

      expect(employeeController.create(body)).rejects.toThrow();
    });
  });

  describe('list', () => {
    it('Should return a list of employees', async () => {
      const result = await employeeController.list();

      expect(result).toEqual(employeeList);
      expect(employeeService.list).toHaveBeenCalledTimes(1);
    });

    it('Should throw an exception', () => {
      jest.spyOn(employeeService, 'list').mockRejectedValueOnce(new Error());

      expect(employeeController.list()).rejects.toThrow();
    });
  });

  describe('readOne', () => {
    it('Should return an employee successfully', async () => {
      const result = await employeeController.readOne(1);

      expect(result).toEqual(employeeList[0]);
      expect(employeeService.readOne).toHaveBeenCalledTimes(1);
      expect(employeeService.readOne).toHaveBeenCalledWith(1);
    });

    it('Should throw an exception', () => {
      jest.spyOn(employeeService, 'readOne').mockRejectedValueOnce(new Error());

      expect(employeeController.readOne(1)).rejects.toThrow();
    });
  });

  describe('update', () => {
    const body: PutEmployeeDTO = {
      CPF: '11122233345',
      fullName: 'Employee Test',
      email: 'employee@email.com',
      password: 'P@ssword123',
      salary: 5000,
      company: 1,
    };
    const paramId = 1;
    it('should update a company item successfully', async () => {
      const result = await employeeController.update(body, paramId);

      expect(result).toEqual(updatedEmployeeEntity);
      expect(employeeService.update).toHaveBeenCalledTimes(1);
      expect(employeeService.update).toHaveBeenCalledWith(paramId, body);
    });

    it('Should throw an exception', () => {
      jest.spyOn(employeeService, 'update').mockRejectedValueOnce(new Error());

      expect(employeeController.update(body, paramId)).rejects.toThrow();
    });
  });

  describe('updatePassword', () => {
    const body: PatchPasswordEmployeeDTO = {
      password: 'P@ssword123',
    };

    it('should update password from a company user successfully', async () => {
      const result = await employeeController.updatePassword(body, 1);

      expect(result).toEqual('Senha alterada com sucesso');
      expect(employeeService.updatePassword).toHaveBeenCalledTimes(1);
      expect(employeeService.updatePassword).toHaveBeenCalledWith(1, body);
    });

    it('Should throw an exception', () => {
      jest
        .spyOn(employeeService, 'updatePassword')
        .mockRejectedValueOnce(new Error());

      expect(employeeController.updatePassword(body, 1)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete a company successfully', async () => {
      const result = await employeeController.delete(1);

      expect(result).toEqual(true);
      expect(employeeService.delete).toHaveBeenCalledTimes(1);
      expect(employeeService.delete).toHaveBeenCalledWith(1);
    });

    it('Should throw an exception', () => {
      jest.spyOn(employeeService, 'delete').mockRejectedValueOnce(new Error());

      expect(employeeController.delete(1)).rejects.toThrow();
    });
  });
});
