import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  companyId: number;

  @Column({ unique: true })
  @ApiProperty()
  CNPJ: string;

  @Column({ type: 'varchar', length: 127 })
  @ApiProperty()
  companyName: string;

  @Column({ unique: true, type: 'varchar' })
  @ApiProperty()
  email: string;

  @Column({ type: 'varchar' })
  @ApiProperty()
  password: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
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
