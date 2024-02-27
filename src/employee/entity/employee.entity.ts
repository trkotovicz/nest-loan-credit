import { CompanyEntity } from 'src/company/entity/company.entity';
import { LoanEntity } from 'src/loan/entity/loan.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'employees' })
export class EmployeeEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  employeeId: number;

  @Column({ unique: true, length: 11 })
  CPF: string;

  @Column({ type: 'string', length: 127 })
  fullName: string;

  @Column({ unique: true, type: 'string' })
  email: string;

  @Column({ type: 'string' })
  password: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  salary: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CompanyEntity, (company) => company.employees)
  company: CompanyEntity;

  @OneToMany(() => LoanEntity, (loan) => loan.employee)
  loans: LoanEntity[];
}

// Nome Completo (string)
// CPF (string)  -  ÚNICO
// E-mail (string)  -  ÚNICO
// Senha (string)
// Salário (decimal)

// RELACIONAMENTOS
// Empresa Conveniada (relacionamento muitos para um)
// Solicitações de Empréstimo (relacionamento um para muitos)
