import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from '../../entities/inventory-item.entity';
import { InventoryMovement } from '../../entities/inventory-movement.entity';
import { CreateMaterialDto } from '../../dto/create-material.dto';
import { TransferMaterialDto } from '../../dto/transfer-material.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryRepository: Repository<InventoryItem>,
    @InjectRepository(InventoryMovement)
    private movementRepository: Repository<InventoryMovement>,
  ) {}

  async createMaterial(
    tenantId: string,
    createMaterialDto: CreateMaterialDto,
  ): Promise<InventoryItem> {
    const item = this.inventoryRepository.create({
      tenantId,
      itemId: uuidv4(),
      ...createMaterialDto,
    });
    return this.inventoryRepository.save(item);
  }

  async listMaterial(
    tenantId: string,
    skip: number = 0,
    take: number = 10,
    category?: string,
  ): Promise<{ data: InventoryItem[]; total: number }> {
    const filter: any = { tenantId };
    if (category) {
      filter.category = category;
    }

    const [data, total] = await this.inventoryRepository.findAndCount({
      where: filter,
      skip,
      take,
    });

    return { data, total };
  }

  async getMaterialById(
    tenantId: string,
    itemId: string,
  ): Promise<InventoryItem> {
    const item = await this.inventoryRepository.findOne({
      where: { tenantId, itemId },
    });

    if (!item) {
      throw new NotFoundException(`Material ${itemId} not found`);
    }

    return item;
  }

  async transferMaterial(
    tenantId: string,
    transferDto: TransferMaterialDto,
  ): Promise<{ item: InventoryItem; movement: InventoryMovement }> {
    const item = await this.getMaterialById(tenantId, transferDto.itemId);

    if (item.quantityInStock < transferDto.quantity) {
      throw new Error('Insufficient stock');
    }

    // Update item stock
    item.quantityInStock -= transferDto.quantity;
    const updatedItem = await this.inventoryRepository.save(item);

    // Record movement
    const movement = this.movementRepository.create({
      tenantId,
      movementId: uuidv4(),
      itemId: transferDto.itemId,
      type: 'transfer',
      quantity: transferDto.quantity,
      fromLocation: transferDto.fromLocation,
      toLocation: transferDto.toLocation,
      reason: transferDto.reason,
    });
    const savedMovement = await this.movementRepository.save(movement);

    return { item: updatedItem, movement: savedMovement };
  }

  async getMovementHistory(
    tenantId: string,
    itemId: string,
  ): Promise<InventoryMovement[]> {
    return this.movementRepository.find({
      where: { tenantId, itemId },
      order: { createdAt: 'DESC' },
    });
  }
}
