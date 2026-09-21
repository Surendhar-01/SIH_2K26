import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnsysService } from './ansys.service';
import { AnsysController } from './ansys.controller';
import { AnsysJob, AnsysJobSchema } from './schemas/ansys-job.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnsysJob.name, schema: AnsysJobSchema },
    ]),
  ],
  controllers: [AnsysController],
  providers: [AnsysService],
})
export class AnsysModule {}
