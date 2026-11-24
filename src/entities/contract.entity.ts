import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  contractId: string;

  @Column()
  projectId: string;

  @Column('varchar', { length: 50 })
  contractNumber: string;

  @Column('varchar', { length: 50 })
  type: string; // 'labor', 'material', 'service'

  @Column('varchar', { length: 100 })
  vendor: string;

  @Column('date')
  startDate: Date;

  @Column('date')
  endDate: Date;

  @Column('decimal', { precision: 12, scale: 2 })
  contractValue: number;

  @Column('varchar', { length: 50 })
  status: string; // 'active', 'completed', 'cancelled', 'suspended'

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  amountSpent: number;

  @Column('varchar', { length: 50, nullable: true })
  approvedBy?: string;

  @Column('date', { nullable: true })
  approvalDate?: Date;

  @Column('text', { nullable: true })
  terms?: string;

  @Column('text', { nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
