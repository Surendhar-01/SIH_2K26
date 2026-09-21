import { Controller, Post, Body } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ShelterShape } from '../thermal/thermal.service';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('pareto')
  @ApiOperation({
    summary: 'Generate automated Pareto optimization structured AI report',
  })
  generatePareto(
    @Body()
    body: {
      baseShelter: ShelterShape;
      indoorTemp: number;
      outdoorTemps: number[];
      solarIrradiance: number[];
    },
  ) {
    return this.reportsService.generateParetoReport(
      body.baseShelter,
      body.indoorTemp,
      body.outdoorTemps,
      body.solarIrradiance,
    );
  }
}
