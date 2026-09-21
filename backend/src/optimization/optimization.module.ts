import { Module } from '@nestjs/common';
import { OptimizationService } from './optimization.service';
import { OptimizationController } from './optimization.controller';
import { ThermalModule } from '../thermal/thermal.module';

@Module({
  imports: [ThermalModule],
  controllers: [OptimizationController],
  providers: [OptimizationService],
  exports: [OptimizationService],
})
export class OptimizationModule {}
