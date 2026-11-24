import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inventory_movements')
export class InventoryMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  movementId: string;

  @Column()
  itemId: string;

  @Column('varchar', { length: 50 })
  type: string; // 'in', 'out', 'transfer', 'adjustment'

  @Column('int')
  quantity: number;

  @Column('varchar', { length: 100 })
  fromLocation: string;

  @Column('varchar', { length: 100 })
  toLocation: string;

  @Column('text', { nullable: true })
  reason?: string;

  @Column('text', { nullable: true })
  reference?: string; // PO number, task ID, etc.

  @Column('varchar', { length: 50, nullable: true })
  createdBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
