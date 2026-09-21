import { OptimizationService } from './optimization.service';
export declare class OptimizationController {
    private readonly optimizationService;
    constructor(optimizationService: OptimizationService);
    runOptimization(body: {
        baseShelter: any;
        indoorTemp: number;
        outdoorTemps: number[];
        solarIrradiance: number[];
    }): {
        recommendedDesign: import("../thermal/thermal.service").ShelterShape;
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
        paretoFront: import("./optimization.service").EvaluatedCandidate[];
    };
}
