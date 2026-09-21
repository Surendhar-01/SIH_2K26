import { SheltersService } from './shelters.service';
import { Shelter } from './schemas/shelter.schema';
export declare class SheltersController {
    private readonly sheltersService;
    constructor(sheltersService: SheltersService);
    create(createShelterDto: Partial<Shelter>): Promise<import("./schemas/shelter.schema").ShelterDocument>;
    findAll(): Promise<import("./schemas/shelter.schema").ShelterDocument[]>;
    findOne(id: string): Promise<import("./schemas/shelter.schema").ShelterDocument | null>;
}
