import { Document } from 'mongoose';
export type SensorReadingDocument = SensorReading & Document;
export declare class SensorReading {
    deviceId: string;
    indoorTemp?: number;
    outdoorTemp?: number;
    humidity?: number;
    solarIrradiance?: number;
    windSpeed?: number;
}
export declare const SensorReadingSchema: import("mongoose").Schema<SensorReading, import("mongoose").Model<SensorReading, any, any, any, any, any, SensorReading>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SensorReading, Document<unknown, {}, SensorReading, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SensorReading & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    deviceId?: import("mongoose").SchemaDefinitionProperty<string, SensorReading, Document<unknown, {}, SensorReading, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SensorReading & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    indoorTemp?: import("mongoose").SchemaDefinitionProperty<number | undefined, SensorReading, Document<unknown, {}, SensorReading, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SensorReading & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    outdoorTemp?: import("mongoose").SchemaDefinitionProperty<number | undefined, SensorReading, Document<unknown, {}, SensorReading, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SensorReading & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    humidity?: import("mongoose").SchemaDefinitionProperty<number | undefined, SensorReading, Document<unknown, {}, SensorReading, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SensorReading & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    solarIrradiance?: import("mongoose").SchemaDefinitionProperty<number | undefined, SensorReading, Document<unknown, {}, SensorReading, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SensorReading & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    windSpeed?: import("mongoose").SchemaDefinitionProperty<number | undefined, SensorReading, Document<unknown, {}, SensorReading, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SensorReading & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, SensorReading>;
