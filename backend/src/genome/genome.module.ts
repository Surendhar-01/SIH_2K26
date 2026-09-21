import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GenomeController } from './genome.controller';
import { GenomeService } from './genome.service';
import { ThermalGenome, ThermalGenomeSchema, GenomeRun, GenomeRunSchema } from './schemas/genome.schema';
import { ThermalModule } from '../thermal/thermal.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ThermalGenome.name, schema: ThermalGenomeSchema },
      { name: GenomeRun.name, schema: GenomeRunSchema },
    ]),
    ThermalModule,
  ],
  controllers: [GenomeController],
  providers: [GenomeService],
  exports: [GenomeService],
})
export class GenomeModule {}
