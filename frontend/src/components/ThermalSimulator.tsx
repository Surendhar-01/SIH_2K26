import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { fetchLiveLocation } from '../utils/geolocation';

const defaults = {
  length: 8,
  width: 4,
  height: 3,
  uValue: 0.35,
  windowWidth: 2,
  avgOutdoor: -5,
  tempAmplitude: 10,
  peakSolar: 850,
  initialIndoor: 15,
};

type SimulationPoint = {
  hour: number;
  outdoorTemp: number;
  indoorTemp: number;
  heatLossWatts: number;
  solarGainWatts: number;
};

type LiveLocation = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

function numberValue(formData: FormData, key: keyof typeof defaults) {
  return Number(formData.get(key)) || defaults[key];
}

function estimateOutdoorFromLocation(latitude: number) {
  const hour = new Date().getHours();
  const dayCycle = Math.sin(((hour - 7) / 24) * Math.PI * 2) * 6;
  const latitudeCooling = Math.min(Math.abs(latitude) * 0.08, 4.5);
  return Math.round((22 + dayCycle - latitudeCooling) * 10) / 10;
}

function buildLocalSimulation(values: typeof defaults): SimulationPoint[] {
  let indoor = values.initialIndoor;
  const wallArea = 2 * values.length * values.height + 2 * values.width * values.height;
  const roofArea = values.length * values.width;
  const thermalMass = values.length * values.width * values.height * 1.2 * 1000;

  return Array.from({ length: 24 }, (_, hour) => {
    const outdoorTemp = values.avgOutdoor + Math.sin((hour * Math.PI) / 12) * values.tempAmplitude;
    const solarGainWatts =
      hour > 6 && hour < 18 ? Math.sin(((hour - 6) * Math.PI) / 12) * values.peakSolar * values.windowWidth * 1.5 * 0.35 : 0;
    const heatLossWatts = values.uValue * (wallArea + roofArea * 1.2) * (indoor - outdoorTemp);
    const passiveBuffer = (outdoorTemp - indoor) * 0.08;
    const solarLift = solarGainWatts / thermalMass;

    indoor = indoor + passiveBuffer + solarLift * 18;

    return {
      hour,
      outdoorTemp: Number(outdoorTemp.toFixed(2)),
      indoorTemp: Number(indoor.toFixed(2)),
      heatLossWatts: Number(heatLossWatts.toFixed(2)),
      solarGainWatts: Number(solarGainWatts.toFixed(2)),
    };
  });
}

export function ThermalSimulator() {
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null);
  const [liveOutdoorTemp, setLiveOutdoorTemp] = useState(defaults.avgOutdoor);
  const [data, setData] = useState<SimulationPoint[]>([]);

  const locationSummary = useMemo(() => {
    if (!liveLocation) {
      return 'Enable live location to use your current outdoor baseline.';
    }

    return `Lat ${liveLocation.latitude.toFixed(5)} / Long ${liveLocation.longitude.toFixed(5)} / Accuracy ${liveLocation.accuracy} m`;
  }, [liveLocation]);

  const enableLiveLocation = async () => {
    setLocationLoading(true);
    setLocationError('');
    try {
      const loc = await fetchLiveLocation();
      setLiveLocation(loc);
      setLiveOutdoorTemp(estimateOutdoorFromLocation(loc.latitude));
    } catch {
      setLocationError('Unable to detect location. Please check browser permissions or network.');
    } finally {
      setLocationLoading(false);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const values = {
      length: numberValue(formData, 'length'),
      width: numberValue(formData, 'width'),
      height: numberValue(formData, 'height'),
      uValue: numberValue(formData, 'uValue'),
      windowWidth: numberValue(formData, 'windowWidth'),
      avgOutdoor: liveOutdoorTemp,
      tempAmplitude: numberValue(formData, 'tempAmplitude'),
      peakSolar: numberValue(formData, 'peakSolar'),
      initialIndoor: numberValue(formData, 'initialIndoor'),
    };

    const outdoorTemps = Array.from({ length: 24 }, (_, i) =>
      values.avgOutdoor + Math.sin(i * Math.PI / 12) * values.tempAmplitude
    );
    const solarIrradiance = Array.from({ length: 24 }, (_, i) =>
      i > 6 && i < 18 ? Math.sin((i - 6) * Math.PI / 12) * values.peakSolar : 0
    );

    const localSimulation = buildLocalSimulation(values);
    setData(localSimulation);

    try {
      const res = await axios.post('http://localhost:3000/api/thermal/predict-temperature', {
        shelter: {
          length: values.length,
          width: values.width,
          height: values.height,
          wallAssemblies: [{ uValue: values.uValue }],
          openings: [{ type: 'Window', width: values.windowWidth, height: 1.5 }],
        },
        startTemp: values.initialIndoor,
        outdoorTemps,
        solarIrradiance,
      });
      const normalized = Array.isArray(res.data)
        ? res.data.map((point: Partial<SimulationPoint>, index: number) => ({
            ...localSimulation[index],
            ...point,
            hour: point.hour ?? index,
            outdoorTemp: Number(point.outdoorTemp ?? localSimulation[index].outdoorTemp),
            indoorTemp: Number(point.indoorTemp ?? localSimulation[index].indoorTemp),
          }))
        : localSimulation;
      setData(normalized);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-grid two-column">
      <section className="panel">
        <div className="panel-header">
          <h2>Thermal Simulation Parameters</h2>
        </div>
        <form className="form-stack" onSubmit={onSubmit}>
          <div className="live-location-control">
            <button className="primary-button" type="button" disabled={locationLoading} onClick={enableLiveLocation}>
              {locationLoading ? 'Reading Location...' : liveLocation ? 'Refresh Live Location' : 'Use Live Location'}
            </button>
            <span>{locationSummary}</span>
            {locationError && <strong>{locationError}</strong>}
          </div>
          <label>
            <span>Shelter Length (m)</span>
            <input name="length" type="number" min="1" defaultValue={defaults.length} />
          </label>
          <label>
            <span>Shelter Width (m)</span>
            <input name="width" type="number" min="1" defaultValue={defaults.width} />
          </label>
          <label>
            <span>Shelter Height (m)</span>
            <input name="height" type="number" min="1" defaultValue={defaults.height} />
          </label>
          <label>
            <span>Wall U-Value (W/m2K)</span>
            <input name="uValue" type="number" step="0.05" defaultValue={defaults.uValue} />
          </label>
          <label>
            <span>Window Width (m)</span>
            <input name="windowWidth" type="number" step="0.1" defaultValue={defaults.windowWidth} />
          </label>
          <label>
            <span>Peak Solar Irradiance (W/m2)</span>
            <input name="peakSolar" type="number" step="50" defaultValue={defaults.peakSolar} />
          </label>
          <label>
            <span>Live Outdoor Temp (deg C)</span>
            <input type="number" value={liveOutdoorTemp} onChange={(event) => setLiveOutdoorTemp(Number(event.target.value) || 0)} />
          </label>
          <label>
            <span>Indoor Start Temp (deg C)</span>
            <input name="initialIndoor" type="number" defaultValue={defaults.initialIndoor} />
          </label>
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Running...' : 'Analyze Indoor vs Outdoor Temperature'}
          </button>
        </form>
      </section>

      <div className="stack">
        <section className="panel">
          <div className="panel-header">
            <h2>24-Hour Indoor vs Outdoor Temperature Dynamics (deg C)</h2>
          </div>
          {data.length > 0 ? (
            <div className="chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="indoorTemp" stroke="#b42318" name="Predicted Indoor" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="outdoorTemp" stroke="#2563eb" name="Ambient Outdoor" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">Click run to compute thermal profiles</div>
          )}
        </section>

        {data.length > 0 && (
          <section className="panel">
            <div className="panel-header">
              <h2>Energy Rate Balance</h2>
            </div>
            <div className="chart-box small">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="heatLossWatts" stroke="#b42318" name="Heat Conduction Loss (W)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="solarGainWatts" stroke="#15803d" name="Passive Solar Heat Gain (W)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
