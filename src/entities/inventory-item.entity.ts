import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  itemId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('varchar', { length: 50 })
  sku: string;

  @Column('text')
  category: string;

  @Column('int')
  quantityInStock: number;

  @Column('int')
  quantityOnOrder: number;

  @Column('int')
  reorderLevel: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitCost: number;

  @Column('varchar', { length: 20 })
  unit: string;

  @Column('varchar', { length: 50 })
  location: string;

  @Column('varchar', { length: 50 })
  supplier: string;

  @Column('text', { nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
