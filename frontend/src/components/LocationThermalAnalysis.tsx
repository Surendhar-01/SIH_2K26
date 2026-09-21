import { useMemo, useState } from 'react';
import { fetchLiveLocation, type LocationResult } from '../utils/geolocation';

type LocationStatus = 'idle' | 'loading' | 'ready' | 'denied' | 'unsupported' | 'error';

function estimateOutdoorTemperature(latitude: number) {
  const hour = new Date().getHours();
  const daySwing = Math.sin(((hour - 7) / 24) * Math.PI * 2) * 6;
  const latitudeCooling = Math.min(Math.abs(latitude) * 0.08, 4.5);
  return Math.round((22 + daySwing - latitudeCooling) * 10) / 10;
}

function buildZoneAnalysis(baseTemp: number) {
  return [
    { zone: 'North Wall Shade', temperature: baseTemp - 2.4, note: 'Lower solar gain, higher condensation risk' },
    { zone: 'South Solar Face', temperature: baseTemp + 4.1, note: 'Peak radiation exposure near glazing' },
    { zone: 'Roof Surface', temperature: baseTemp + 6.8, note: 'Highest heat load, insulation priority' },
    { zone: 'Ground Perimeter', temperature: baseTemp - 1.2, note: 'Thermal bridge risk around foundation' },
  ].map((item) => ({
    ...item,
    temperature: Math.round(item.temperature * 10) / 10,
  }));
}

export function LocationThermalAnalysis() {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [location, setLocation] = useState<LocationResult | null>(null);

  const outdoorTemp = useMemo(
    () => (location ? estimateOutdoorTemperature(location.latitude) : null),
    [location],
  );
  const zones = useMemo(
    () => (outdoorTemp === null ? [] : buildZoneAnalysis(outdoorTemp)),
    [outdoorTemp],
  );
  const heatRisk = zones.length
    ? zones.reduce((max, zone) => Math.max(max, zone.temperature), Number.NEGATIVE_INFINITY) - (outdoorTemp ?? 0)
    : 0;

  async function enableLocation() {
    setStatus('loading');
    try {
      const loc = await fetchLiveLocation();
      setLocation(loc);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="location-analysis-panel">
      <div className="panel-header split">
        <div>
          <h2>Live Location Thermal Analysis</h2>
          <p>Analyze estimated temperature zones around the current shelter location.</p>
        </div>
        <button className="primary-button" disabled={status === 'loading'} onClick={enableLocation} type="button">
          {status === 'loading' ? 'Enabling...' : location ? 'Refresh Location' : 'Enable Live Location'}
        </button>
      </div>

      {status === 'idle' && (
        <div className="location-empty">
          <strong>Location access is off</strong>
          <span>Enable live location to calculate surrounding thermal conditions for this shelter.</span>
        </div>
      )}

      {(status === 'denied' || status === 'unsupported' || status === 'error') && (
        <div className="notice location-warning">
          <strong>
            {status === 'denied'
              ? 'Location permission was blocked'
              : status === 'unsupported'
                ? 'Live location is not supported in this browser'
                : 'Unable to read live location'}
          </strong>
          <span>Allow location permission in the browser and try again.</span>
        </div>
      )}

      {location && outdoorTemp !== null && (
        <div className="location-analysis-grid">
          <div className="location-map-card">
            <div className="location-compass">
              <span className="zone-label north">N</span>
              <span className="zone-label east">E</span>
              <span className="zone-label south">S</span>
              <span className="zone-label west">W</span>
              <div className="home-core">Shelter</div>
              {zones.map((zone, index) => (
                <span className={`thermal-zone zone-${index + 1}`} key={zone.zone}>
                  {zone.temperature} C
                </span>
              ))}
            </div>
          </div>

          <div className="location-details">
            <div className="metric-grid two">
              <div className="metric-tile">
                <span>Outdoor Estimate</span>
                <strong>{outdoorTemp} C</strong>
              </div>
              <div className="metric-tile">
                <span>Location Accuracy</span>
                <strong>{location.accuracy} m</strong>
              </div>
            </div>

            <div className="coordinate-readout">
              <span>Lat {location.latitude.toFixed(5)}</span>
              <span>Long {location.longitude.toFixed(5)}</span>
              {location.placeName && <strong style={{ marginLeft: 'auto', color: '#38bdf8' }}>{location.placeName} {location.isIpFallback ? '(Network IP)' : '(GPS)'}</strong>}
            </div>

            <ul className="zone-list">
              {zones.map((zone) => (
                <li key={zone.zone}>
                  <strong>{zone.zone}</strong>
                  <span>{zone.temperature} C</span>
                  <p>{zone.note}</p>
                </li>
              ))}
            </ul>

            <div className={heatRisk >= 6 ? 'notice location-warning' : 'notice success'}>
              <strong>{heatRisk >= 6 ? 'High roof heat gain detected' : 'Thermal envelope stable'}</strong>
              <span>
                {heatRisk >= 6
                  ? 'Prioritize roof insulation, reflective coating, and south-side shading.'
                  : 'Current estimated heat spread is within passive shelter design tolerance.'}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
