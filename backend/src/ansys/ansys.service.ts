import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AnsysJob, AnsysJobDocument } from './schemas/ansys-job.schema';

@Injectable()
export class AnsysService {
  constructor(
    @InjectModel(AnsysJob.name) private ansysJobModel: Model<AnsysJobDocument>,
  ) {}

  async createJob(shelterId: string): Promise<AnsysJobDocument> {
    const newJob = new this.ansysJobModel({
      shelterId: new Types.ObjectId(shelterId),
      status: 'QUEUED',
    });
    return newJob.save();
  }

  async getJob(jobId: string): Promise<AnsysJobDocument | null> {
    return this.ansysJobModel.findById(jobId).exec();
  }

  async processJob(jobId: string): Promise<AnsysJobDocument | null> {
    const job = await this.getJob(jobId);
    if (!job) return null;

    job.status = 'PREPARING';
    await job.save();

    // Adapter mocks exporting geometry/thermal APDL commands.
    job.exportFilePath = `/exports/ansys/job_${jobId}.mac`;
    job.status = 'COMPLETED';
    return job.save();
  }
}
