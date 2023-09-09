import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'departments' })
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('int')
  order: number;

  @Column('float')
  area: number;

  @Column('float')
  population: number;

  @Column('text', { nullable: true })
  flag?: string;

  @CreateDateColumn()
  created_at: Date;
}
