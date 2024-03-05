import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyService } from '../src/company/company.service';
import { CreateCompanyDTO } from '../src/company/dto/create-company.dto';
import { PutCompanyDTO } from '../src/company/dto/put-company.dto';
import { CompanyEntity } from '../src/company/entity/company.entity';
import { companyEntityList } from './mocks/company-list';
import { companyRepositoryMock } from './mocks/company-repository.mock';

describe('CompanyService', () => {
  let companyService: CompanyService;
  let companyRepository: Repository<CompanyEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyService, companyRepositoryMock],
    }).compile();

    companyService = module.get<CompanyService>(CompanyService);
    companyRepository = module.get(getRepositoryToken(CompanyEntity));
  });

  it('Should be defined', () => {
    expect(companyService).toBeDefined();
    expect(companyRepository).toBeDefined();
  });

  describe('list', () => {
    it('should return a list os companies', async () => {
      const result = await companyService.list();

      expect(result).toEqual(companyEntityList);
      expect(companyRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest.spyOn(companyRepository, 'find').mockRejectedValueOnce(new Error());

      expect(companyService.list()).rejects.toThrow();
    });
  });

  describe('readOne', () => {
    it('should return a company', async () => {
      jest.spyOn(companyRepository, 'exists').mockResolvedValueOnce(true);

      const findOneSpy = jest
        .spyOn(companyRepository, 'findOne')
        .mockResolvedValueOnce(companyEntityList[0]);

      const result = await companyService.readOne(1);

      expect(result).toEqual(companyEntityList[0]);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a not found exception', () => {
      jest
        .spyOn(companyRepository, 'findOne')
        .mockRejectedValueOnce(new Error());

      expect(companyService.exists(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a company successfully', async () => {
      const createCompanyDTO: CreateCompanyDTO = {
        CNPJ: '12345678901234',
        companyName: 'Test Company',
        email: 'test@example.com',
        password: 'P@ssword123',
      };

      (companyRepository.exists as jest.Mock).mockResolvedValue(false);
      (companyRepository.insert as jest.Mock).mockResolvedValue({
        generatedMaps: [{ id: 1 }],
      });

      const result = await companyService.create(createCompanyDTO);

      expect(result).toEqual({
        ...createCompanyDTO,
        id: 1,
        password: expect.any(String),
      });
      expect(companyRepository.exists).toHaveBeenCalledWith({
        where: [
          { email: createCompanyDTO.email },
          { CNPJ: createCompanyDTO.CNPJ },
        ],
      });
      expect(companyRepository.insert).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if CNPJ or email already exists', async () => {
      (companyRepository.exists as jest.Mock).mockResolvedValue(true);

      await expect(
        companyService.create({
          CNPJ: '12345678901234',
          companyName: 'Test Company',
          email: 'test@example.com',
          password: 'P@ssword123',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a company successfully', async () => {
      // const companyId = 1;
      // const putCompanyDTO = {
      //   companyName: 'Updated Company Name',
      //   email: 'updated@example.com',
      //   password: 'updatedpassword',
      //   CNPJ: '12345678901234',
      // };
      // jest.spyOn(companyRepository, 'exists').mockResolvedValueOnce(true);
      // const result = await companyService.update(companyId, putCompanyDTO);
      // expect(result).toEqual(putCompanyDTO);
      // expect(companyRepository.exists).toHaveBeenCalledWith(companyId);
      // expect(companyRepository.findOne).toHaveBeenCalledWith(companyId);
      // expect(companyRepository.update).toHaveBeenCalledWith(
      //   companyId,
      //   putCompanyDTO,
      // );
    });

    it('should throw NotFoundException if company does not exist', async () => {
      const companyId = 1;
      const putCompanyDTO: PutCompanyDTO = {
        companyName: 'Updated Company Name',
        email: 'updated@example.com',
        password: 'updatedpassword',
        CNPJ: '12345678901234',
      };

      (companyRepository.exists as jest.Mock).mockResolvedValue(false);

      await expect(
        companyService.update(companyId, putCompanyDTO),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a company successfully', async () => {
      jest.spyOn(companyRepository, 'exists').mockResolvedValueOnce(true);

      const result = await companyService.delete(1);

      expect(result).toBeUndefined();
      expect(companyRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if company does not exist', async () => {
      (companyRepository.exists as jest.Mock).mockResolvedValue(false);

      await expect(companyService.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
