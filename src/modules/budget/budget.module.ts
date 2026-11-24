import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { Contract } from '../../entities/contract.entity';
import { Invoice } from '../../entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, Invoice])],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
