import { ThermalService, ShelterShape } from '../thermal/thermal.service';
export declare class ComparisonService {
    private readonly thermalService;
    constructor(thermalService: ThermalService);
    compareDesigns(designs: ShelterShape[], indoorTemp: number, outdoorTemps: number[], solarIrradiance: number[]): {
        shelterId: string | undefined;
        thermalProfile: {
            hour: number;
            outdoorTemp: number;
            indoorTemp: number;
            heatLossWatts: number;
            solarGainWatts: number;
        }[];
        metrics: {
            totalSolarGain: number;
            totalHeatLoss: number;
            minTemp: number;
            maxTemp: number;
            avgNightTemp: number;
        };
    }[];
    calculateEnergySaving(baselineShelter: ShelterShape, optimizedShelter: ShelterShape, indoorTemp: number, outdoorTemps: number[], solarIrradiance: number[]): {
        baselineHeatingRequirement: number;
        optimizedHeatingRequirement: number;
        energySaved: number;
        percentageReduction: number;
    };
}
