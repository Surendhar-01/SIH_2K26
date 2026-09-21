import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GenomeService } from './genome.service';

@Controller('genome')
export class GenomeController {
  constructor(private readonly genomeService: GenomeService) {}

  /**
   * POST /api/genome/run
   * Start a new Reverse Design genome optimization run.
   */
  @Post('run')
  async startRun(
    @Body()
    body: {
      minIndoorTempC: number;
      maxIndoorTempC: number;
      comfortDurationHours: number;
      sunsetHour?: number;
      maxExternalHeatingWh?: number;
      avgOutdoorTempC?: number;
      tempAmplitudeC?: number;
      peakSolarIrradianceW?: number;
      candidateCount?: number;
      optimizationIterations?: number;
    },
  ) {
    return this.genomeService.startRun({
      minIndoorTempC: body.minIndoorTempC ?? 15,
      maxIndoorTempC: body.maxIndoorTempC ?? 28,
      comfortDurationHours: body.comfortDurationHours ?? 8,
      sunsetHour: body.sunsetHour ?? 18,
      maxExternalHeatingWh: body.maxExternalHeatingWh ?? 0,
      avgOutdoorTempC: body.avgOutdoorTempC ?? -5,
      tempAmplitudeC: body.tempAmplitudeC ?? 10,
      peakSolarIrradianceW: body.peakSolarIrradianceW ?? 800,
      candidateCount: body.candidateCount ?? 20,
      optimizationIterations: body.optimizationIterations ?? 3,
    });
  }

  /**
   * GET /api/genome/run/:runId
   * Poll run status and retrieve all evaluated genomes.
   */
  @Get('run/:runId')
  async getRun(@Param('runId') runId: string) {
    return this.genomeService.getRun(runId);
  }

  /**
   * GET /api/genome/run/:runId/recommendations
   * Get Top 3 recommendations (MaxTA, MinEnergy, Balanced).
   */
  @Get('run/:runId/recommendations')
  async getRecommendations(@Param('runId') runId: string) {
    return this.genomeService.getRecommendations(runId);
  }

  /**
   * POST /api/genome/genome/:genomeId/improve
   * Run Failure-to-Solution engine and generate an improved genome.
   */
  @Post('genome/:genomeId/improve')
  async improveGenome(
    @Param('genomeId') genomeId: string,
    @Body()
    target: {
      minIndoorTempC: number;
      maxIndoorTempC: number;
      comfortDurationHours: number;
      sunsetHour?: number;
      maxExternalHeatingWh?: number;
      avgOutdoorTempC?: number;
      tempAmplitudeC?: number;
      peakSolarIrradianceW?: number;
    },
  ) {
    return this.genomeService.improveGenome(genomeId, {
      minIndoorTempC: target.minIndoorTempC ?? 15,
      maxIndoorTempC: target.maxIndoorTempC ?? 28,
      comfortDurationHours: target.comfortDurationHours ?? 8,
      sunsetHour: target.sunsetHour ?? 18,
      maxExternalHeatingWh: target.maxExternalHeatingWh ?? 0,
      avgOutdoorTempC: target.avgOutdoorTempC ?? -5,
      tempAmplitudeC: target.tempAmplitudeC ?? 10,
      peakSolarIrradianceW: target.peakSolarIrradianceW ?? 800,
    });
  }

  /**
   * POST /api/genome/ansys-validate/:genomeId
   * Queue the recommended genome for ANSYS high-fidelity validation.
   */
  @Post('ansys-validate/:genomeId')
  async ansysValidate(@Param('genomeId') genomeId: string) {
    return this.genomeService.ansysValidate(genomeId);
  }
}
