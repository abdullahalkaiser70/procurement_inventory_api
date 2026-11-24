import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  Query,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetApprovalDto } from '../../dto/budget-approval.dto';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  async getBudgetLedger(
    @Headers('x-tenant-id') tenantId: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.budgetService.getBudgetLedger(tenantId, projectId);
  }

  @Get('summary')
  async getFinancialSummary(
    @Headers('x-tenant-id') tenantId: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.budgetService.getFinancialSummary(tenantId, projectId);
  }

  @Get(':contractId')
  async getContractById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('contractId') contractId: string,
  ) {
    return this.budgetService.getContractById(tenantId, contractId);
  }

  @Post('approval')
  async approveOrRejectItem(
    @Headers('x-tenant-id') tenantId: string,
    @Body() approvalDto: BudgetApprovalDto,
  ) {
    return this.budgetService.approveOrRejectItem(tenantId, approvalDto);
  }
}
