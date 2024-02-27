import { EmployeeEntity } from 'src/employee/entity/employee.entity';
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

  @Column({ unique: true, length: 14 })
  CNPJ: string;

  @Column({ type: 'string', length: 127 })
  companyName: string;

  @Column({ unique: true, type: 'string' })
  email: string;

  @Column({ type: 'string' })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => EmployeeEntity, (employee) => employee.company)
  employees: EmployeeEntity[];
}

// CNPJ (string)
// Razão Social (string)
// E-mail (string)
// Senha (string)

// RELACIONAMENTOS
// Funcionários (relacionamento um para muitos)
