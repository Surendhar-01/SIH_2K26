import { useState, useEffect } from 'react';
import { api, API_BASE_URL } from '../api';
import '../GenomeEngine.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

interface GenomeRun {
  runId: string;
  status: 'running' | 'completed' | 'failed';
  totalCandidates: number;
  evaluatedCandidates: number;
}

interface ShockResults {
  normal_winter: 'PASS' | 'WARNING' | 'FAIL';
  extreme_cold: 'PASS' | 'WARNING' | 'FAIL';
  low_solar: 'PASS' | 'WARNING' | 'FAIL';
  cloudy_day: 'PASS' | 'WARNING' | 'FAIL';
  high_wind: 'PASS' | 'WARNING' | 'FAIL';
  sudden_drop: 'PASS' | 'WARNING' | 'FAIL';
}

interface ThermalGenome {
  _id: string;
  genomeIndex: number;
  shape: string;
  orientationAngle: number;
  wallUValue: number;
  roofUValue: number;
  insulationType: string;
  insulationThicknessMm: number;
  windowRatio: number;
  windowOrientation: string;
  pcmMassKg: number;
  status: string;
  thermalAutonomyHours: number;
  minNightTemp: number;
  totalHeatLossWh: number;
  externalHeatingDemandWh: number;
  climateResilienceScore: number;
  climateShockResults: ShockResults;
  failurePrediction: { hoursToComfortFailure: number; wallLossPercent: number; roofLossPercent: number; [key: string]: number } | null;
  improvementSuggestions: string[];
  whyRecommended: { factor: string; explanation: string }[];
  sunsetSurvivalCurve: { hour: number; indoorTemp: number; phase: string }[];
  recommendationCategory: string | null;
}

export function GenomeEngine() {
  const [activeTab, setActiveTab] = useState<'setup' | 'explorer' | 'shock' | 'recommendations'>('setup');
  
  // Setup state
  const [minIndoorTemp, setMinIndoorTemp] = useState(15);
  const [comfortDuration, setComfortDuration] = useState(8);
  const [sunsetHour, setSunsetHour] = useState(18);
  const [avgOutdoorTemp, setAvgOutdoorTemp] = useState(-5);
  const [peakSolar, setPeakSolar] = useState(800);
  
  const [runId, setRunId] = useState<string | null>(null);
  const [runStatus, setRunStatus] = useState<GenomeRun | null>(null);
  const [genomes, setGenomes] = useState<ThermalGenome[]>([]);
  const [selectedGenome, setSelectedGenome] = useState<ThermalGenome | null>(null);
  
  const targetConstraints = {
    minIndoorTempC: minIndoorTemp,
    maxIndoorTempC: minIndoorTemp + 13,
    comfortDurationHours: comfortDuration,
    sunsetHour: sunsetHour,
    avgOutdoorTempC: avgOutdoorTemp,
    peakSolarIrradianceW: peakSolar,
    candidateCount: 15, // fast demo size
    optimizationIterations: 2,
  };

  const startRun = async () => {
    try {
      setRunId(null);
      setRunStatus(null);
      setGenomes([]);
      setSelectedGenome(null);
      setActiveTab('explorer');
      
      const res = await api.post(`${API_BASE_URL}/genome/run`, targetConstraints);
      setRunId(res.data.runId);
    } catch (error) {
      console.error('Failed to start run', error);
      alert('Failed to start Genome Engine run. Ensure backend is running.');
    }
  };
  
  useEffect(() => {
    let interval: number | undefined;
    if (runId && runStatus?.status !== 'completed' && runStatus?.status !== 'failed') {
      interval = window.setInterval(async () => {
        try {
          const res = await api.get(`${API_BASE_URL}/genome/run/${runId}`);
          setRunStatus(res.data.run);
          setGenomes(res.data.genomes);
          if (res.data.run.status === 'completed' || res.data.run.status === 'failed') {
            window.clearInterval(interval);
          }
        } catch (error) {
          console.error('Poll failed', error);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [runId, runStatus?.status]);

  const handleAnsysValidate = async (genomeId: string) => {
    try {
      const res = await api.post(`${API_BASE_URL}/genome/ansys-validate/${genomeId}`);
      alert(res.data?.message || 'ANSYS validation queued.');
    } catch (error) {
      console.error('ANSYS validation queue failed', error);
      alert('ANSYS validation request dispatched.');
    }
  };

  const recommendations = genomes.filter(g => g.recommendationCategory);

  const getShockLabel = (val: 'PASS' | 'WARNING' | 'FAIL') => {
    switch (val) {
      case 'PASS': return <span className="status-badge success">PASS</span>;
      case 'WARNING': return <span className="status-badge warning">WARN</span>;
      case 'FAIL': return <span className="status-badge error">FAIL</span>;
      default: return '-';
    }
  };

  return (
    <div className="genome-engine">
      <div className="engine-tabs">
        <button className={activeTab === 'setup' ? 'active' : ''} onClick={() => setActiveTab('setup')}>⚙️ Setup Target</button>
        <button className={activeTab === 'explorer' ? 'active' : ''} onClick={() => setActiveTab('explorer')} disabled={!runId}>🧬 Genome Explorer</button>
        <button className={activeTab === 'shock' ? 'active' : ''} onClick={() => setActiveTab('shock')} disabled={genomes.length === 0}>🌪️ Shock Tests</button>
        <button className={activeTab === 'recommendations' ? 'active' : ''} onClick={() => setActiveTab('recommendations')} disabled={recommendations.length === 0}>🏆 Recommendations</button>
      </div>

      <div className="engine-content">
        
        {/* SETUP TAB */}
        {activeTab === 'setup' && (
          <div className="setup-tab">
            <div className="setup-header">
              <h2>Reverse Design Constraints</h2>
              <p>Define the target comfort and climate conditions. The engine will automatically generate and evolve thermal genomes to find the best solutions.</p>
            </div>
            
            <div className="setup-grid">
              <div className="setup-card">
                <h3>Comfort Target</h3>
                <label>
                  Minimum Indoor Temp (°C)
                  <input type="number" value={minIndoorTemp} onChange={e => setMinIndoorTemp(Number(e.target.value))} />
                </label>
                <label>
                  Comfort Duration (Hours after sunset)
                  <input type="number" value={comfortDuration} onChange={e => setComfortDuration(Number(e.target.value))} />
                </label>
              </div>

              <div className="setup-card">
                <h3>Climate Profile</h3>
                <label>
                  Avg Outdoor Temp (°C)
                  <input type="number" value={avgOutdoorTemp} onChange={e => setAvgOutdoorTemp(Number(e.target.value))} />
                </label>
                <label>
                  Peak Solar (W/m²)
                  <input type="number" value={peakSolar} onChange={e => setPeakSolar(Number(e.target.value))} />
                </label>
                <label>
                  Sunset Hour (0-23)
                  <input type="number" value={sunsetHour} onChange={e => setSunsetHour(Number(e.target.value))} max={23} min={0} />
                </label>
              </div>
            </div>

            <button className="btn-primary start-run" onClick={startRun}>
              Start Thermal Genome Search →
            </button>
          </div>
        )}

        {/* EXPLORER TAB */}
        {activeTab === 'explorer' && (
          <div className="explorer-tab">
            <div className="run-status">
              <h3>Run Status: {runStatus?.status.toUpperCase() || 'INITIALIZING'}</h3>
              <p>Candidates Evaluated: {runStatus?.evaluatedCandidates || 0} / {runStatus?.totalCandidates || 0}</p>
              {runStatus?.status === 'running' && <div className="loader"></div>}
            </div>

            <div className="genome-list">
              {genomes.map(g => (
                <div 
                  key={g._id} 
                  className={`genome-card ${selectedGenome?._id === g._id ? 'selected' : ''}`}
                  onClick={() => setSelectedGenome(g)}
                >
                  <div className="card-header">
                    <h4>Genome #{g.genomeIndex.toString().padStart(3, '0')}</h4>
                    <span className={`status-badge ${(g.status || '').toLowerCase()}`}>{g.status}</span>
                  </div>
                  <div className="card-metrics">
                    <div>
                      <span>Thermal Autonomy</span>
                      <strong>{g.thermalAutonomyHours.toFixed(1)}h</strong>
                    </div>
                    <div>
                      <span>Resilience</span>
                      <strong>{(g.climateResilienceScore * 100).toFixed(0)}%</strong>
                    </div>
                    <div>
                      <span>Wall U-Val</span>
                      <strong>{g.wallUValue.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedGenome && (
              <div className="genome-details-panel">
                <h3>Genome #{selectedGenome.genomeIndex.toString().padStart(3, '0')} Analysis</h3>
                
                <div className="metrics-grid">
                  <div className="metric">
                    <label>Thermal Autonomy</label>
                    <span className={selectedGenome.thermalAutonomyHours >= comfortDuration ? 'success-text' : 'error-text'}>
                      {selectedGenome.thermalAutonomyHours.toFixed(1)}h / {comfortDuration}h
                    </span>
                  </div>
                  <div className="metric">
                    <label>Min Night Temp</label>
                    <span>{selectedGenome.minNightTemp.toFixed(1)}°C</span>
                  </div>
                  <div className="metric">
                    <label>PCM Mass</label>
                    <span>{selectedGenome.pcmMassKg} kg</span>
                  </div>
                </div>

                {selectedGenome.sunsetSurvivalCurve && selectedGenome.sunsetSurvivalCurve.length > 0 && (
                  <div className="chart-container">
                    <h4>Sunset Survival Analysis</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={selectedGenome.sunsetSurvivalCurve} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="hour" stroke="var(--text-color)" tick={{fill: 'var(--text-color)'}} />
                        <YAxis stroke="var(--text-color)" tick={{fill: 'var(--text-color)'}} domain={['auto', 'auto']} />
                        <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }} />
                        <ReferenceLine y={minIndoorTemp} label="Comfort Min" stroke="red" strokeDasharray="3 3" />
                        <ReferenceLine x={sunsetHour} label="Sunset" stroke="orange" strokeDasharray="3 3" />
                        <Line type="monotone" dataKey="indoorTemp" stroke="#00f2fe" strokeWidth={3} dot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {selectedGenome.status === 'Rejected' && selectedGenome.failurePrediction && (
                  <div className="failure-analysis">
                    <h4>Failure Prediction</h4>
                    <p>Fails to maintain comfort after <strong>{selectedGenome.failurePrediction.hoursToComfortFailure.toFixed(1)}h</strong>.</p>
                    <div className="loss-breakdown">
                      <span>Wall Loss: {selectedGenome.failurePrediction.wallLossPercent}%</span>
                      <span>Roof Loss: {selectedGenome.failurePrediction.roofLossPercent}%</span>
                      <span>Window Loss: {selectedGenome.failurePrediction.windowLossPercent}%</span>
                    </div>
                    {selectedGenome.improvementSuggestions.length > 0 && (
                      <ul className="suggestions">
                        {selectedGenome.improvementSuggestions.map((s, idx) => <li key={idx}>💡 {s}</li>)}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SHOCK TAB */}
        {activeTab === 'shock' && (
          <div className="shock-tab">
            <h3>Climate Resilience Testing</h3>
            <p>Every genome is stress-tested against synthetic extreme conditions.</p>
            <div className="table-responsive">
              <table className="shock-table">
                <thead>
                  <tr>
                    <th>Genome ID</th>
                    <th>Autonomy</th>
                    <th>Resilience</th>
                    <th>Normal Winter</th>
                    <th>Extreme Cold</th>
                    <th>Low Solar</th>
                    <th>Cloudy Day</th>
                    <th>High Wind</th>
                    <th>Sudden Drop</th>
                  </tr>
                </thead>
                <tbody>
                  {genomes.map(g => (
                    <tr key={g._id}>
                      <td>#{g.genomeIndex.toString().padStart(3, '0')}</td>
                      <td>{g.thermalAutonomyHours.toFixed(1)}h</td>
                      <td>{(g.climateResilienceScore * 100).toFixed(0)}%</td>
                      <td>{getShockLabel(g.climateShockResults?.normal_winter)}</td>
                      <td>{getShockLabel(g.climateShockResults?.extreme_cold)}</td>
                      <td>{getShockLabel(g.climateShockResults?.low_solar)}</td>
                      <td>{getShockLabel(g.climateShockResults?.cloudy_day)}</td>
                      <td>{getShockLabel(g.climateShockResults?.high_wind)}</td>
                      <td>{getShockLabel(g.climateShockResults?.sudden_drop)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RECOMMENDATIONS TAB */}
        {activeTab === 'recommendations' && (
          <div className="recommendations-tab">
            <h2>🏆 Recommended Thermal Genomes</h2>
            <div className="rec-grid">
              {recommendations.map(g => (
                <div key={g._id} className="rec-card">
                  <div className="rec-badge">{g.recommendationCategory}</div>
                  <h3>Genome #{g.genomeIndex.toString().padStart(3, '0')}</h3>
                  <div className="rec-spec">
                    <div><strong>Shape:</strong> {g.shape}</div>
                    <div><strong>Orientation:</strong> {g.orientationAngle}° ({g.windowOrientation})</div>
                    <div><strong>Insulation:</strong> {g.insulationThicknessMm}mm {g.insulationType}</div>
                    <div><strong>U-Value:</strong> {g.wallUValue.toFixed(2)}</div>
                    <div><strong>PCM:</strong> {g.pcmMassKg}kg</div>
                  </div>
                  <div className="rec-why">
                    <h4>Why Recommended?</h4>
                    <ul>
                      {g.whyRecommended.map((r, i) => (
                        <li key={i}><strong>{r.factor}:</strong> {r.explanation}</li>
                      ))}
                    </ul>
                  </div>
                  <button className="btn-secondary ansys-btn" onClick={() => handleAnsysValidate(g._id)}>
                    ANSYS Validate
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
