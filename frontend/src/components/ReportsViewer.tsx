import { useState } from 'react';
import { api, API_BASE_URL } from '../api';

export function ReportsViewer() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [status, setStatus] = useState('');

  const generateReport = async () => {
    setLoading(true);
    const outdoorTemps = Array.from({ length: 24 }, (_, i) => -5 + Math.sin(i * Math.PI / 12) * 10);
    const solarIrradiance = Array.from({ length: 24 }, (_, i) => (i > 6 && i < 18 ? Math.sin((i - 6) * Math.PI / 12) * 850 : 0));

    try {
      const res = await api.post(`${API_BASE_URL}/reports/pareto`, {
        baseShelter: {
          name: 'Ladakh Defense Shelter Candidate Alpha',
          length: 8,
          width: 4,
          height: 3,
        },
        indoorTemp: 15,
        outdoorTemps,
        solarIrradiance,
      });
      setReport(res.data);
      setStatus('Pareto optimization executive report generated.');
    } catch (e) {
      console.error(e);
      setStatus('Report generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-header split">
          <div>
            <h2>Automated Defense & SIH Executive Report Generator</h2>
            <p>
              Synthesizes thermal simulations, PCM selection matrices, and Genetic Algorithm Pareto frontiers into a structured report.
            </p>
          </div>
          <button className="primary-button" type="button" onClick={generateReport} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Official SIH Executive Report'}
          </button>
        </div>
        {status && <div className="notice">{status}</div>}
      </section>

      {report && (
        <section className="panel">
          <div className="panel-header split">
            <h2>{report.title}</h2>
            <span className="tag">{report.timestamp}</span>
          </div>
          <div className="notice">
            <strong>Top Recommended Passive Shelter Configuration</strong>
            <span>Design: {report.recommendedDesign?.name || 'High-Performance Insulated Shelter'}</span>
          </div>

          <h3>AI Decision Rationale</h3>
          <ul className="border-list">
            {(report.aiReasoning || []).map((reason: any, idx: number) => (
              <li key={idx}>
                {typeof reason === 'object' && reason !== null ? (
                  <>
                    <strong>{reason.factor}: </strong> {reason.impact}
                  </>
                ) : (
                  String(reason)
                )}
              </li>
            ))}
          </ul>

          <h3>Pareto Efficient Options Summary</h3>
          <ul className="border-list">
            {(report.paretoFrontierOptions || []).map((item: any) => (
              <li key={`${item.rank}-${item.designName}`}>
                <span className="tag">Rank #{item.rank}</span>
                <strong>{item.designName}</strong>
                <span>
                  Night Retention: {item.nightTempRetention} deg C | Solar Gain: {item.solarGainUtility} W | Heat Loss: {item.heatLossRestriction} W | Cost: Rs {item.insulationCost}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
