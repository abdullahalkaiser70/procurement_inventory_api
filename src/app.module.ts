import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MaterialModule } from './modules/material/material.module';
import { PurchaseOrdersModule } from './modules/purchase-orders/purchase-orders.module';
import { BudgetModule } from './modules/budget/budget.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'mysql'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'structura_user'),
        password: configService.get('DB_PASSWORD', 'structura_pass123'),
        database: configService.get('DB_NAME', 'procurement_inventory'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: configService.get('LOG_LEVEL') === 'debug',
      }),
    }),
    MaterialModule,
    PurchaseOrdersModule,
    BudgetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
