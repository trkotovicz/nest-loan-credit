import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeService } from 'src/employee/employee.service';
import { Repository } from 'typeorm';
import { CreateLoanDTO } from './dto/create-loan.dto';
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
    const paymentStatus = await this.getPaymentStatus();

    const requestObj = {
      amountAvailable: 0,
      monthlyFinancingApproved: 0,
      amountRequested: 0,
      monthlyFinancingRequested: 0,
      statusPayment: LoanStatus.pending,
    };

    if (!(await this.verifyIfHasScore(employeeId))) {
      let { statusPayment, amountRequested } = requestObj;
      statusPayment = LoanStatus.rejected;
      amountRequested = Number(amount);
      await this.saveLoanRejected({
        employee: employeeId,
        amount: amountRequested,
        status: statusPayment,
      });
      throw new BadRequestException('Seu score é muito baixo no momento');
    }

    const amountLimit = await this.verifyAmountLimit(employeeId, amount);

    if (amount <= amountLimit.amountAvailable) {
      requestObj.amountAvailable = amountLimit.amountAvailable;
      requestObj.monthlyFinancingApproved =
        amountLimit.monthlyFinancingApproved;
      requestObj.amountRequested = Number(amountLimit.amountRequested);
      requestObj.monthlyFinancingRequested =
        amountLimit.monthlyFinancingRequested;
      if (!paymentStatus.message) {
        requestObj.statusPayment = LoanStatus.pending;
      } else {
        requestObj.statusPayment = LoanStatus.approved;
      }
    }
    if (amount > amountLimit.amountAvailable) {
      requestObj.amountAvailable = amountLimit.amountAvailable;
      requestObj.monthlyFinancingApproved =
        amountLimit.monthlyFinancingApproved;
      requestObj.amountRequested = Number(amountLimit.amountRequested);
      requestObj.monthlyFinancingRequested =
        amountLimit.monthlyFinancingRequested;
      requestObj.statusPayment = LoanStatus.rejected;
    }

    return requestObj;
  }

  async saveLoanApproved() {
    // loan entity - { loandId, amount, status, createdAt, employee }
  }

  async saveLoanRejected({ employee, amount, status }: CreateLoanDTO) {
    const employeeEntity = await this.employeeService.readOne(employee);

    await this.loanRepository.insert({
      employee: employeeEntity,
      amount,
      status,
    });
  }
}

// loanRequest

// SUCESSO
// {
//   amountAvailable: 176418.69,
//   monthlyFinancingApproved: 2940.3115,
//   amountRequested: '50000',
//   monthlyFinancingRequested: 833.3333333333334,
//   statusPayment: 'Aprovado'
// }

// SUCESSO - !paymentStatus
// {
// 	"amountAvailable": 176418.69,
// 	"monthlyFinancingApproved": 2940.3115,
// 	"amountRequested": "50000",
// 	"monthlyFinancingRequested": 833.3333333333334,
// 	"statusPayment": "Pendente"
// }

// FALHA - amountRequested > amountAvailable
// {
//   amountAvailable: 176418.69,
//   monthlyFinancingApproved: 2940.3115,
//   amountRequested: 500000,
//   monthlyFinancingRequested: 8333.333333333334,
//   statusPayment: 'Rejeitado'
// }

// FALHA - !score
// {
// 	"message": "Seu score é muito baixo no momento",
// 	"error": "Bad Request",
// 	"statusCode": 400
// }

// FALHA - empresa inválida
// {
// 	"message": "Código 2 diferente da empresa cadastrada para esse funcioário ",
// 	"error": "Bad Request",
// 	"statusCode": 400
// }
