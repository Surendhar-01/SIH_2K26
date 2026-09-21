import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Material, MaterialDocument } from './schemas/material.schema';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectModel(Material.name) private materialModel: Model<MaterialDocument>,
  ) {}

  async create(materialDto: Partial<Material>): Promise<MaterialDocument> {
    return new this.materialModel(materialDto).save();
  }

  async findAll(): Promise<MaterialDocument[]> {
    return this.materialModel.find().exec();
  }

  async findById(id: string): Promise<MaterialDocument | null> {
    return this.materialModel.findById(id).exec();
  }
}
