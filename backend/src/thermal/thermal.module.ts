import { Module } from '@nestjs/common';
import { ThermalService } from './thermal.service';
import { ThermalController } from './thermal.controller';

@Module({
  controllers: [ThermalController],
  providers: [ThermalService],
  exports: [ThermalService],
})
export class ThermalModule {}
