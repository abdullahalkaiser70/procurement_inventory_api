import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  supplierId: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('varchar', { length: 100 })
  contactPerson: string;

  @Column('varchar', { length: 20 })
  phone: string;

  @Column('varchar', { length: 100 })
  email: string;

  @Column('text')
  address: string;

  @Column('varchar', { length: 50 })
  city: string;

  @Column('varchar', { length: 50 })
  state: string;

  @Column('varchar', { length: 20 })
  zipCode: string;

  @Column('varchar', { length: 50 })
  country: string;

  @Column('decimal', { precision: 3, scale: 2 })
  rating: number; // 0-5

  @Column('varchar', { length: 50 })
  paymentTerms: string;

  @Column('text', { nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
