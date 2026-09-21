import { ReportsService } from './reports.service';
import { ShelterShape } from '../thermal/thermal.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    generatePareto(body: {
        baseShelter: ShelterShape;
        indoorTemp: number;
        outdoorTemps: number[];
        solarIrradiance: number[];
    }): {
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
