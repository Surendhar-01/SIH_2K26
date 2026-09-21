import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pcm, PcmDocument } from './schemas/pcm.schema';

@Injectable()
export class PcmService {
  constructor(@InjectModel(Pcm.name) private pcmModel: Model<PcmDocument>) {}

  async create(pcmDto: Partial<Pcm>): Promise<PcmDocument> {
    return new this.pcmModel(pcmDto).save();
  }

  async findAll(): Promise<PcmDocument[]> {
    return this.pcmModel.find().exec();
  }
}
