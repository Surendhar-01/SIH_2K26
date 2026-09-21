import { Document, Types } from 'mongoose';
export type AnsysJobDocument = AnsysJob & Document;
export declare class AnsysJob {
    status: string;
    shelterId: Types.ObjectId;
    exportFilePath?: string;
    results?: any;
}
export declare const AnsysJobSchema: import("mongoose").Schema<AnsysJob, import("mongoose").Model<AnsysJob, any, any, any, any, any, AnsysJob>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AnsysJob, Document<unknown, {}, AnsysJob, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AnsysJob & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    status?: import("mongoose").SchemaDefinitionProperty<string, AnsysJob, Document<unknown, {}, AnsysJob, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AnsysJob & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    shelterId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AnsysJob, Document<unknown, {}, AnsysJob, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AnsysJob & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    exportFilePath?: import("mongoose").SchemaDefinitionProperty<string | undefined, AnsysJob, Document<unknown, {}, AnsysJob, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AnsysJob & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    results?: import("mongoose").SchemaDefinitionProperty<any, AnsysJob, Document<unknown, {}, AnsysJob, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AnsysJob & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, AnsysJob>;
