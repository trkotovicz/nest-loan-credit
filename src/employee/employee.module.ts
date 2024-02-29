import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from 'src/company/company.module';
import { UserIdCheckMiddleware } from 'src/middlewares/user-id-check.middleware';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { EmployeeEntity } from './entity/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeEntity]),
    forwardRef(() => CompanyModule),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdCheckMiddleware).forRoutes({
      path: 'employees/:id',
      method: RequestMethod.ALL,
    });
  }
}
