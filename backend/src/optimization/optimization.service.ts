import { Injectable } from '@nestjs/common';
import { ThermalService, ShelterShape } from '../thermal/thermal.service';

export interface EvaluatedCandidate {
  shelter: ShelterShape;
  rawMetrics: {
    heatLoss: number;
    solarGain: number;
    nightTemp: number;
    cost: number;
  };
  score?: number;
}

@Injectable()
export class OptimizationService {
  constructor(private readonly thermalService: ThermalService) {}

  runOptimization(
    baseShelter: ShelterShape,
    indoorTemp: number,
    outdoorTemps: number[],
    solarIrradiance: number[],
  ) {
    const candidates = [];
    const orientations = [0, 90, 180, 270];
    const uValuesTest = [0.2, 0.4, 0.8, 1.2, 1.5];

    let ind = 0;
    for (const orient of orientations) {
      for (const uv of uValuesTest) {
        const candidate = JSON.parse(
          JSON.stringify(baseShelter),
        ) as ShelterShape;
        candidate.name = `Option-${ind}`;
        candidate.orientationAngle = orient;
        if ((candidate.wallAssemblies?.length ?? 0) > 0)
          candidate.wallAssemblies![0].uValue = uv;
        candidates.push(candidate);
        ind++;
      }
    }

    const evaluated: EvaluatedCandidate[] = [];

    for (const shelter of candidates) {
      const thermalProfile = this.thermalService.predictIndoorTemperature(
        shelter,
        indoorTemp,
        outdoorTemps,
        solarIrradiance,
      );

      const totalSolarGain = thermalProfile.reduce(
        (sum, h) => sum + h.solarGainWatts,
        0,
      );
      const totalHeatLoss = thermalProfile.reduce(
        (sum, h) => sum + h.heatLossWatts,
        0,
      );
      const nightHours = thermalProfile.filter(
        (h) => h.hour >= 18 || h.hour <= 6,
      );
      const avgNightTemp =
        nightHours.reduce((sum, h) => sum + h.indoorTemp, 0) /
        (nightHours.length || 1);

      const costRaw = (1 / (shelter.wallAssemblies?.[0]?.uValue || 1.5)) * 1000;

      evaluated.push({
        shelter,
        rawMetrics: {
          heatLoss: totalHeatLoss,
          solarGain: totalSolarGain,
          nightTemp: avgNightTemp,
          cost: costRaw,
        },
      });
    }

    const maxHeatLoss =
      Math.max(...evaluated.map((e) => e.rawMetrics.heatLoss)) || 1;
    const maxSolarGain =
      Math.max(...evaluated.map((e) => e.rawMetrics.solarGain)) || 1;
    const maxNightTemp =
      Math.max(...evaluated.map((e) => e.rawMetrics.nightTemp)) || 1;
    const maxCost = Math.max(...evaluated.map((e) => e.rawMetrics.cost)) || 1;

    const wNightTemp = 2.0;
    const wSolarGain = 1.0;
    const wHeatLoss = 1.5;
    const wCost = 1.0;

    for (const e of evaluated) {
      const nNightTemp = e.rawMetrics.nightTemp / maxNightTemp;
      const nSolarGain = e.rawMetrics.solarGain / maxSolarGain;
      const nHeatLoss = e.rawMetrics.heatLoss / maxHeatLoss;
      const nCost = e.rawMetrics.cost / maxCost;

      e.score =
        wNightTemp * nNightTemp +
        wSolarGain * nSolarGain -
        wHeatLoss * nHeatLoss -
        wCost * nCost;
    }

    evaluated.sort((a, b) => (b.score || 0) - (a.score || 0));

    const best = evaluated[0];
    const explanations = [];
    if (best.rawMetrics.cost > 2500) {
      explanations.push({
        factor: 'Insulation',
        impact:
          'Reduced wall heat transfer significantly via thicker composite layers.',
      });
    }
    if (best.shelter.orientationAngle === 180) {
      explanations.push({
        factor: 'Orientation',
        impact: 'South-facing alignment maximizes useful winter solar gain.',
      });
    }

    return {
      recommendedDesign: best.shelter,
      performance: best.rawMetrics,
      reasons:
        explanations.length > 0
          ? explanations
          : [
              {
                factor: 'Balanced Utility',
                impact:
                  'Best trade-off between insulation cost and thermal stability.',
              },
            ],
      paretoFront: evaluated.slice(0, 5),
    };
  }
}
