import { Body, Controller, Post } from '@nestjs/common';
import { ParamId } from '../decorators/param-id.decorator';
import { LoanService } from './loan.service';

@Controller('users/:id/loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  async sendLoanRequest(@ParamId() employeeId: number, @Body() data) {
    const { companyId, amount } = data;

    const request = await this.loanService.loanRequest(
      companyId,
      amount,
      employeeId,
    );
    return request;
  }
}
