import { Controller, Post, Body } from '@nestjs/common';
import { OptimizationService } from './optimization.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('optimization')
@ApiBearerAuth()
@Controller('optimization')
export class OptimizationController {
  constructor(private readonly optimizationService: OptimizationService) {}

  @Post('run')
  @ApiOperation({
    summary:
      'Run internal Genetic Algorithm optimizing geometric configurations',
  })
  runOptimization(
    @Body()
    body: {
      baseShelter: any;
      indoorTemp: number;
      outdoorTemps: number[];
      solarIrradiance: number[];
    },
  ) {
    return this.optimizationService.runOptimization(
      body.baseShelter,
      body.indoorTemp,
      body.outdoorTemps,
      body.solarIrradiance,
    );
  }
}
