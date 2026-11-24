import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  Query,
} from '@nestjs/common';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from '../../dto/create-material.dto';
import { TransferMaterialDto } from '../../dto/transfer-material.dto';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  async createMaterial(
    @Headers('x-tenant-id') tenantId: string,
    @Body() createMaterialDto: CreateMaterialDto,
  ) {
    return this.materialService.createMaterial(tenantId, createMaterialDto);
  }

  @Get()
  async listMaterial(
    @Headers('x-tenant-id') tenantId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('category') category?: string,
  ) {
    const skipNum = skip ? parseInt(skip, 10) : 0;
    const takeNum = take ? parseInt(take, 10) : 10;
    return this.materialService.listMaterial(
      tenantId,
      skipNum,
      takeNum,
      category,
    );
  }

  @Get(':itemId')
  async getMaterialById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.materialService.getMaterialById(tenantId, itemId);
  }

  @Post('/transfer')
  async transferMaterial(
    @Headers('x-tenant-id') tenantId: string,
    @Body() transferDto: TransferMaterialDto,
  ) {
    return this.materialService.transferMaterial(tenantId, transferDto);
  }

  @Get(':itemId/history')
  async getMovementHistory(
    @Headers('x-tenant-id') tenantId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.materialService.getMovementHistory(tenantId, itemId);
  }
}
