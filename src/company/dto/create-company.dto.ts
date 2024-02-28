import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { IsCNPJConstraint } from 'src/validators/cnpj.validator';

export class CreateCompanyDTO {
  @IsNotEmpty()
  @Validate(IsCNPJConstraint)
  CNPJ: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(127)
  companyName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({ minLength: 8 })
  password: string;
}