import { Document, Types } from 'mongoose';
export type ShelterDocument = Shelter & Document;
export declare class Layer {
    materialId: Types.ObjectId;
    thickness: number;
}
export declare const LayerSchema: import("mongoose").Schema<Layer, import("mongoose").Model<Layer, any, any, any, any, any, Layer>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Layer, Document<unknown, {}, Layer, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Layer & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    materialId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Layer, Document<unknown, {}, Layer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Layer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    thickness?: import("mongoose").SchemaDefinitionProperty<number, Layer, Document<unknown, {}, Layer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Layer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Layer>;
export declare class WallAssembly {
    name: string;
    layers: Layer[];
    totalRValue: number;
    uValue: number;
}
export declare const WallAssemblySchema: import("mongoose").Schema<WallAssembly, import("mongoose").Model<WallAssembly, any, any, any, any, any, WallAssembly>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WallAssembly, Document<unknown, {}, WallAssembly, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<WallAssembly & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string, WallAssembly, Document<unknown, {}, WallAssembly, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WallAssembly & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    layers?: import("mongoose").SchemaDefinitionProperty<Layer[], WallAssembly, Document<unknown, {}, WallAssembly, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WallAssembly & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    totalRValue?: import("mongoose").SchemaDefinitionProperty<number, WallAssembly, Document<unknown, {}, WallAssembly, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WallAssembly & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    uValue?: import("mongoose").SchemaDefinitionProperty<number, WallAssembly, Document<unknown, {}, WallAssembly, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WallAssembly & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, WallAssembly>;
export declare class Opening {
    type: string;
    width: number;
    height: number;
    uValue: number;
    shgc?: number;
    orientation: string;
}
export declare const OpeningSchema: import("mongoose").Schema<Opening, import("mongoose").Model<Opening, any, any, any, any, any, Opening>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Opening, Document<unknown, {}, Opening, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Opening & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    type?: import("mongoose").SchemaDefinitionProperty<string, Opening, Document<unknown, {}, Opening, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Opening & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    width?: import("mongoose").SchemaDefinitionProperty<number, Opening, Document<unknown, {}, Opening, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Opening & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    height?: import("mongoose").SchemaDefinitionProperty<number, Opening, Document<unknown, {}, Opening, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Opening & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    uValue?: import("mongoose").SchemaDefinitionProperty<number, Opening, Document<unknown, {}, Opening, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Opening & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    shgc?: import("mongoose").SchemaDefinitionProperty<number | undefined, Opening, Document<unknown, {}, Opening, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Opening & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    orientation?: import("mongoose").SchemaDefinitionProperty<string, Opening, Document<unknown, {}, Opening, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Opening & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Opening>;
export declare class Shelter {
    name: string;
    length: number;
    width: number;
    height: number;
    orientationAngle: number;
    wallAssemblies: WallAssembly[];
    openings: Opening[];
    occupancyCount?: number;
}
export declare const ShelterSchema: import("mongoose").Schema<Shelter, import("mongoose").Model<Shelter, any, any, any, any, any, Shelter>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Shelter, Document<unknown, {}, Shelter, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Shelter & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Shelter, Document<unknown, {}, Shelter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shelter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    length?: import("mongoose").SchemaDefinitionProperty<number, Shelter, Document<unknown, {}, Shelter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shelter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    width?: import("mongoose").SchemaDefinitionProperty<number, Shelter, Document<unknown, {}, Shelter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shelter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    height?: import("mongoose").SchemaDefinitionProperty<number, Shelter, Document<unknown, {}, Shelter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shelter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    orientationAngle?: import("mongoose").SchemaDefinitionProperty<number, Shelter, Document<unknown, {}, Shelter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shelter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    wallAssemblies?: import("mongoose").SchemaDefinitionProperty<WallAssembly[], Shelter, Document<unknown, {}, Shelter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shelter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    openings?: import("mongoose").SchemaDefinitionProperty<Opening[], Shelter, Document<unknown, {}, Shelter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shelter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    occupancyCount?: import("mongoose").SchemaDefinitionProperty<number | undefined, Shelter, Document<unknown, {}, Shelter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shelter & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Shelter>;
