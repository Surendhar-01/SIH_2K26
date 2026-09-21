import { OptimizationService } from '../optimization/optimization.service';
import { ShelterShape } from '../thermal/thermal.service';
export declare class ReportsService {
    private readonly optService;
    constructor(optService: OptimizationService);
    generateParetoReport(baseShelter: ShelterShape, indoorTemp: number, outdoorTemps: number[], solarIrradiance: number[]): {
        title: string;
        timestamp: string;
        recommendedDesign: Record<string, any>;
        paretoFrontierOptions: {
            rank: number;
            designName: string;
            nightTempRetention: number;
            solarGainUtility: number;
            heatLossRestriction: number;
            insulationCost: number;
        }[];
        aiReasoning: any[];
    };
}
