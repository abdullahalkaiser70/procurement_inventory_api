import { IsString, IsDate, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreatePurchaseOrderDto {
  @IsString()
  supplierId: string;

  @IsDate()
  orderDate: Date;

  @IsOptional()
  @IsDate()
  expectedDeliveryDate?: Date;

  @IsArray()
  lineItems: Array<{
    itemId: string;
    quantity: number;
    unitPrice: number;
  }>;

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
