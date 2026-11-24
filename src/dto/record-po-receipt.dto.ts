import { IsString, IsArray } from 'class-validator';

export class RecordPoReceiptDto {
  @IsArray()
  lineItems: Array<{
    lineId: string;
    quantityReceived: number;
  }>;

  @IsString()
  receivedBy: string;
}
