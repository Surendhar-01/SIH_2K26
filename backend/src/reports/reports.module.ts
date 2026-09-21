import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { OptimizationModule } from '../optimization/optimization.module';

@Module({
  imports: [OptimizationModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
