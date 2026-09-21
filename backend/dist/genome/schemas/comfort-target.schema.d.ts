import { Document } from 'mongoose';
export type ComfortTargetDocument = ComfortTarget & Document;
export declare class ComfortTarget {
    minIndoorTempC: number;
    maxIndoorTempC: number;
    comfortDurationHours: number;
    sunsetHour: number;
    maxExternalHeatingWh: number;
    maxShelterLengthM?: number;
    estimatedBudgetINR?: number;
    climateProfileId?: string;
    avgOutdoorTempC: number;
    tempAmplitudeC: number;
    peakSolarIrradianceW: number;
    candidateCount: number;
    optimizationIterations: number;
}
export declare const ComfortTargetSchema: import("mongoose").Schema<ComfortTarget, import("mongoose").Model<ComfortTarget, any, any, any, any, any, ComfortTarget>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ComfortTarget, Document<unknown, {}, ComfortTarget, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ComfortTarget & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    minIndoorTempC?: import("mongoose").SchemaDefinitionProperty<number, ComfortTarget, Document<unknown, {}, ComfortTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComfortTarget & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    maxIndoorTempC?: import("mongoose").SchemaDefinitionProperty<number, ComfortTarget, Document<unknown, {}, ComfortTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComfortTarget & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    comfortDurationHours?: import("mongoose").SchemaDefinitionProperty<number, ComfortTarget, Document<unknown, {}, ComfortTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComfortTarget & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sunsetHour?: import("mongoose").SchemaDefinitionProperty<number, ComfortTarget, Document<unknown, {}, ComfortTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComfortTarget & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    maxExternalHeatingWh?: import("mongoose").SchemaDefinitionProperty<number, ComfortTarget, Document<unknown, {}, ComfortTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComfortTarget & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    maxShelterLengthM?: import("mongoose").SchemaDefinitionProperty<number | undefined, ComfortTarget, Document<unknown, {}, ComfortTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComfortTarget & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    estimatedBudgetINR?: import("mongoose").SchemaDefinitionProperty<number | undefined, ComfortTarget, Document<unknown, {}, ComfortTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComfortTarget & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    climateProfileId?: import("mongoose").SchemaDefinitionProperty<string | undefined, ComfortTarget, Document<unknown, {}, ComfortTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComfortTarget & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    avgOutdoorTempC?: import("mongoose").SchemaDefinitionProperty<number, ComfortTarget, Document<unknown, {}, ComfortTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComfortTarget & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    tempAmplitudeC?: import("mongoose").SchemaDefinitionProperty<number, ComfortTarget, Document<unknown, {}, ComfortTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComfortTarget & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    peakSolarIrradianceW?: import("mongoose").SchemaDefinitionProperty<number, ComfortTarget, Document<unknown, {}, ComfortTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComfortTarget & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    candidateCount?: import("mongoose").SchemaDefinitionProperty<number, ComfortTarget, Document<unknown, {}, ComfortTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComfortTarget & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    optimizationIterations?: import("mongoose").SchemaDefinitionProperty<number, ComfortTarget, Document<unknown, {}, ComfortTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComfortTarget & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, ComfortTarget>;
