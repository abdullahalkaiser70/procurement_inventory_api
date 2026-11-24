import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from '../../entities/contract.entity';
import { Invoice } from '../../entities/invoice.entity';
import { BudgetApprovalDto } from '../../dto/budget-approval.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async getBudgetLedger(
    tenantId: string,
    projectId?: string,
  ): Promise<{
    contracts: Contract[];
    invoices: Invoice[];
    totalContractValue: number;
    totalInvoiced: number;
    totalPaid: number;
  }> {
    const contractFilter: any = { tenantId };
    const invoiceFilter: any = { tenantId };

    if (projectId) {
      contractFilter.projectId = projectId;
    }

    const contracts = await this.contractRepository.find({
      where: contractFilter,
    });
    const invoices = await this.invoiceRepository.find({
      where: invoiceFilter,
    });

    const totalContractValue = contracts.reduce(
      (sum, c) => sum + Number(c.contractValue),
      0,
    );
    const totalInvoiced = invoices.reduce(
      (sum, i) => sum + Number(i.invoiceAmount),
      0,
    );
    const totalPaid = invoices.reduce(
      (sum, i) => sum + Number(i.paidAmount),
      0,
    );

    return {
      contracts,
      invoices,
      totalContractValue,
      totalInvoiced,
      totalPaid,
    };
  }

  async getContractById(
    tenantId: string,
    contractId: string,
  ): Promise<Contract> {
    const contract = await this.contractRepository.findOne({
      where: { tenantId, contractId },
    });

    if (!contract) {
      throw new NotFoundException(`Contract ${contractId} not found`);
    }

    return contract;
  }

  async approveOrRejectItem(
    tenantId: string,
    approvalDto: BudgetApprovalDto,
  ): Promise<any> {
    if (approvalDto.itemType === 'contract') {
      const contract = await this.contractRepository.findOne({
        where: { tenantId, contractId: approvalDto.itemId },
      });

      if (!contract) {
        throw new NotFoundException(`Contract not found`);
      }

      if (approvalDto.approved) {
        contract.status = 'active';
        contract.approvedBy = 'system';
        contract.approvalDate = new Date();
      }

      return this.contractRepository.save(contract);
    }

    if (approvalDto.itemType === 'invoice') {
      const invoice = await this.invoiceRepository.findOne({
        where: { tenantId, invoiceId: approvalDto.itemId },
      });

      if (!invoice) {
        throw new NotFoundException(`Invoice not found`);
      }

      if (approvalDto.approved) {
        invoice.status = 'approved';
        invoice.approvedBy = 'system';
        invoice.approvalDate = new Date();
      } else {
        invoice.status = 'disputed';
      }

      return this.invoiceRepository.save(invoice);
    }

    throw new Error('Invalid item type');
  }

  async getFinancialSummary(
    tenantId: string,
    projectId?: string,
  ): Promise<{
    totalBudget: number;
    totalSpent: number;
    totalPending: number;
    remaining: number;
  }> {
    const ledger = await this.getBudgetLedger(tenantId, projectId);

    const totalBudget = ledger.totalContractValue;
    const totalSpent = ledger.totalPaid;
    const totalPending = ledger.totalInvoiced - ledger.totalPaid;
    const remaining = totalBudget - totalSpent;

    return {
      totalBudget,
      totalSpent,
      totalPending,
      remaining,
    };
  }
}
