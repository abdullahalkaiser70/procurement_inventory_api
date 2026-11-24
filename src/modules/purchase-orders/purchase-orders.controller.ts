import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  Query,
} from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from '../../dto/create-purchase-order.dto';
import { RecordPoReceiptDto } from '../../dto/record-po-receipt.dto';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly poService: PurchaseOrdersService) {}

  @Post()
  async createPurchaseOrder(
    @Headers('x-tenant-id') tenantId: string,
    @Body() createPoDto: CreatePurchaseOrderDto,
  ) {
    return this.poService.createPurchaseOrder(tenantId, createPoDto);
  }

  @Get()
  async listPurchaseOrders(
    @Headers('x-tenant-id') tenantId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
  ) {
    const skipNum = skip ? parseInt(skip, 10) : 0;
    const takeNum = take ? parseInt(take, 10) : 10;
    return this.poService.listPurchaseOrders(
      tenantId,
      skipNum,
      takeNum,
      status,
    );
  }

  @Get(':orderId')
  async getPurchaseOrderById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.poService.getPurchaseOrderById(tenantId, orderId);
  }

  @Post(':orderId/receipts')
  async recordReceipt(
    @Headers('x-tenant-id') tenantId: string,
    @Param('orderId') orderId: string,
    @Body() receiptDto: RecordPoReceiptDto,
  ) {
    return this.poService.recordReceipt(tenantId, orderId, receiptDto);
  }
}
