import { ApiProperty } from '@nestjs/swagger';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum LoanStatus {
  pending = 'Pendente',
  approved = 'Aprovado',
  rejected = 'Rejeitado',
}

@Entity({ name: 'loans' })
export class LoanEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  @ApiProperty()
  loanId: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  @ApiProperty()
  amount: number;

  @Column({ type: 'enum', enum: LoanStatus, default: LoanStatus.pending })
  @ApiProperty()
  status: LoanStatus;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.loans)
  employee: EmployeeEntity;
}

// Valor do Empréstimo (decimal)
// Status da Solicitação (enum: Pendente, Aprovado, Rejeitado)
// Data da Solicitação (timestamp)

// RELACIONAMENTOS
// Funcionário Solicitante (relacionamento muitos para um)
