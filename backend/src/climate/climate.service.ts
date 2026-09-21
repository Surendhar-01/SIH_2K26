import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Climate, ClimateDocument } from './schemas/climate.schema';

@Injectable()
export class ClimateService {
  constructor(
    @InjectModel(Climate.name) private climateModel: Model<ClimateDocument>,
  ) {}

  async create(climateDto: Partial<Climate>): Promise<ClimateDocument> {
    return new this.climateModel(climateDto).save();
  }

  async findAll(): Promise<ClimateDocument[]> {
    return this.climateModel.find().exec();
  }

  async findById(id: string): Promise<ClimateDocument | null> {
    return this.climateModel.findById(id).exec();
  }
}
