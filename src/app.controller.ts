import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): any {
    return {
      success: true,
      message: 'Hello from Procurement & Inventory Service!',
      service: 'procurement-inventory-service-api',
      version: '1.0.0',
      port: 4040,
      timestamp: new Date().toISOString(),
      data: {
        modules: [
          'Material & Inventory',
          'Purchase Orders',
          'Budget & Costing',
        ],
        endpoints: 12,
        database: 'MySQL',
        status: 'Running',
      },
    };
  }

  @Get('health')
  healthCheck(): any {
    return {
      success: true,
      service: 'procurement-inventory-service-api',
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
