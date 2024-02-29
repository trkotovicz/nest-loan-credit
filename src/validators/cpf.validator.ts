/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isCPF', async: false })
export class IsCPFConstraint implements ValidatorConstraintInterface {
  validate(cpf: string, args: ValidationArguments) {
    const formattedCpf = cpf.replace(/[^\d]/g, '');
    const cpfRegex = /^\d{11}$/;

    if (formattedCpf === '00000000000') return false;
    if (formattedCpf.length !== 11) return false;
    if (!cpfRegex.test(formattedCpf)) return false;

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'CPF inválido';
  }
}
