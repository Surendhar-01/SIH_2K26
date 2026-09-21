import { ComparisonService } from './comparison.service';
export declare class ComparisonController {
    private readonly comparisonService;
    constructor(comparisonService: ComparisonService);
    compareDesigns(body: {
        designs: any[];
        indoorTemp: number;
        outdoorTemps: number[];
        solarIrradiance: number[];
    }): {
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
    compareBaseline(body: {
        baselineShelter: any;
        optimizedShelter: any;
        indoorTemp: number;
        outdoorTemps: number[];
        solarIrradiance: number[];
    }): {
        baselineHeatingRequirement: number;
        optimizedHeatingRequirement: number;
        energySaved: number;
        percentageReduction: number;
    };
}
