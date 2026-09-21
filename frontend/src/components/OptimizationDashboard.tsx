import { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api, API_BASE_URL } from '../api';

export function OptimizationDashboard() {
  const [loading, setLoading] = useState(false);
  const [optResult, setOptResult] = useState<any>(null);

  const runOptimization = async () => {
    setLoading(true);
    setOptResult(null);
    const outdoorTemps = Array.from({ length: 24 }, (_, i) => -5 + Math.sin(i * Math.PI / 12) * 10);
    const solarIrradiance = Array.from({ length: 24 }, (_, i) => (i > 6 && i < 18 ? Math.sin((i - 6) * Math.PI / 12) * 850 : 0));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await api.post(`${API_BASE_URL}/optimization/run`, {
        baseShelter: {
          name: 'Ladakh High-Altitude Shelter Prototype',
          length: 8,
          width: 4,
          height: 3,
          wallAssemblies: [{ uValue: 0.35 }],
          openings: [{ type: 'Window', width: 2, height: 1.5 }],
        },
        indoorTemp: 15,
        outdoorTemps,
        solarIrradiance,
      });
      setOptResult(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const paretoTableData = optResult?.paretoFront?.map((p: any, idx: number) => ({
    key: idx,
    rank: idx + 1,
    name: p.shelter.name,
    nightTemp: Number(p.rawMetrics.nightTemp).toFixed(1),
    heatLoss: Number(p.rawMetrics.heatLoss).toFixed(0),
    solarGain: Number(p.rawMetrics.solarGain).toFixed(0),
    cost: p.rawMetrics.cost,
  })) || [];

  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-header split">
          <div>
            <h2>Genetic Algorithm Multi-Objective Optimization Engine</h2>
            <p>
              Calculates Pareto frontiers balancing thermal retention against material insulation costs across structural permutations.
            </p>
          </div>
          <button className="primary-button" type="button" onClick={runOptimization} disabled={loading}>
            {loading ? (
              <span className="button-loading">
                <span className="button-spinner" aria-hidden="true" />
                Optimizing...
              </span>
            ) : (
              'Run Genetic Algorithm Optimization'
            )}
          </button>
        </div>
      </section>

      {optResult && (
        <>
          <div className="dashboard-grid equal">
            <section className="panel">
              <div className="panel-header">
                <h2>Pareto Trade-off Frontier</h2>
              </div>
              <div className="chart-box">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="cost" name="Cost" unit=" Rs" />
                    <YAxis type="number" dataKey="nightTemp" name="Night Retention" unit=" deg C" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Shelter Candidates" data={paretoTableData} fill="#1f6feb" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <h2>DRDO Explainable AI Design Rationale</h2>
              </div>
              <div className="notice success">
                <strong>Optimal Configuration Selected</strong>
                <span>Recommended: {optResult.recommendedDesign.name}</span>
              </div>
              <ul className="border-list">
                {optResult.reasons.map((item: any, idx: number) => (
                  <li key={idx}>
                    {typeof item === 'object' && item !== null ? (
                      <>
                        <strong>{item.factor}: </strong> {item.impact}
                      </>
                    ) : (
                      String(item)
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="panel">
            <div className="panel-header">
              <h2>Top Recommended Shelter Permutations</h2>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Shelter Configuration</th>
                    <th>Night Temp</th>
                    <th>Heat Loss</th>
                    <th>Solar Gain</th>
                    <th>Insulation Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {paretoTableData.map((row: any) => (
                    <tr key={row.key}>
                      <td><span className="tag">#{row.rank}</span></td>
                      <td>{row.name}</td>
                      <td>{row.nightTemp} deg C</td>
                      <td>{row.heatLoss} W</td>
                      <td>{row.solarGain} W</td>
                      <td>Rs {Number(row.cost).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
