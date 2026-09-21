import { Injectable } from '@nestjs/common';
import { OptimizationService } from '../optimization/optimization.service';
import { ShelterShape } from '../thermal/thermal.service';

interface ParetoCandidate {
  shelter: {
    name?: string;
    [key: string]: any;
  };
  rawMetrics: {
    nightTemp: number;
    solarGain: number;
    heatLoss: number;
    cost: number;
  };
}

@Injectable()
export class ReportsService {
  constructor(private readonly optService: OptimizationService) {}

  generateParetoReport(
    baseShelter: ShelterShape,
    indoorTemp: number,
    outdoorTemps: number[],
    solarIrradiance: number[],
  ) {
    const optResult = this.optService.runOptimization(
      baseShelter,
      indoorTemp,
      outdoorTemps,
      solarIrradiance,
    );

    const paretoFront = optResult.paretoFront as ParetoCandidate[];
    const recommendedDesign = optResult.recommendedDesign as Record<
      string,
      any
    >;
    const reasons = optResult.reasons as any[];

    return {
      title: 'ThermoShelter AI Pareto Optimization Report',
      timestamp: new Date().toISOString(),
      recommendedDesign,
      paretoFrontierOptions: paretoFront.map(
        (p: ParetoCandidate, idx: number) => ({
          rank: idx + 1,
          designName: p.shelter.name || `Option-${idx}`,
          nightTempRetention: Number(p.rawMetrics.nightTemp.toFixed(2)),
          solarGainUtility: Number(p.rawMetrics.solarGain.toFixed(2)),
          heatLossRestriction: Number(p.rawMetrics.heatLoss.toFixed(2)),
          insulationCost: Number(p.rawMetrics.cost.toFixed(2)),
        }),
      ),
      aiReasoning: reasons,
    };
  }
}
