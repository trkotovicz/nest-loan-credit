import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { CompanyEntity } from '../company/entity/company.entity';
import { EmployeeEntity } from '../employee/entity/employee.entity';
import { LoanEntity } from '../loan/entity/loan.entity';

@Injectable()
export class DBConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [CompanyEntity, EmployeeEntity, LoanEntity],
      synchronize: true,
    };
  }
}
