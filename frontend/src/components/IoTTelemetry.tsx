import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export function IoTTelemetry() {
  const [readings, setReadings] = useState<any[]>([]);
  const [streaming, setStreaming] = useState(false);

  const fetchReadings = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/iot/history/ladakh-prototype-sensor-01');
      setReadings(res.data);
    } catch (e) {
      console.error(e);
      const synthetic = Array.from({ length: 10 }, (_, i) => ({
        timestamp: new Date(Date.now() - (10 - i) * 5000).toLocaleTimeString(),
        tempIndoor: 14.5 + Math.random() * 1.2,
        tempOutdoor: -8.2 + Math.random() * 0.5,
        humidity: 35 + Math.random() * 5,
        heatFlux: 120 + Math.random() * 20,
      }));
      setReadings(synthetic);
    }
  };

  useEffect(() => {
    fetchReadings();
    let interval: number | undefined;
    if (streaming) {
      interval = window.setInterval(() => {
        setReadings((prev) => {
          const next = {
            timestamp: new Date().toLocaleTimeString(),
            tempIndoor: 14.8 + Math.random() * 0.8,
            tempOutdoor: -8.5 + Math.random() * 0.4,
            humidity: 36 + Math.random() * 3,
            heatFlux: 125 + Math.random() * 15,
          };
          return [...prev.slice(1), next];
        });
      }, 3000);
    }
    return () => window.clearInterval(interval);
  }, [streaming]);

  const latest = readings[readings.length - 1] || { tempIndoor: 15.2, tempOutdoor: -8.0, humidity: 37, heatFlux: 130 };

  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-header split">
          <div>
            <h2>IoT Telemetry & Digital Twin Real-Time Monitoring</h2>
            <p>
              <span className={streaming ? 'status-dot live' : 'status-dot'} />
              {streaming ? 'Streaming live IoT sensor feeds' : 'Sensor telemetry offline'}
              <span className="muted-inline">Sensor Node ID: LADAKH-OUTPOST-NODE-01</span>
            </p>
          </div>
          <button className={streaming ? 'ghost-button' : 'primary-button'} type="button" onClick={() => setStreaming(!streaming)}>
            {streaming ? 'Pause Stream' : 'Start Live Telemetry Stream'}
          </button>
        </div>
      </section>

      <div className="metric-grid">
        <div className="metric-tile">
          <span>Indoor Sensor Temperature</span>
          <strong>{latest.tempIndoor.toFixed(1)} deg C</strong>
        </div>
        <div className="metric-tile">
          <span>Outdoor Ambient Temperature</span>
          <strong>{latest.tempOutdoor.toFixed(1)} deg C</strong>
        </div>
        <div className="metric-tile">
          <span>Relative Humidity</span>
          <strong>{latest.humidity.toFixed(1)}%</strong>
        </div>
        <div className="metric-tile">
          <span>Wall Heat Flux Density</span>
          <strong>{latest.heatFlux.toFixed(0)} W/m2</strong>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h2>Real-Time Telemetry Stream</h2>
        </div>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={readings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tempIndoor" stroke="#15803d" name="Indoor Temp" strokeWidth={3} />
              <Line type="monotone" dataKey="tempOutdoor" stroke="#2563eb" name="Outdoor Temp" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
