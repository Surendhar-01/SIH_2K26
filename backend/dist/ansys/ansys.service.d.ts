import { Model } from 'mongoose';
import { AnsysJobDocument } from './schemas/ansys-job.schema';
export declare class AnsysService {
    private ansysJobModel;
    constructor(ansysJobModel: Model<AnsysJobDocument>);
    createJob(shelterId: string): Promise<AnsysJobDocument>;
    getJob(jobId: string): Promise<AnsysJobDocument | null>;
    processJob(jobId: string): Promise<AnsysJobDocument | null>;
}
