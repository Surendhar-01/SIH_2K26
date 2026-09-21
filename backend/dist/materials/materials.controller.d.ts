import { MaterialsService } from './materials.service';
import { Material } from './schemas/material.schema';
export declare class MaterialsController {
    private readonly materialsService;
    constructor(materialsService: MaterialsService);
    create(createMaterialDto: Partial<Material>): Promise<import("./schemas/material.schema").MaterialDocument>;
    findAll(): Promise<import("./schemas/material.schema").MaterialDocument[]>;
    findOne(id: string): Promise<import("./schemas/material.schema").MaterialDocument | null>;
}
