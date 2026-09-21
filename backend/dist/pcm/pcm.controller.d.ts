import { PcmService } from './pcm.service';
import { Pcm } from './schemas/pcm.schema';
export declare class PcmController {
    private readonly pcmService;
    constructor(pcmService: PcmService);
    create(createPcmDto: Partial<Pcm>): Promise<import("./schemas/pcm.schema").PcmDocument>;
    findAll(): Promise<import("./schemas/pcm.schema").PcmDocument[]>;
}
