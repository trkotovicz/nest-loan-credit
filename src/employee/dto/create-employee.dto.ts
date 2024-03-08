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
import { IsCPFConstraint } from '../../validators/cpf.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDTO {
  @IsNotEmpty()
  @Validate(IsCPFConstraint)
  @Length(11)
  @ApiProperty()
  CPF: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(127)
  @ApiProperty()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({ minLength: 8 })
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2' })
  @ApiProperty()
  salary: number;

  @IsNotEmpty()
  @ApiProperty()
  company: number;
}
