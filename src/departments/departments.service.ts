import { DataSource, Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
  private readonly logger = new Logger('DepartmentsService');

  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,

    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateDepartmentDto) {
    const department = this.departmentRepository.create(dto);
    await this.departmentRepository.save(department);
    return department;
  }

  findAll() {
    return this.departmentRepository.find();
  }

  findOne(id: string) {
    try {
      const department = this.departmentRepository.findOneBy({ id });
      if (!department)
        throw new NotFoundException(`Department with ${id} not found!`);

      return department;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    const department = await this.departmentRepository.preload({ id, ...dto });

    if (!department)
      throw new NotFoundException(`Department with ${id} not found!`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(department);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const department = await this.findOne(id);
    await this.departmentRepository.remove(department);
  }

  private handleExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Error. Check server logs');
  }
}
