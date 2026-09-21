import { Document } from 'mongoose';
export type ClimateDocument = Climate & Document;
export declare class Climate {
    locationName: string;
    latitude: number;
    longitude: number;
    altitude: number;
    solarIrradiance: number;
    averageTemp: number;
    minTemp: number;
    maxTemp: number;
}
export declare const ClimateSchema: import("mongoose").Schema<Climate, import("mongoose").Model<Climate, any, any, any, any, any, Climate>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Climate, Document<unknown, {}, Climate, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Climate & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    locationName?: import("mongoose").SchemaDefinitionProperty<string, Climate, Document<unknown, {}, Climate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Climate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    latitude?: import("mongoose").SchemaDefinitionProperty<number, Climate, Document<unknown, {}, Climate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Climate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    longitude?: import("mongoose").SchemaDefinitionProperty<number, Climate, Document<unknown, {}, Climate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Climate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    altitude?: import("mongoose").SchemaDefinitionProperty<number, Climate, Document<unknown, {}, Climate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Climate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    solarIrradiance?: import("mongoose").SchemaDefinitionProperty<number, Climate, Document<unknown, {}, Climate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Climate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    averageTemp?: import("mongoose").SchemaDefinitionProperty<number, Climate, Document<unknown, {}, Climate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Climate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    minTemp?: import("mongoose").SchemaDefinitionProperty<number, Climate, Document<unknown, {}, Climate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Climate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    maxTemp?: import("mongoose").SchemaDefinitionProperty<number, Climate, Document<unknown, {}, Climate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Climate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Climate>;
