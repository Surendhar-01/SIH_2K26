import { Module } from '@nestjs/common';
import { ComparisonService } from './comparison.service';
import { ComparisonController } from './comparison.controller';
import { ThermalModule } from '../thermal/thermal.module';

@Module({
  imports: [ThermalModule],
  controllers: [ComparisonController],
  providers: [ComparisonService],
})
export class ComparisonModule {}
