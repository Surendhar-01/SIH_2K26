import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shelter, ShelterDocument } from './schemas/shelter.schema';

@Injectable()
export class SheltersService {
  constructor(
    @InjectModel(Shelter.name) private shelterModel: Model<ShelterDocument>,
  ) {}

  async create(shelterDto: Partial<Shelter>): Promise<ShelterDocument> {
    return new this.shelterModel(shelterDto).save();
  }

  async findAll(): Promise<ShelterDocument[]> {
    return this.shelterModel
      .find()
      .populate('wallAssemblies.layers.materialId')
      .exec();
  }

  async findById(id: string): Promise<ShelterDocument | null> {
    return this.shelterModel
      .findById(id)
      .populate('wallAssemblies.layers.materialId')
      .exec();
  }
}
