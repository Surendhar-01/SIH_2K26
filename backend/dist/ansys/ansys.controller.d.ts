import { AnsysService } from './ansys.service';
export declare class AnsysController {
    private readonly ansysService;
    constructor(ansysService: AnsysService);
    createJob(body: {
        shelterId: string;
    }): Promise<import("./schemas/ansys-job.schema").AnsysJobDocument>;
    runJob(jobId: string): Promise<import("./schemas/ansys-job.schema").AnsysJobDocument | null>;
    getJob(jobId: string): Promise<import("./schemas/ansys-job.schema").AnsysJobDocument | null>;
}
