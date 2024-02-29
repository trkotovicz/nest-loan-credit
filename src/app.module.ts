import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBConfig } from './config/db.config';
import { CompanyModule } from './company/company.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: DBConfig,
      inject: [DBConfig],
    }),
    forwardRef(() => CompanyModule),
    forwardRef(() => EmployeeModule),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
