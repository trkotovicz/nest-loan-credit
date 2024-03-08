import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ParamId } from '../decorators/param-id.decorator';
import { ErrorSwagger } from '../swagger/error.swagger';
import {
  LoanPayloadSwagger,
  LoanResponseSwagger,
} from '../swagger/loan.swagger';
import { LoanService } from './loan.service';

@Controller('users/:id/loan')
@ApiTags('Loans')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a loan request' })
  @ApiParam({ name: 'employeeId', type: 'number' })
  @ApiBody({ type: LoanPayloadSwagger })
  @ApiResponse({
    status: 201,
    description: 'Loan Response',
    type: LoanResponseSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Inputs',
    type: ErrorSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Employee Not Found',
    type: ErrorSwagger,
  })
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
