import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MaterialsModule } from './materials/materials.module';
import { ClimateModule } from './climate/climate.module';
import { SheltersModule } from './shelters/shelters.module';
import { ThermalModule } from './thermal/thermal.module';
import { OptimizationModule } from './optimization/optimization.module';
import { ComparisonModule } from './comparison/comparison.module';
import { PcmModule } from './pcm/pcm.module';
import { IoTModule } from './iot/iot.module';
import { AnsysModule } from './ansys/ansys.module';
import { ReportsModule } from './reports/reports.module';
import { GenomeModule } from './genome/genome.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    MaterialsModule,
    ClimateModule,
    SheltersModule,
    ThermalModule,
    OptimizationModule,
    ComparisonModule,
    PcmModule,
    IoTModule,
    AnsysModule,
    ReportsModule,
    GenomeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
