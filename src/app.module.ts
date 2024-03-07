import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from './company/company.module';
import { DBConfig } from './config/db.config';
import { EmployeeModule } from './employee/employee.module';
import { LoanModule } from './loan/loan.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV === 'test' ? '.env.test' : '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DBConfig,
      inject: [DBConfig],
    }),
    forwardRef(() => CompanyModule),
    forwardRef(() => EmployeeModule),
    forwardRef(() => LoanModule),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
