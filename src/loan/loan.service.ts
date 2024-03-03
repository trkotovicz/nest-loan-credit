import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeService } from 'src/employee/employee.service';
import { Repository } from 'typeorm';
import { LoanEntity, LoanStatus } from './entity/loan.entity';
import { PaymentApiService } from './external-services/payment-api.service';
import { ScoreApiService } from './external-services/score-api.service';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(LoanEntity)
    private loanRepository: Repository<LoanEntity>,
    private employeeService: EmployeeService,
    private employeeScore: ScoreApiService,
    private paymentStatus: PaymentApiService,
  ) {}

  async getScore() {
    const data = await this.employeeScore.fetchData();
    return data;
  }

  async getPaymentStatus() {
    const data = await this.paymentStatus.fetchData();
    return data;
  }

  async getEmployeeCompany(employeeId: number, companyId: number) {
    const employee = await this.employeeService.readOne(employeeId);

    if (employee.company.companyId !== Number(companyId)) {
      throw new BadRequestException(
        `Código ${companyId} diferente da empresa cadastrada para esse funcioário `,
      );
    }
    return true;
  }

  async getEmployeeSalary(employeeId: number) {
    const employee = await this.employeeService.readOne(employeeId);
    return employee.salary;
  }

  async verifyIfHasScore(employId: number) {
    const { score } = await this.getScore();
    const salary = await this.getEmployeeSalary(employId);

    if (salary >= 2000 && score >= 400) return true;
    else if (salary >= 4000 && score >= 500) return true;
    else if (salary >= 8000 && score >= 600) return true;
    else if (salary >= 12000 && score >= 700) return true;
    return false;
  }

  async verifyAmountLimit(employeeId: number, amount: number) {
    const maxFinancingTime = 60; // max months fixed
    const percent = 0.35;
    const salary = await this.getEmployeeSalary(employeeId);
    const monthlyFinancingApproved = salary * percent;
    const amountAvailable = monthlyFinancingApproved * maxFinancingTime;

    return {
      amountAvailable,
      monthlyFinancingApproved,
      amountRequested: amount,
      monthlyFinancingRequested: amount / maxFinancingTime,
    };
  }

  async verifyPaymentStatus() {
    const { message } = await this.getPaymentStatus();
    if (message) return LoanStatus.approved;
    return LoanStatus.pending;
  }

  async loanRequest(companyId: number, amount: number, employeeId: number) {
    await this.getEmployeeCompany(employeeId, companyId);
    const score = await this.verifyIfHasScore(employeeId);
    const paymentStatus = await this.getPaymentStatus();

    const requestObj = {
      amountAvailable: 0,
      monthlyFinancingApproved: 0,
      amountRequested: 0,
      monthlyFinancingRequested: 0,
      statusPayment: '',
    };

    if (!score) {
      requestObj.statusPayment = LoanStatus.rejected;
      throw new BadRequestException('Seu score é muito baixo no momento');
    }

    const amountLimit = await this.verifyAmountLimit(employeeId, amount);
    if (amount <= amountLimit.amountAvailable) {
      requestObj.amountAvailable = amountLimit.amountAvailable;
      requestObj.monthlyFinancingApproved =
        amountLimit.monthlyFinancingApproved;
      requestObj.amountRequested = amountLimit.amountRequested;
      requestObj.monthlyFinancingRequested =
        amountLimit.monthlyFinancingRequested;
      if (!paymentStatus.message) {
        requestObj.statusPayment = LoanStatus.pending;
      } else {
        requestObj.statusPayment = LoanStatus.approved;
      }
    }

    return requestObj;
  }
}

// 1. Solicitação: funcionário solicita empréstimo informando
// {
//   payload { companyId, amount }
//   req.param employeeId
// }

// {
//   score && payment = aprovado
//   score && !payment = pendente
//   !score = negado
// }

// OK - 2. Validação empresa: funcionário precisa ser funcionário da empresa informada no payload (companyId)

// OK - 3. Validação da margem: calcula o valor máximo que pode solicitar e o número de parcelas. Valor máximo da parcela = 35% salário (definir prazo de 60 meses)

// OK - 4. Validação Score: verifica se o cliente tem o score mínimo para o empréstimo:
// {
//   salários até R$ 2.000,00 score mínimo 400
//   salários até R$ 4.000,00 score mínimo 500
//   salários até R$ 8.000,00 score mínimo 600
//   salários até R$ 12.000,00 score mínimo 700
// }

// OK - 5. Status: se score aprovado, verifica o status do pagamento
