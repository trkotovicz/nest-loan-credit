import { EmployeeEntity } from '../../employee/entity/employee.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'companies' })
export class CompanyEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  companyId: number;

  @Column({ unique: true })
  CNPJ: string;

  @Column({ type: 'varchar', length: 127 })
  companyName: string;

  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => EmployeeEntity, (employee) => employee.company)
  employees: EmployeeEntity[];

  constructor(company?: Partial<CompanyEntity>) {
    this.companyId = company?.companyId;
    this.CNPJ = company?.CNPJ;
    this.companyName = company?.companyName;
    this.email = company?.email;
    this.password = company?.password;
    this.createdAt = company?.createdAt;
    this.updatedAt = company?.updatedAt;
    this.employees = company?.employees;
  }
}

// CNPJ (string)
// Razão Social (string)
// E-mail (string)
// Senha (string)

// RELACIONAMENTOS
// Funcionários (relacionamento um para muitos)
