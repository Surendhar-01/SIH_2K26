import { Model } from 'mongoose';
import { Material, MaterialDocument } from './schemas/material.schema';
export declare class MaterialsService {
    private materialModel;
    constructor(materialModel: Model<MaterialDocument>);
    create(materialDto: Partial<Material>): Promise<MaterialDocument>;
    findAll(): Promise<MaterialDocument[]>;
    findById(id: string): Promise<MaterialDocument | null>;
}
