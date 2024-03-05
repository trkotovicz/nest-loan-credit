import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from '../employee/employee.module';
import { UserIdCheckMiddleware } from '../middlewares/user-id-check.middleware';
import { LoanEntity } from './entity/loan.entity';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { PaymentApiService } from './external-services/payment-api.service';
import { ScoreApiService } from './external-services/score-api.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoanEntity]),
    forwardRef(() => EmployeeModule),
  ],
  controllers: [LoanController],
  providers: [LoanService, PaymentApiService, ScoreApiService],
  exports: [LoanService],
})
export class LoanModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdCheckMiddleware).forRoutes({
      path: 'users/:id/loan',
      method: RequestMethod.ALL,
    });
  }
}
