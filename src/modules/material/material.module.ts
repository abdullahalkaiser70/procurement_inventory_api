import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { InventoryItem } from '../../entities/inventory-item.entity';
import { InventoryMovement } from '../../entities/inventory-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem, InventoryMovement])],
  controllers: [MaterialController],
  providers: [MaterialService],
})
export class MaterialModule {}
