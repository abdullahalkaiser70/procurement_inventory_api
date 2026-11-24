import { IsString, IsNumber } from 'class-validator';

export class TransferMaterialDto {
  @IsString()
  itemId: string;

  @IsString()
  fromLocation: string;

  @IsString()
  toLocation: string;

  @IsNumber()
  quantity: number;

  @IsString()
  reason: string;
}
