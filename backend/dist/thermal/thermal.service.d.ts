type WallAssembly = {
    uValue: number;
    [key: string]: unknown;
};
type Opening = {
    type: string;
    width: number;
    height: number;
    [key: string]: unknown;
};
export type ShelterShape = {
    id?: string;
    name?: string;
    length: number;
    width: number;
    height: number;
    wallAssemblies?: WallAssembly[];
    openings?: Opening[];
    [key: string]: unknown;
};
export declare class ThermalService {
    calculateConductiveHeatTransfer(uValue: number, area: number, tIn: number, tOut: number): number;
    calculateSolarGain(area: number, irradiance: number, shgc: number, orientationFactor?: number): number;
    predictIndoorTemperature(shelter: ShelterShape, startTemp: number, outdoorTemps: number[], solarIrradiance: number[]): {
        hour: number;
        outdoorTemp: number;
        indoorTemp: number;
        heatLossWatts: number;
        solarGainWatts: number;
    }[];
}
export {};
