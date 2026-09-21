import { Document } from 'mongoose';
export type MaterialDocument = Material & Document;
export declare class Material {
    name: string;
    category: string;
    thermalConductivity: number;
    density: number;
    specificHeat: number;
    emissivity?: number;
    solarAbsorptivity?: number;
    defaultThickness?: number;
    costPerUnit?: number;
    source?: string;
}
export declare const MaterialSchema: import("mongoose").Schema<Material, import("mongoose").Model<Material, any, any, any, any, any, Material>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Material, Document<unknown, {}, Material, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Material & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Material, Document<unknown, {}, Material, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Material & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string, Material, Document<unknown, {}, Material, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Material & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    thermalConductivity?: import("mongoose").SchemaDefinitionProperty<number, Material, Document<unknown, {}, Material, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Material & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    density?: import("mongoose").SchemaDefinitionProperty<number, Material, Document<unknown, {}, Material, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Material & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    specificHeat?: import("mongoose").SchemaDefinitionProperty<number, Material, Document<unknown, {}, Material, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Material & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    emissivity?: import("mongoose").SchemaDefinitionProperty<number | undefined, Material, Document<unknown, {}, Material, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Material & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    solarAbsorptivity?: import("mongoose").SchemaDefinitionProperty<number | undefined, Material, Document<unknown, {}, Material, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Material & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    defaultThickness?: import("mongoose").SchemaDefinitionProperty<number | undefined, Material, Document<unknown, {}, Material, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Material & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    costPerUnit?: import("mongoose").SchemaDefinitionProperty<number | undefined, Material, Document<unknown, {}, Material, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Material & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<string | undefined, Material, Document<unknown, {}, Material, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Material & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Material>;
