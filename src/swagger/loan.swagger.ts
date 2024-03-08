import { ApiProperty } from '@nestjs/swagger';
import { LoanStatus } from '../loan/entity/loan.entity';

export class LoanPayloadSwagger {
  @ApiProperty()
  companyId: number;
  @ApiProperty()
  amount: number;
}

export class LoanResponseSwagger {
  @ApiProperty()
  amountAvailable: number;
  @ApiProperty()
  monthlyFinancingApproved: number;
  @ApiProperty()
  amountRequested: number;
  @ApiProperty()
  monthlyFinancingRequested: number;
  @ApiProperty()
  statusPayment: LoanStatus;
}
