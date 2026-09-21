import { Injectable } from '@nestjs/common';
import { ThermalService, ShelterShape } from '../thermal/thermal.service';

@Injectable()
export class ComparisonService {
  constructor(private readonly thermalService: ThermalService) {}

  compareDesigns(
    designs: ShelterShape[],
    indoorTemp: number,
    outdoorTemps: number[],
    solarIrradiance: number[],
  ) {
    const results = [];

    for (const shelter of designs) {
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
      const minTemp = Math.min(...thermalProfile.map((h) => h.indoorTemp));
      const maxTemp = Math.max(...thermalProfile.map((h) => h.indoorTemp));

      const nightHours = thermalProfile.filter(
        (h) => h.hour >= 18 || h.hour <= 6,
      );
      const avgNightTemp =
        nightHours.reduce((sum, h) => sum + h.indoorTemp, 0) /
        (nightHours.length || 1);

      results.push({
        shelterId: shelter.id || shelter.name,
        thermalProfile,
        metrics: {
          totalSolarGain: Number(totalSolarGain.toFixed(2)),
          totalHeatLoss: Number(totalHeatLoss.toFixed(2)),
          minTemp,
          maxTemp,
          avgNightTemp: Number(avgNightTemp.toFixed(2)),
        },
      });
    }

    return results.sort(
      (a, b) => b.metrics.avgNightTemp - a.metrics.avgNightTemp,
    );
  }

  calculateEnergySaving(
    baselineShelter: ShelterShape,
    optimizedShelter: ShelterShape,
    indoorTemp: number,
    outdoorTemps: number[],
    solarIrradiance: number[],
  ) {
    const baselineProfile = this.thermalService.predictIndoorTemperature(
      baselineShelter,
      indoorTemp,
      outdoorTemps,
      solarIrradiance,
    );
    const optimizedProfile = this.thermalService.predictIndoorTemperature(
      optimizedShelter,
      indoorTemp,
      outdoorTemps,
      solarIrradiance,
    );

    const baselineHeatLoss = baselineProfile.reduce(
      (sum, h) => sum + h.heatLossWatts,
      0,
    );
    const optimizedHeatLoss = optimizedProfile.reduce(
      (sum, h) => sum + h.heatLossWatts,
      0,
    );

    let energySaved = 0;
    let percentageReduction = 0;

    if (baselineHeatLoss > 0) {
      energySaved = baselineHeatLoss - optimizedHeatLoss;
      percentageReduction =
        ((baselineHeatLoss - optimizedHeatLoss) / baselineHeatLoss) * 100;
    }

    return {
      baselineHeatingRequirement: Number(baselineHeatLoss.toFixed(2)),
      optimizedHeatingRequirement: Number(optimizedHeatLoss.toFixed(2)),
      energySaved: energySaved > 0 ? Number(energySaved.toFixed(2)) : 0,
      percentageReduction:
        percentageReduction > 0 ? Number(percentageReduction.toFixed(2)) : 0,
    };
  }
}
