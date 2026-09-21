import { GenomeService } from './genome.service';
export declare class GenomeController {
    private readonly genomeService;
    constructor(genomeService: GenomeService);
    startRun(body: {
        minIndoorTempC: number;
        maxIndoorTempC: number;
        comfortDurationHours: number;
        sunsetHour?: number;
        maxExternalHeatingWh?: number;
        avgOutdoorTempC?: number;
        tempAmplitudeC?: number;
        peakSolarIrradianceW?: number;
        candidateCount?: number;
        optimizationIterations?: number;
    }): Promise<{
        runId: string;
    }>;
    getRun(runId: string): Promise<{
        run: (import("mongoose").Document<unknown, {}, import("./schemas/genome.schema").GenomeRunDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/genome.schema").GenomeRun & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | null;
        genomes: (import("mongoose").Document<unknown, {}, import("./schemas/genome.schema").ThermalGenomeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/genome.schema").ThermalGenome & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getRecommendations(runId: string): Promise<{
        maxThermalAutonomy: import("mongoose").Document<unknown, {}, import("./schemas/genome.schema").ThermalGenomeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/genome.schema").ThermalGenome & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        minEnergyDemand: import("mongoose").Document<unknown, {}, import("./schemas/genome.schema").ThermalGenomeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/genome.schema").ThermalGenome & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        balanced: import("mongoose").Document<unknown, {}, import("./schemas/genome.schema").ThermalGenomeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/genome.schema").ThermalGenome & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    improveGenome(genomeId: string, target: {
        minIndoorTempC: number;
        maxIndoorTempC: number;
        comfortDurationHours: number;
        sunsetHour?: number;
        maxExternalHeatingWh?: number;
        avgOutdoorTempC?: number;
        tempAmplitudeC?: number;
        peakSolarIrradianceW?: number;
    }): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/genome.schema").ThermalGenomeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/genome.schema").ThermalGenome & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
}
