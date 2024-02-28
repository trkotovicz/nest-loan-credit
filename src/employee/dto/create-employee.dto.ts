import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  Validate,
  IsDecimal,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { IsCPFConstraint } from 'src/validators/cpf.validator';

export class CreateEmployeeDTO {
  @IsNotEmpty()
  @Validate(IsCPFConstraint)
  CPF: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(127)
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({ minLength: 8 })
  password: string;

  @IsNotEmpty()
  @IsDecimal({ force_decimal: true, decimal_digits: '2' })
  @IsPositive()
  salary: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  company: number;
}
