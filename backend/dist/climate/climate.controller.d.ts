import { ClimateService } from './climate.service';
import { Climate } from './schemas/climate.schema';
export declare class ClimateController {
    private readonly climateService;
    constructor(climateService: ClimateService);
    create(createClimateDto: Partial<Climate>): Promise<import("./schemas/climate.schema").ClimateDocument>;
    findAll(): Promise<import("./schemas/climate.schema").ClimateDocument[]>;
    findOne(id: string): Promise<import("./schemas/climate.schema").ClimateDocument | null>;
}
