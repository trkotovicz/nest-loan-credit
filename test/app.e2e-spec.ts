import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateCompanyDTO } from '../src/company/dto/create-company.dto';
import { PutCompanyDTO } from '../src/company/dto/put-company.dto';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;
  let companyId: number;

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

  describe('CompanyController (e2e)', () => {
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

    it('Should create a new company', async () => {
      const response = await request(app.getHttpServer())
        .post('/companies')
        .send(createCompanyDTO);

      expect(response.statusCode).toEqual(201);
      expect(typeof response.body).toEqual('object');

      companyId = response.body.companyId;
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

    it('Should be able to updated a company', async () => {
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
  });
});

// "pretest:e2e": "cross-env ENV=test npm run db:drop && cross-env ENV=test npm run db:create && cross-env ENV=test npm run migration:run",
// "test:e2e": "cross-env ENV=test jest --config ./test/jest-e2e.json",
// "posttest:e2e": "cross-env ENV=test npm run db:drop"
