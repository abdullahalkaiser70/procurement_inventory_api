import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  sku: string;

  @IsString()
  category: string;

  @IsNumber()
  quantityInStock: number;

  @IsNumber()
  reorderLevel: number;

  @IsNumber()
  unitCost: number;

  @IsString()
  unit: string;

  @IsString()
  location: string;

  @IsString()
  supplier: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
