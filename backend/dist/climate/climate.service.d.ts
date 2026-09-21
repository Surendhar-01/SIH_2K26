import { Model } from 'mongoose';
import { Climate, ClimateDocument } from './schemas/climate.schema';
export declare class ClimateService {
    private climateModel;
    constructor(climateModel: Model<ClimateDocument>);
    create(climateDto: Partial<Climate>): Promise<ClimateDocument>;
    findAll(): Promise<ClimateDocument[]>;
    findById(id: string): Promise<ClimateDocument | null>;
}
