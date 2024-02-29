/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isCNPJ', async: false })
export class IsCNPJConstraint implements ValidatorConstraintInterface {
  validate(cnpj: string, args: ValidationArguments) {
    const formattedCnpj = cnpj.replace(/[^\d]+/g, ''); // remove caracteres não numéricos
    const cnpjRegex = /^\d{14}$/;

    if (formattedCnpj.length !== 14) return false;
    if (!cnpjRegex.test(formattedCnpj)) return false;

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'CNPJ inválido';
  }
}
