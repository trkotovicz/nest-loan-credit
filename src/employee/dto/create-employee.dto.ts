import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  Validate,
  IsDecimal,
  Length,
} from 'class-validator';
import { IsCPFConstraint } from 'src/validators/cpf.validator';

export class CreateEmployeeDTO {
  @IsNotEmpty()
  @Validate(IsCPFConstraint)
  @Length(11)
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
  @IsDecimal({ decimal_digits: '2' })
  salary: number;

  @IsNotEmpty()
  company: number;
}
