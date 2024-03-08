import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { LoanStatus } from '../entity/loan.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoanDTO {
  @IsNotEmpty()
  @IsDecimal({ force_decimal: true, decimal_digits: '2' })
  @IsPositive()
  @ApiProperty()
  amount: number;

  @IsNotEmpty()
  @IsEnum(LoanStatus)
  @ApiProperty()
  status: LoanStatus;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  employee: number;
}
