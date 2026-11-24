import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  orderId: string;

  @Column()
  supplierId: string;

  @Column('varchar', { length: 50 })
  poNumber: string;

  @Column('varchar', { length: 50 })
  status: string; // 'draft', 'pending', 'approved', 'received', 'cancelled'

  @Column('date')
  orderDate: Date;

  @Column('date', { nullable: true })
  expectedDeliveryDate?: Date;

  @Column('date', { nullable: true })
  actualDeliveryDate?: Date;

  @Column('decimal', { precision: 12, scale: 2 })
  totalAmount: number;

  @Column('varchar', { length: 50, nullable: true })
  approvedBy?: string;

  @Column('date', { nullable: true })
  approvalDate?: Date;

  @Column('text', { nullable: true })
  notes?: string;

  @Column('varchar', { length: 100, nullable: true })
  shippingAddress?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
