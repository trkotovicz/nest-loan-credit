import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { LoanStatus } from '../entity/loan.entity';

export class CreateLoanDTO {
  @IsNotEmpty()
  @IsDecimal({ force_decimal: true, decimal_digits: '2' })
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsEnum(LoanStatus)
  status: LoanStatus;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  employee: number;
}
