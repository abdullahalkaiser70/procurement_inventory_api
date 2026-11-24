import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('purchase_order_lines')
export class PurchaseOrderLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  lineId: string;

  @Column()
  orderId: string;

  @Column()
  itemId: string;

  @Column('int')
  quantity: number;

  @Column('varchar', { length: 20 })
  unit: string;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 12, scale: 2 })
  lineTotal: number;

  @Column('int', { default: 0 })
  quantityReceived: number;

  @Column('varchar', { length: 50 })
  status: string; // 'pending', 'partial', 'received', 'cancelled'

  @Column('text', { nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
