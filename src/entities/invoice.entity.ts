import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  invoiceId: string;

  @Column()
  supplierId: string;

  @Column('varchar', { length: 50 })
  invoiceNumber: string;

  @Column()
  purchaseOrderId: string;

  @Column('date')
  invoiceDate: Date;

  @Column('date')
  dueDate: Date;

  @Column('decimal', { precision: 12, scale: 2 })
  invoiceAmount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  paidAmount: number;

  @Column('varchar', { length: 50 })
  status: string; // 'pending', 'approved', 'paid', 'disputed', 'cancelled'

  @Column('varchar', { length: 50, nullable: true })
  approvedBy?: string;

  @Column('date', { nullable: true })
  approvalDate?: Date;

  @Column('date', { nullable: true })
  paymentDate?: Date;

  @Column('text', { nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
