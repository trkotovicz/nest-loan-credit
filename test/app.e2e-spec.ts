import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateCompanyDTO } from '../src/company/dto/create-company.dto';
import { PutCompanyDTO } from '../src/company/dto/put-company.dto';
import { CreateEmployeeDTO } from '../src/employee/dto/create-employee.dto';
import { PutEmployeeDTO } from '../src/employee/dto/put-employee.dto';
import { EmployeeEntity } from '../src/employee/entity/employee.entity';
import { AppModule } from './../src/app.module';

const createCompanyDTO: CreateCompanyDTO = {
  CNPJ: '99999999000199',
  companyName: 'Company Test E2E',
  email: 'company@test.com',
  password: 'P@ssword123',
};
const updateCompanyDTO: PutCompanyDTO = {
  CNPJ: '99999999000199',
  companyName: 'Updated Company Test E2E',
  email: 'updated@test.com',
  password: 'P@ssword123',
};
const createEmployeeDTO: CreateEmployeeDTO = {
  CPF: '11122233345',
  fullName: 'Employee Test',
  email: 'employee@test.com',
  password: 'P@ssword123',
  salary: 4000,
  company: 0,
};
const updateemployeeDTO: PutEmployeeDTO = {
  CPF: '11122233345',
  fullName: 'Updated Employee Test',
  email: 'updated@test.com',
  password: 'P@ssword123',
  salary: 4500,
  company: 0,
};

describe('App (e2e)', () => {
  let app: INestApplication;
  let companyId: number;
  let employeeId: number;
  let employeeData: EmployeeEntity;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  describe('Company (e2e)', () => {
    it('Should create a new company with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/companies')
        .send(createCompanyDTO);

      expect(response.statusCode).toEqual(201);
      expect(typeof response.body).toEqual('object');

      companyId = response.body.companyId;
    });

    it('Should not be able to create a company with CNPJ already in use', async () => {
      const response = await request(app.getHttpServer())
        .post('/companies')
        .send(createCompanyDTO);

      expect(response.statusCode).toEqual(400);
    });

    it('Should return a list with all companies', async () => {
      const response = await request(app.getHttpServer())
        .get('/companies')
        .send();

      expect(response.statusCode).toEqual(200);
      expect(typeof response.body).toEqual('object');
    });

    it('Should return an especific company', async () => {
      const response = await request(app.getHttpServer())
        .get(`/companies/${companyId}`)
        .send();

      expect(response.statusCode).toEqual(200);
      expect(response.body).toBeDefined();
      expect(response.body.companyId).toEqual(companyId);
    });

    it('Should be able to updated a company', async () => {
      const response = await request(app.getHttpServer())
        .put(`/companies/${companyId}`)
        .send(updateCompanyDTO);

      expect(response.statusCode).toEqual(200);
      expect(response.body.companyName).toEqual(updateCompanyDTO.companyName);
      expect(response.body.email).toEqual(updateCompanyDTO.email);

      const createdAt = new Date(response.body.createdAt);
      const updatedAt = new Date(response.body.updatedAt);

      expect(createdAt).not.toEqual(updatedAt);
    });

    it('Should be able to updated password from a company', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/companies/${companyId}`)
        .send({ password: '123456!Abc' });

      expect(response.statusCode).toEqual(200);
      expect(response.text).toEqual('Senha alterada com sucesso');
    });

    it('Should be able to delete a company', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/companies/${companyId}`)
        .send();

      expect(response.statusCode).toEqual(200);
      expect(response.text).toEqual('Empresa deletada com sucesso');
    });

    it('Should not be able to delete a company with an inexistent id', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/companies/${150}`)
        .send();

      const parsed = JSON.parse(response.text);

      expect(response.statusCode).toEqual(404);
      expect(parsed.message).toEqual('A empresa com id 150 não existe.');
      expect(parsed.error).toEqual('Not Found');
    });
  });

  describe('Employee (e2e)', () => {
    it('Should be able to create a new employee successfully', async () => {
      const saveCompany = await request(app.getHttpServer())
        .post('/companies')
        .send(createCompanyDTO);
      companyId = saveCompany.body.companyId;
      createEmployeeDTO.company = companyId;

      const response = await request(app.getHttpServer())
        .post('/employees')
        .send(createEmployeeDTO);

      expect(response.statusCode).toEqual(201);
      expect(typeof response.body).toEqual('object');

      employeeId = response.body.employeeId;
      employeeData = response.body;
    });

    it('Should not be able to create an employee with CPF already in use', async () => {
      const response = await request(app.getHttpServer())
        .post('/employees')
        .send(createEmployeeDTO);

      expect(response.statusCode).toEqual(400);
    });

    it('Should return a list with all employees', async () => {
      const response = await request(app.getHttpServer())
        .get('/employees')
        .send();

      expect(response.statusCode).toEqual(200);
      expect(typeof response.body).toEqual('object');
    });

    it('Should return an especific employee by it`s id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/employees/${employeeId}`)
        .send();

      expect(response.statusCode).toEqual(200);
      expect(response.body).toBeDefined();
      expect(response.body.employeeId).toEqual(employeeId);
    });

    it('Should be able to updated an employee', async () => {
      const response = await request(app.getHttpServer())
        .put(`/employees/${employeeId}`)
        .send({ ...updateemployeeDTO, company: employeeData.company });

      expect(response.statusCode).toEqual(200);
      expect(response.body.fullName).toEqual(updateemployeeDTO.fullName);
      expect(response.body.email).toEqual(updateemployeeDTO.email);

      const createdAt = new Date(response.body.createdAt);
      const updatedAt = new Date(response.body.updatedAt);

      expect(createdAt).not.toEqual(updatedAt);
    });

    it('Should be able to updated password from an employee', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/employees/${employeeId}`)
        .send({ password: '123456!Abc' });

      expect(response.statusCode).toEqual(200);
      expect(response.text).toEqual('Senha alterada com sucesso.');
    });

    it('Should be able to delete an employee', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/employees/${employeeId}`)
        .send();

      expect(response.statusCode).toEqual(200);
      expect(response.text).toEqual('Funcionário deletado com sucesso.');
    });

    it('Should not be able to delete an employee with an inexistent id', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/employees/${150}`)
        .send();

      const parsed = JSON.parse(response.text);

      expect(response.statusCode).toEqual(404);
      expect(parsed.message).toEqual('O funcionário com id 150 não existe.');
      expect(parsed.error).toEqual('Not Found');
    });
  });
});

// "pretest:e2e": "cross-env ENV=test npm run db:drop && cross-env ENV=test npm run db:create && cross-env ENV=test npm run migration:run",
// "test:e2e": "cross-env ENV=test jest --config ./test/jest-e2e.json",
// "posttest:e2e": "cross-env ENV=test npm run db:drop"
