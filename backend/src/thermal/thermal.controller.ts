import { Controller, Post, Body } from '@nestjs/common';
import { ThermalService } from './thermal.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('thermal')
@ApiBearerAuth()
@Controller('thermal')
export class ThermalController {
  constructor(private readonly thermalService: ThermalService) {}

  @Post('predict-temperature')
  @ApiOperation({
    summary:
      'Predict indoor temperature over 24h baseline integrating Solar Heat Gain',
  })
  async predictTemperature(
    @Body()
    body: {
      shelterId: string;
      indoorTemp: number;
      outdoorTemps: number[];
      solarIrradiance: number[];
    },
  ) {
    const mockShelter = {
      length: 6,
      width: 4,
      height: 3,
      wallAssemblies: [{ uValue: 0.8 }],
      openings: [{ type: 'Window', width: 2, height: 1 }],
    };
    return this.thermalService.predictIndoorTemperature(
      mockShelter,
      body.indoorTemp,
      body.outdoorTemps,
      body.solarIrradiance,
    );
  }
}
