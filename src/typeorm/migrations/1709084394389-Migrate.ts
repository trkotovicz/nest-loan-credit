import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Migrate1709084394389 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'companies',
        columns: [
          {
            name: 'companyId',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          {
            name: 'CNPJ',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'companyName',
            type: 'varchar',
            length: '127',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '60',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP()',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'employees',
        columns: [
          {
            name: 'employeeId',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          {
            name: 'CPF',
            type: 'varchar',
            length: '11',
            isUnique: true,
          },
          {
            name: 'fullName',
            type: 'varchar',
            length: '127',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '60',
          },
          {
            name: 'salary',
            type: 'decimal',
            precision: 8,
            scale: 2,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP()',
          },
          {
            name: 'companyId',
            type: 'int',
            unsigned: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['companyId'],
            referencedTableName: 'companies',
            referencedColumnNames: ['companyId'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'loans',
        columns: [
          {
            name: 'loanId',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 8,
            scale: 2,
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP()',
          },
          {
            name: 'employeeId',
            type: 'int',
            unsigned: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['employeeId'],
            referencedTableName: 'employees',
            referencedColumnNames: ['employeeId'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('loans');
    await queryRunner.dropTable('employees');
    await queryRunner.dropTable('companies');
  }
}
