import { Document } from 'mongoose';
export type ThermalGenomeDocument = ThermalGenome & Document;
export type GenomeRunDocument = GenomeRun & Document;
export type GenomeStatus = 'Evaluating' | 'Rejected' | 'Candidate' | 'Optimized' | 'Recommended';
export type RecommendationCategory = 'MaxThermalAutonomy' | 'MinEnergyDemand' | 'Balanced';
export declare class FailurePrediction {
    hoursToComfortFailure: number;
    wallLossPercent: number;
    roofLossPercent: number;
    windowLossPercent: number;
    otherLossPercent: number;
}
export declare class WhyRecommendedItem {
    factor: string;
    explanation: string;
}
export declare class ThermalGenome {
    runId: string;
    genomeIndex: number;
    shape: string;
    length: number;
    width: number;
    height: number;
    orientationAngle: number;
    wallUValue: number;
    roofUValue: number;
    insulationType: string;
    insulationThicknessMm: number;
    windowRatio: number;
    windowOrientation: string;
    pcmType: string | null;
    pcmMassKg: number;
    pcmPlacement: string;
    thermalMassRating: string;
    status: GenomeStatus;
    thermalAutonomyHours: number;
    minNightTemp: number;
    peakDayTemp: number;
    totalHeatLossWh: number;
    totalSolarGainWh: number;
    externalHeatingDemandWh: number;
    climateResilienceScore: number;
    climateShockResults: Record<string, 'PASS' | 'WARNING' | 'FAIL'>;
    failurePrediction: FailurePrediction | null;
    improvementSuggestions: string[];
    whyRecommended: WhyRecommendedItem[];
    sunsetSurvivalCurve: Array<{
        hour: number;
        indoorTemp: number;
        phase: string;
    }>;
    recommendationCategory: RecommendationCategory | null;
}
export declare const ThermalGenomeSchema: import("mongoose").Schema<ThermalGenome, import("mongoose").Model<ThermalGenome, any, any, any, any, any, ThermalGenome>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ThermalGenome, Document<unknown, {}, ThermalGenome, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    runId?: import("mongoose").SchemaDefinitionProperty<string, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    genomeIndex?: import("mongoose").SchemaDefinitionProperty<number, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    shape?: import("mongoose").SchemaDefinitionProperty<string, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    length?: import("mongoose").SchemaDefinitionProperty<number, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    width?: import("mongoose").SchemaDefinitionProperty<number, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    height?: import("mongoose").SchemaDefinitionProperty<number, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    orientationAngle?: import("mongoose").SchemaDefinitionProperty<number, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    wallUValue?: import("mongoose").SchemaDefinitionProperty<number, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    roofUValue?: import("mongoose").SchemaDefinitionProperty<number, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    insulationType?: import("mongoose").SchemaDefinitionProperty<string, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    insulationThicknessMm?: import("mongoose").SchemaDefinitionProperty<number, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    windowRatio?: import("mongoose").SchemaDefinitionProperty<number, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    windowOrientation?: import("mongoose").SchemaDefinitionProperty<string, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    pcmType?: import("mongoose").SchemaDefinitionProperty<string | null, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    pcmMassKg?: import("mongoose").SchemaDefinitionProperty<number, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    pcmPlacement?: import("mongoose").SchemaDefinitionProperty<string, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    thermalMassRating?: import("mongoose").SchemaDefinitionProperty<string, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<GenomeStatus, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    thermalAutonomyHours?: import("mongoose").SchemaDefinitionProperty<number, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    minNightTemp?: import("mongoose").SchemaDefinitionProperty<number, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    peakDayTemp?: import("mongoose").SchemaDefinitionProperty<number, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    totalHeatLossWh?: import("mongoose").SchemaDefinitionProperty<number, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    totalSolarGainWh?: import("mongoose").SchemaDefinitionProperty<number, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    externalHeatingDemandWh?: import("mongoose").SchemaDefinitionProperty<number, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    climateResilienceScore?: import("mongoose").SchemaDefinitionProperty<number, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    climateShockResults?: import("mongoose").SchemaDefinitionProperty<Record<string, "PASS" | "WARNING" | "FAIL">, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    failurePrediction?: import("mongoose").SchemaDefinitionProperty<FailurePrediction | null, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    improvementSuggestions?: import("mongoose").SchemaDefinitionProperty<string[], ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    whyRecommended?: import("mongoose").SchemaDefinitionProperty<WhyRecommendedItem[], ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sunsetSurvivalCurve?: import("mongoose").SchemaDefinitionProperty<{
        hour: number;
        indoorTemp: number;
        phase: string;
    }[], ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    recommendationCategory?: import("mongoose").SchemaDefinitionProperty<RecommendationCategory | null, ThermalGenome, Document<unknown, {}, ThermalGenome, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThermalGenome & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, ThermalGenome>;
export declare class GenomeRun {
    runId: string;
    status: 'running' | 'completed' | 'failed';
    comfortTarget: Record<string, unknown>;
    totalCandidates: number;
    evaluatedCandidates: number;
}
export declare const GenomeRunSchema: import("mongoose").Schema<GenomeRun, import("mongoose").Model<GenomeRun, any, any, any, any, any, GenomeRun>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, GenomeRun, Document<unknown, {}, GenomeRun, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<GenomeRun & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    runId?: import("mongoose").SchemaDefinitionProperty<string, GenomeRun, Document<unknown, {}, GenomeRun, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GenomeRun & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"running" | "completed" | "failed", GenomeRun, Document<unknown, {}, GenomeRun, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GenomeRun & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    comfortTarget?: import("mongoose").SchemaDefinitionProperty<Record<string, unknown>, GenomeRun, Document<unknown, {}, GenomeRun, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GenomeRun & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    totalCandidates?: import("mongoose").SchemaDefinitionProperty<number, GenomeRun, Document<unknown, {}, GenomeRun, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GenomeRun & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    evaluatedCandidates?: import("mongoose").SchemaDefinitionProperty<number, GenomeRun, Document<unknown, {}, GenomeRun, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GenomeRun & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, GenomeRun>;
