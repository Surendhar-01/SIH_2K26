import { Model } from 'mongoose';
import { ThermalService } from '../thermal/thermal.service';
import { ThermalGenome, ThermalGenomeDocument, GenomeRun, GenomeRunDocument } from './schemas/genome.schema';
interface ComfortConstraints {
    minIndoorTempC: number;
    maxIndoorTempC: number;
    comfortDurationHours: number;
    sunsetHour: number;
    maxExternalHeatingWh: number;
    avgOutdoorTempC: number;
    tempAmplitudeC: number;
    peakSolarIrradianceW: number;
    candidateCount?: number;
    optimizationIterations?: number;
}
export declare class GenomeService {
    private genomeModel;
    private runModel;
    private readonly thermalService;
    private readonly logger;
    constructor(genomeModel: Model<ThermalGenomeDocument>, runModel: Model<GenomeRunDocument>, thermalService: ThermalService);
    startRun(target: ComfortConstraints): Promise<{
        runId: string;
    }>;
    getRun(runId: string): Promise<{
        run: (import("mongoose").Document<unknown, {}, GenomeRunDocument, {}, import("mongoose").DefaultSchemaOptions> & GenomeRun & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | null;
        genomes: (import("mongoose").Document<unknown, {}, ThermalGenomeDocument, {}, import("mongoose").DefaultSchemaOptions> & ThermalGenome & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getRecommendations(runId: string): Promise<{
        maxThermalAutonomy: import("mongoose").Document<unknown, {}, ThermalGenomeDocument, {}, import("mongoose").DefaultSchemaOptions> & ThermalGenome & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        minEnergyDemand: import("mongoose").Document<unknown, {}, ThermalGenomeDocument, {}, import("mongoose").DefaultSchemaOptions> & ThermalGenome & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        balanced: import("mongoose").Document<unknown, {}, ThermalGenomeDocument, {}, import("mongoose").DefaultSchemaOptions> & ThermalGenome & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    improveGenome(genomeId: string, target: ComfortConstraints): Promise<(import("mongoose").Document<unknown, {}, ThermalGenomeDocument, {}, import("mongoose").DefaultSchemaOptions> & ThermalGenome & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    ansysValidate(genomeId: string): Promise<{
        genomeId: string;
        ansysStatus: string;
        message: string;
    } | null>;
    private executeGenomeLoop;
    private generateSeedPool;
    private makeSeed;
    private evaluateSingleGenome;
    private runClimateShockTests;
    private applyImprovementMutations;
    private buildOutdoorProfile;
    private buildSolarProfile;
    private buildShelterShape;
    private extractParams;
}
export {};
