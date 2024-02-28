import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from './company/entity/company.entity';
import { EmployeeEntity } from './employee/entity/employee.entity';
import { LoanEntity } from './loan/entity/loan.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [CompanyEntity, EmployeeEntity, LoanEntity],
      synchronize: process.env.ENV === 'development',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
