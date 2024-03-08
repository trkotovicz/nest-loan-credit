import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { IsCNPJConstraint } from '../../validators/cnpj.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDTO {
  @IsNotEmpty()
  @Length(14)
  @Validate(IsCNPJConstraint)
  @ApiProperty()
  CNPJ: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(127)
  @ApiProperty()
  companyName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({ minLength: 8 })
  @ApiProperty()
  password: string;
}
