import { ThermalService } from './thermal.service';
export declare class ThermalController {
    private readonly thermalService;
    constructor(thermalService: ThermalService);
    predictTemperature(body: {
        shelterId: string;
        indoorTemp: number;
        outdoorTemps: number[];
        solarIrradiance: number[];
    }): Promise<{
        hour: number;
        outdoorTemp: number;
        indoorTemp: number;
        heatLossWatts: number;
        solarGainWatts: number;
    }[]>;
}
