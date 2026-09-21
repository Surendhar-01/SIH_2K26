import { Controller, Post, Body } from '@nestjs/common';
import { ComparisonService } from './comparison.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('comparison')
@ApiBearerAuth()
@Controller('comparison')
export class ComparisonController {
  constructor(private readonly comparisonService: ComparisonService) {}

  @Post('designs')
  @ApiOperation({ summary: 'Compare multiple shelter designs analytically' })
  compareDesigns(
    @Body()
    body: {
      designs: any[];
      indoorTemp: number;
      outdoorTemps: number[];
      solarIrradiance: number[];
    },
  ) {
    return this.comparisonService.compareDesigns(
      body.designs,
      body.indoorTemp,
      body.outdoorTemps,
      body.solarIrradiance,
    );
  }

  @Post('baseline')
  @ApiOperation({
    summary:
      'Compare baseline shelter against an optimized one to find Energy Saved',
  })
  compareBaseline(
    @Body()
    body: {
      baselineShelter: any;
      optimizedShelter: any;
      indoorTemp: number;
      outdoorTemps: number[];
      solarIrradiance: number[];
    },
  ) {
    return this.comparisonService.calculateEnergySaving(
      body.baselineShelter,
      body.optimizedShelter,
      body.indoorTemp,
      body.outdoorTemps,
      body.solarIrradiance,
    );
  }
}
