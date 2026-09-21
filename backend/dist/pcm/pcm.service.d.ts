import { Model } from 'mongoose';
import { Pcm, PcmDocument } from './schemas/pcm.schema';
export declare class PcmService {
    private pcmModel;
    constructor(pcmModel: Model<PcmDocument>);
    create(pcmDto: Partial<Pcm>): Promise<PcmDocument>;
    findAll(): Promise<PcmDocument[]>;
}
