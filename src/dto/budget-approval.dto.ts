import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class BudgetApprovalDto {
  @IsString()
  itemId: string; // could be contract ID, invoice ID, change order ID

  @IsString()
  itemType: string; // 'contract', 'invoice', 'change-order'

  @IsBoolean()
  approved: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
