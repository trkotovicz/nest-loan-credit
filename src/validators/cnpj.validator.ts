/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isCNPJ', async: false })
export class IsCNPJConstraint implements ValidatorConstraintInterface {
  validate(cnpj: string, args: ValidationArguments) {
    cnpj = cnpj.replace(/[^\d]+/g, ''); // remove caracteres não numéricos

    if (cnpj.length !== 14) return false;

    // Valida DVs
    let tamanho: number = cnpj.length - 2;
    const numeros: string = cnpj.substring(0, tamanho);
    const digitos: string = cnpj.substring(tamanho);
    let soma: number = 0;
    let pos: number = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado: number = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho += 1;
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'CNPJ inválido';
  }
}
