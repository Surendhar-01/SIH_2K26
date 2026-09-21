import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { NestFactory } from '@nestjs/core';
import { Model } from 'mongoose';
import {
  Material,
  MaterialDocument,
} from './materials/schemas/material.schema';
import { Climate, ClimateDocument } from './climate/schemas/climate.schema';
import { Pcm, PcmDocument } from './pcm/schemas/pcm.schema';
import { Shelter, ShelterDocument } from './shelters/schemas/shelter.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const materialModel = app.get<Model<MaterialDocument>>(
    getModelToken(Material.name),
  );
  const climateModel = app.get<Model<ClimateDocument>>(
    getModelToken(Climate.name),
  );
  const pcmModel = app.get<Model<PcmDocument>>(getModelToken(Pcm.name));
  const shelterModel = app.get<Model<ShelterDocument>>(
    getModelToken(Shelter.name),
  );

  console.log('🌱 Seeding database...');

  // Seed Materials
  const materialsCount = await materialModel.countDocuments();
  if (materialsCount === 0) {
    await materialModel.insertMany([
      {
        name: 'Expanded Polystyrene (EPS)',
        category: 'Insulation',
        thermalConductivity: 0.035,
        density: 25,
        specificHeat: 1300,
        defaultThickness: 0.1,
        costPerUnit: 450,
      },
      {
        name: 'Glass Wool Insulation',
        category: 'Insulation',
        thermalConductivity: 0.04,
        density: 24,
        specificHeat: 840,
        defaultThickness: 0.08,
        costPerUnit: 350,
      },
      {
        name: 'Polyurethane Foam (PUF)',
        category: 'Insulation',
        thermalConductivity: 0.022,
        density: 32,
        specificHeat: 1400,
        defaultThickness: 0.05,
        costPerUnit: 600,
      },
      {
        name: 'Reinforced Concrete',
        category: 'Structure',
        thermalConductivity: 1.5,
        density: 2400,
        specificHeat: 1000,
        defaultThickness: 0.2,
        costPerUnit: 800,
      },
      {
        name: 'Mud-Brick / Adobe',
        category: 'Vernacular',
        thermalConductivity: 0.7,
        density: 1700,
        specificHeat: 1000,
        defaultThickness: 0.3,
        costPerUnit: 150,
      },
      {
        name: 'Double Glazed Glass',
        category: 'Glazing',
        thermalConductivity: 1.1,
        density: 2500,
        specificHeat: 840,
        defaultThickness: 0.02,
        costPerUnit: 1200,
      },
    ]);
    console.log('✅ Standard engineering materials seeded');
  }

  // Seed Ladakh Climate
  const climateCount = await climateModel.countDocuments();
  if (climateCount === 0) {
    await climateModel.create({
      locationName: 'Ladakh High-Altitude Outpost',
      latitude: 34.1526,
      longitude: 77.5771,
      altitude: 3500,
      solarIrradiance: 850,
      averageTemp: -2.5,
      minTemp: -20,
      maxTemp: 15,
    });
    console.log('✅ Ladakh atmospheric climate seeded');
  }

  // Seed Phase Change Materials (PCM)
  const pcmCount = await pcmModel.countDocuments();
  if (pcmCount === 0) {
    await pcmModel.insertMany([
      {
        name: 'BioPCM M27 (Melting Point 27°C)',
        phaseChangeTemperature: 27,
        meltingRange: 2,
        latentHeat: 210000,
        density: 860,
        specificHeatSolid: 2000,
        specificHeatLiquid: 2200,
        thermalConductivity: 0.2,
        cost: 1200,
      },
      {
        name: 'Paraffin Wax RT21 (Melting Point 21°C)',
        phaseChangeTemperature: 21,
        meltingRange: 3,
        latentHeat: 170000,
        density: 780,
        specificHeatSolid: 1800,
        specificHeatLiquid: 2100,
        thermalConductivity: 0.15,
        cost: 950,
      },
      {
        name: 'Inorganic Salt Hydrate (18°C)',
        phaseChangeTemperature: 18,
        meltingRange: 1.5,
        latentHeat: 190000,
        density: 1500,
        specificHeatSolid: 1600,
        specificHeatLiquid: 1900,
        thermalConductivity: 0.54,
        cost: 1100,
      },
    ]);
    console.log('✅ Phase Change Materials (PCM) seeded');
  }

  // Seed Baseline Shelter Prototype
  const shelterCount = await shelterModel.countDocuments();
  if (shelterCount === 0) {
    await shelterModel.create({
      name: 'DRDO High-Altitude Baseline Shelter',
      length: 8,
      width: 4,
      height: 3,
      orientationAngle: 180,
      occupancyCount: 6,
      wallAssemblies: [
        {
          name: 'Composite Insulated Wall',
          orientation: 'South',
          uValue: 0.35,
          thickness: 0.25,
          totalRValue: 4.54,
          layers: [],
        },
      ],
      openings: [
        {
          type: 'Window',
          width: 2,
          height: 1.5,
          uValue: 1.5,
          orientation: 'South',
          shgc: 0.7,
        },
      ],
    });
    console.log('✅ Baseline DRDO Shelter Prototype seeded');
  }

  console.log('🎉 Seeding completed successfully!');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
