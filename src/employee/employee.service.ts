import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CompanyService } from '../company/company.service';
import { Repository } from 'typeorm';
import { CreateEmployeeDTO } from './dto/create-employee.dto';
import { PatchPasswordEmployeeDTO } from './dto/patch-password-employee.dto';
import { PutEmployeeDTO } from './dto/put-employee.dto';
import { EmployeeEntity } from './entity/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>,
    private companyService: CompanyService,
  ) {}

  async create({
    CPF,
    fullName,
    email,
    password,
    salary,
    company,
  }: CreateEmployeeDTO) {
    CPF = CPF.replace(/[^\d]/g, '');
    if (
      await this.employeeRepository.exists({
        where: [{ email }, { CPF }],
      })
    ) {
      throw new BadRequestException(
        'Esse CPF ou esse email já estão sendo usados.',
      );
    }

    const findCompany = await this.companyService.readOne(company);

    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);

    const employee = await this.employeeRepository.insert({
      fullName,
      email,
      password,
      CPF,
      salary,
      company: findCompany,
    });
    const result = employee.generatedMaps[0];
    return { fullName, email, password, CPF, salary, company, ...result };
  }

  async readOne(employeeId: number) {
    await this.exists(employeeId);
    return await this.employeeRepository.findOne({ where: { employeeId } });
  }

  async list() {
    return await this.employeeRepository.find();
  }

  async updatePassword(employeeId: number, data: PatchPasswordEmployeeDTO) {
    await this.exists(employeeId);

    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);

    try {
      const update = await this.employeeRepository.update(employeeId, {
        password: data.password,
      });
      if (update.affected) return 'Senha alterada com sucesso.';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(employeeId: number, data: PutEmployeeDTO) {
    await this.exists(employeeId);

    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);

    try {
      if (
        (await this.employeeRepository.exists({
          where: { email: data.email },
        })) &&
        (
          await this.employeeRepository.findOne({
            where: { email: data.email },
          })
        ).email !== data.email
      ) {
        throw new BadRequestException('Esse email já está sendo usado.');
      }

      if (
        (await this.employeeRepository.exists({
          where: { CPF: data.CPF },
        })) &&
        (
          await this.employeeRepository.findOne({
            where: { CPF: data.CPF },
          })
        ).CPF !== data.CPF
      ) {
        throw new BadRequestException('Esse CPF já está sendo usado.');
      }

      const findCompany = await this.companyService.readOne(data.company);

      const update = await this.employeeRepository.update(employeeId, {
        ...data,
        company: findCompany,
      });

      if (update.affected) return data;
    } catch (error) {
      throw error;
    }
  }

  async delete(employeeId: number) {
    await this.exists(employeeId);
    try {
      const result = await this.employeeRepository.delete(employeeId);
      if (result.affected) return 'Funcionário deletado com sucesso.';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async exists(employeeId: number) {
    if (!(await this.employeeRepository.exists({ where: { employeeId } })))
      throw new NotFoundException(
        `O funcionário com id ${employeeId} não existe.`,
      );
    return true;
  }
}
