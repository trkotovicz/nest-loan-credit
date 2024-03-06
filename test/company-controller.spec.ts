import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from '../src/company/company.controller';
import { CompanyService } from '../src/company/company.service';
import { CreateCompanyDTO } from '../src/company/dto/create-company.dto';
import { PatchPasswordCompanyDTO } from '../src/company/dto/patch-password-company.dto';
import { PutCompanyDTO } from '../src/company/dto/put-company.dto';
import {
  companyEntityList,
  newCompanyEntity,
  updatedCompanyEntity,
} from './mocks/company-list';

describe('CompanyController', () => {
  let companyController: CompanyController;
  let companyService: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: {
            create: jest.fn().mockResolvedValue(newCompanyEntity),
            list: jest.fn().mockResolvedValue(companyEntityList),
            readOne: jest.fn().mockResolvedValue(companyEntityList[0]),
            update: jest.fn().mockResolvedValue(updatedCompanyEntity),
            updatePassword: jest
              .fn()
              .mockResolvedValue('Senha alterada com sucesso'),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    companyController = module.get<CompanyController>(CompanyController);
    companyService = module.get<CompanyService>(CompanyService);
  });

  it('Should be defined', () => {
    expect(companyController).toBeDefined();
    expect(companyService).toBeDefined();
  });

  describe('create', () => {
    const body: CreateCompanyDTO = {
      CNPJ: '99999999000199',
      companyName: 'Company Test',
      email: 'usertest@company.com',
      password: 'P@ssword123',
    };
    it('Should create a new company successfully', async () => {
      const result = await companyController.create(body);

      expect(result).toEqual(newCompanyEntity);
      expect(companyService.create).toHaveBeenCalledTimes(1);
      expect(companyService.create).toHaveBeenCalledWith(body);
    });

    it('Should throw an exception', () => {
      jest.spyOn(companyService, 'create').mockRejectedValueOnce(new Error());

      expect(companyController.create(body)).rejects.toThrow();
    });
  });

  describe('list', () => {
    it('Should return a list of companies', async () => {
      const result = await companyController.list();

      expect(result).toEqual(companyEntityList);
      expect(companyService.list).toHaveBeenCalledTimes(1);
    });

    it('Should throw an exception', () => {
      jest.spyOn(companyService, 'list').mockRejectedValueOnce(new Error());

      expect(companyController.list()).rejects.toThrow();
    });
  });

  describe('readOne', () => {
    it('Should return a company successfully', async () => {
      const result = await companyController.readOne(1);

      expect(result).toEqual(companyEntityList[0]);
      expect(companyService.readOne).toHaveBeenCalledTimes(1);
      expect(companyService.readOne).toHaveBeenCalledWith(1);
    });

    it('Should throw an exception', () => {
      jest.spyOn(companyService, 'readOne').mockRejectedValueOnce(new Error());

      expect(companyController.readOne(1)).rejects.toThrow();
    });
  });

  describe('update', () => {
    const body: PutCompanyDTO = {
      CNPJ: '99999999000199',
      companyName: 'Company Test Updated',
      email: 'updated@company.com',
      password: 'P@ssword123',
    };
    const paramId = 1;
    it('should update a company item successfully', async () => {
      const result = await companyController.update(body, paramId);

      expect(result).toEqual(updatedCompanyEntity);
      expect(companyService.update).toHaveBeenCalledTimes(1);
      expect(companyService.update).toHaveBeenCalledWith(paramId, body);
    });

    it('Should throw an exception', () => {
      jest.spyOn(companyService, 'update').mockRejectedValueOnce(new Error());

      expect(companyController.update(body, paramId)).rejects.toThrow();
    });
  });

  describe('updatePassword', () => {
    const body: PatchPasswordCompanyDTO = {
      password: 'P@ssword123',
    };

    it('should update password from a company user successfully', async () => {
      const result = await companyController.updatePassword(body, 1);

      expect(result).toEqual('Senha alterada com sucesso');
      expect(companyService.updatePassword).toHaveBeenCalledTimes(1);
      expect(companyService.updatePassword).toHaveBeenCalledWith(1, body);
    });

    it('Should throw an exception', () => {
      jest
        .spyOn(companyService, 'updatePassword')
        .mockRejectedValueOnce(new Error());

      expect(companyController.updatePassword(body, 1)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete a company successfully', async () => {
      const result = await companyController.delete(1);

      expect(result).toEqual(true);
      expect(companyService.delete).toHaveBeenCalledTimes(1);
      expect(companyService.delete).toHaveBeenCalledWith(1);
    });

    it('Should throw an exception', () => {
      jest.spyOn(companyService, 'delete').mockRejectedValueOnce(new Error());

      expect(companyController.delete(1)).rejects.toThrow();
    });
  });
});
