import { ApiProperty } from '@nestjs/swagger';
import { CompanyEntity } from '../../company/entity/company.entity';
import { LoanEntity } from '../../loan/entity/loan.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'employees' })
export class EmployeeEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  @ApiProperty()
  employeeId: number;

  @Column({ unique: true, length: 11 })
  @ApiProperty()
  CPF: string;

  @Column({ type: 'varchar', length: 127 })
  @ApiProperty()
  fullName: string;

  @Column({ unique: true, type: 'varchar' })
  @ApiProperty()
  email: string;

  @Column({ type: 'varchar' })
  @ApiProperty()
  password: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  @ApiProperty()
  salary: number;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @ManyToOne(() => CompanyEntity, (company) => company.employees, {
    eager: true,
  })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @OneToMany(() => LoanEntity, (loan) => loan.employee)
  loans: LoanEntity[];

  constructor(employ?: Partial<EmployeeEntity>) {
    this.employeeId = employ?.employeeId;
    this.CPF = employ?.CPF;
    this.fullName = employ?.fullName;
    this.email = employ?.email;
    this.password = employ?.password;
    this.salary = employ?.salary;
    this.createdAt = employ?.createdAt;
    this.updatedAt = employ?.updatedAt;
    this.company = employ?.company;
    this.loans = employ?.loans;
  }
}

// Nome Completo (string)
// CPF (string)  -  ÚNICO
// E-mail (string)  -  ÚNICO
// Senha (string)
// Salário (decimal)

// RELACIONAMENTOS
// Empresa Conveniada (relacionamento muitos para um)
// Solicitações de Empréstimo (relacionamento um para muitos)
