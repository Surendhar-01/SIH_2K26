import { Injectable } from '@nestjs/common';

type WallAssembly = { uValue: number; [key: string]: unknown };
type Opening = {
  type: string;
  width: number;
  height: number;
  [key: string]: unknown;
};

export type ShelterShape = {
  id?: string;
  name?: string;
  length: number;
  width: number;
  height: number;
  wallAssemblies?: WallAssembly[];
  openings?: Opening[];
  [key: string]: unknown;
};

@Injectable()
export class ThermalService {
  /**
   * Conductive Heat Transfer: Q = U * A * dT
   */
  calculateConductiveHeatTransfer(
    uValue: number,
    area: number,
    tIn: number,
    tOut: number,
  ): number {
    return uValue * area * (tIn - tOut);
  }

  /**
   * Solar Gain: Q_solar = A * G * SHGC * F
   */
  calculateSolarGain(
    area: number,
    irradiance: number,
    shgc: number,
    orientationFactor: number = 0.5,
  ): number {
    return area * irradiance * shgc * orientationFactor;
  }

  /**
   * Predict Indoor Temperature over 24 hours using explicit Finite Difference Method (Lumped Capacitance)
   */
  predictIndoorTemperature(
    shelter: ShelterShape,
    startTemp: number,
    outdoorTemps: number[],
    solarIrradiance: number[],
  ) {
    const wallArea =
      2 * shelter.length * shelter.height + 2 * shelter.width * shelter.height;
    const roofArea = shelter.length * shelter.width;

    const avgWallUValue = shelter.wallAssemblies?.[0]?.uValue ?? 1.5;
    let currentTemp = startTemp;

    // Air mass inside shelter: Volume * Air Density (1.2 kg/m3) * Specific Heat (1000 J/kgK)
    const volume = shelter.length * shelter.width * shelter.height;
    const thermalMassAir = volume * 1.2 * 1000;

    const dtSeconds = 3600; // 1 hr step step

    return outdoorTemps.map((outTemp, hourIndex) => {
      const qWallLoss = this.calculateConductiveHeatTransfer(
        avgWallUValue,
        wallArea,
        currentTemp,
        outTemp,
      );
      const qRoofLoss = this.calculateConductiveHeatTransfer(
        avgWallUValue * 1.2,
        roofArea,
        currentTemp,
        outTemp,
      );
      const totalHeatLoss = qWallLoss + qRoofLoss;

      const currentIrradiance = solarIrradiance[hourIndex] || 0;
      const windowArea =
        shelter.openings?.reduce(
          (sum: number, op: Opening) =>
            op.type === 'Window' ? sum + op.width * op.height : sum,
          0,
        ) || 5;

      const qSolar = this.calculateSolarGain(
        windowArea,
        currentIrradiance,
        0.7,
        0.5,
      );

      const netHeatRate = qSolar - totalHeatLoss;

      // dT = Q_net * dt / (m * Cp)
      const deltaT = (netHeatRate * dtSeconds) / thermalMassAir;
      currentTemp = currentTemp + deltaT;

      return {
        hour: hourIndex,
        outdoorTemp: outTemp,
        indoorTemp: Number(currentTemp.toFixed(2)),
        heatLossWatts: Number(totalHeatLoss.toFixed(2)),
        solarGainWatts: Number(qSolar.toFixed(2)),
      };
    });
  }
}
