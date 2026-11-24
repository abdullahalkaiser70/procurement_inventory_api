import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from '../../entities/purchase-order.entity';
import { PurchaseOrderLine } from '../../entities/purchase-order-line.entity';
import { InventoryItem } from '../../entities/inventory-item.entity';
import { CreatePurchaseOrderDto } from '../../dto/create-purchase-order.dto';
import { RecordPoReceiptDto } from '../../dto/record-po-receipt.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private poRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderLine)
    private lineRepository: Repository<PurchaseOrderLine>,
    @InjectRepository(InventoryItem)
    private inventoryRepository: Repository<InventoryItem>,
  ) {}

  async createPurchaseOrder(
    tenantId: string,
    createPoDto: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    // Create PO
    const poNumber = `PO-${Date.now()}`;
    const po = this.poRepository.create({
      tenantId,
      orderId: uuidv4(),
      poNumber,
      status: 'draft',
      orderDate: createPoDto.orderDate,
      expectedDeliveryDate: createPoDto.expectedDeliveryDate,
      shippingAddress: createPoDto.shippingAddress,
      notes: createPoDto.notes,
      supplierId: createPoDto.supplierId,
      totalAmount: 0,
    });

    const savedPo = await this.poRepository.save(po);

    // Create line items
    let totalAmount = 0;
    for (const lineItem of createPoDto.lineItems) {
      const lineTotal = lineItem.quantity * lineItem.unitPrice;
      totalAmount += lineTotal;

      // Get the item to fetch its unit
      const item = await this.inventoryRepository.findOne({
        where: { tenantId, itemId: lineItem.itemId },
      });

      const line = this.lineRepository.create({
        tenantId,
        lineId: uuidv4(),
        orderId: savedPo.orderId,
        itemId: lineItem.itemId,
        quantity: lineItem.quantity,
        unit: item?.unit || 'units',
        unitPrice: lineItem.unitPrice,
        lineTotal,
        status: 'pending',
      });

      await this.lineRepository.save(line);
    }

    // Update total amount
    savedPo.totalAmount = totalAmount;
    return this.poRepository.save(savedPo);
  }

  async listPurchaseOrders(
    tenantId: string,
    skip: number = 0,
    take: number = 10,
    status?: string,
  ): Promise<{ data: PurchaseOrder[]; total: number }> {
    const filter: any = { tenantId };
    if (status) {
      filter.status = status;
    }

    const [data, total] = await this.poRepository.findAndCount({
      where: filter,
      skip,
      take,
      order: { orderDate: 'DESC' },
    });

    return { data, total };
  }

  async getPurchaseOrderById(
    tenantId: string,
    orderId: string,
  ): Promise<PurchaseOrder & { lineItems: PurchaseOrderLine[] }> {
    const po = await this.poRepository.findOne({
      where: { tenantId, orderId },
    });

    if (!po) {
      throw new NotFoundException(`Purchase Order ${orderId} not found`);
    }

    const lineItems = await this.lineRepository.find({
      where: { tenantId, orderId },
    });

    return { ...po, lineItems };
  }

  async recordReceipt(
    tenantId: string,
    orderId: string,
    receiptDto: RecordPoReceiptDto,
  ): Promise<PurchaseOrder> {
    const po = await this.poRepository.findOne({
      where: { tenantId, orderId },
    });

    if (!po) {
      throw new NotFoundException(`Purchase Order ${orderId} not found`);
    }

    // Update line items and inventory
    for (const lineItem of receiptDto.lineItems) {
      const line = await this.lineRepository.findOne({
        where: { tenantId, lineId: lineItem.lineId },
      });

      if (!line) {
        throw new NotFoundException(`Line item ${lineItem.lineId} not found`);
      }

      line.quantityReceived += lineItem.quantityReceived;
      line.status =
        line.quantityReceived >= line.quantity ? 'received' : 'partial';
      await this.lineRepository.save(line);

      // Update inventory
      const item = await this.inventoryRepository.findOne({
        where: { tenantId, itemId: line.itemId },
      });

      if (item) {
        item.quantityInStock += lineItem.quantityReceived;
        item.quantityOnOrder -= lineItem.quantityReceived;
        await this.inventoryRepository.save(item);
      }
    }

    // Update PO status
    const allLines = await this.lineRepository.find({
      where: { tenantId, orderId },
    });
    const allReceived = allLines.every((l) => l.quantityReceived >= l.quantity);

    po.status = allReceived ? 'received' : 'partial';
    po.actualDeliveryDate = new Date();

    return this.poRepository.save(po);
  }
}
