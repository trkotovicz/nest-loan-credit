import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateCompanyDTO } from './dto/create-company.dto';
import { PatchPasswordCompanyDTO } from './dto/patch-password-company.dto';
import { PutCompanyDTO } from './dto/put-company.dto';
import { CompanyEntity } from './entity/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,
  ) {}

  async create({ CNPJ, companyName, email, password }: CreateCompanyDTO) {
    CNPJ = CNPJ.replace(/[^\d]+/g, '');
    if (
      await this.companyRepository.exists({
        where: [{ email }, { CNPJ }],
      })
    ) {
      throw new BadRequestException(
        'Esse CNPJ ou esse email já estão sendo usados.',
      );
    }

    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);

    const company = await this.companyRepository.insert({
      companyName,
      email,
      password,
      CNPJ,
    });
    const result = company.generatedMaps[0];
    return { companyName, email, password, CNPJ, ...result };
  }

  async readOne(companyId: number) {
    await this.exists(companyId);
    return await this.companyRepository.findOne({ where: { companyId } });
  }

  // async findByName(name: string) {
  //   return await this.companyRepository.findOne({
  //     where: { companyName: `%${name}%` },
  //   });
  // }

  async list() {
    return await this.companyRepository.find();
  }

  async updatePassword(companyId: number, data: PatchPasswordCompanyDTO) {
    await this.exists(companyId);

    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);

    try {
      const update = await this.companyRepository.update(companyId, {
        password: data.password,
      });
      if (update.affected) return 'Senha alterada com sucesso';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(companyId: number, data: PutCompanyDTO) {
    await this.exists(companyId);

    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);

    try {
      data.CNPJ = data.CNPJ.replace(/[^\d]+/g, '');
      if (
        await this.companyRepository.exists({ where: { email: data.email } })
      ) {
        throw new BadRequestException('Esse email já está sendo usado.');
      }
      if (await this.companyRepository.exists({ where: { CNPJ: data.CNPJ } })) {
        throw new BadRequestException('Esse CNPJ já está sendo usado.');
      }

      const update = await this.companyRepository.update(companyId, {
        ...data,
      });

      if (update.affected) return data;
    } catch (error) {
      throw error;
    }
  }

  async delete(companyId: number) {
    await this.exists(companyId);
    try {
      const result = await this.companyRepository.delete(companyId);
      if (result.affected) return 'Empresa deletada com sucesso';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async exists(companyId: number) {
    if (!(await this.companyRepository.exists({ where: { companyId } })))
      throw new NotFoundException(`A empresa com id ${companyId} não existe.`);
  }
}
