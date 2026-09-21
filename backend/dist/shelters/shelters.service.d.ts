import { Model } from 'mongoose';
import { Shelter, ShelterDocument } from './schemas/shelter.schema';
export declare class SheltersService {
    private shelterModel;
    constructor(shelterModel: Model<ShelterDocument>);
    create(shelterDto: Partial<Shelter>): Promise<ShelterDocument>;
    findAll(): Promise<ShelterDocument[]>;
    findById(id: string): Promise<ShelterDocument | null>;
}
