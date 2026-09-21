import { Document } from 'mongoose';
export type PcmDocument = Pcm & Document;
export declare class Pcm {
    name: string;
    phaseChangeTemperature: number;
    meltingRange: number;
    latentHeat: number;
    density: number;
    specificHeatSolid: number;
    specificHeatLiquid: number;
    thermalConductivity: number;
    cost?: number;
    source?: string;
}
export declare const PcmSchema: import("mongoose").Schema<Pcm, import("mongoose").Model<Pcm, any, any, any, any, any, Pcm>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Pcm, Document<unknown, {}, Pcm, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Pcm & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Pcm, Document<unknown, {}, Pcm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pcm & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    phaseChangeTemperature?: import("mongoose").SchemaDefinitionProperty<number, Pcm, Document<unknown, {}, Pcm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pcm & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    meltingRange?: import("mongoose").SchemaDefinitionProperty<number, Pcm, Document<unknown, {}, Pcm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pcm & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    latentHeat?: import("mongoose").SchemaDefinitionProperty<number, Pcm, Document<unknown, {}, Pcm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pcm & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    density?: import("mongoose").SchemaDefinitionProperty<number, Pcm, Document<unknown, {}, Pcm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pcm & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    specificHeatSolid?: import("mongoose").SchemaDefinitionProperty<number, Pcm, Document<unknown, {}, Pcm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pcm & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    specificHeatLiquid?: import("mongoose").SchemaDefinitionProperty<number, Pcm, Document<unknown, {}, Pcm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pcm & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    thermalConductivity?: import("mongoose").SchemaDefinitionProperty<number, Pcm, Document<unknown, {}, Pcm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pcm & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    cost?: import("mongoose").SchemaDefinitionProperty<number | undefined, Pcm, Document<unknown, {}, Pcm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pcm & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<string | undefined, Pcm, Document<unknown, {}, Pcm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pcm & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Pcm>;
