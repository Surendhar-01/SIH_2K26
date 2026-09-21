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
export declare class OptimizationService {
    private readonly thermalService;
    constructor(thermalService: ThermalService);
    runOptimization(baseShelter: ShelterShape, indoorTemp: number, outdoorTemps: number[], solarIrradiance: number[]): {
        recommendedDesign: ShelterShape;
        performance: {
            heatLoss: number;
            solarGain: number;
            nightTemp: number;
            cost: number;
        };
        reasons: {
            factor: string;
            impact: string;
        }[];
        paretoFront: EvaluatedCandidate[];
    };
}
