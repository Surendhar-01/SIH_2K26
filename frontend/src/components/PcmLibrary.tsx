import { useState, useEffect } from 'react';
import { api, API_BASE_URL } from '../api';

export function PcmLibrary() {
  const [pcms, setPcms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('');

  const fetchPcms = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${API_BASE_URL}/pcm`);
      setPcms(res.data);
    } catch (e) {
      console.error(e);
      setPcms([
        { _id: '1', name: 'BioPCM M27 (Melting Point 27 deg C)', phaseChangeTemperature: 27, meltingRange: 2, latentHeat: 210000, density: 860, thermalConductivity: 0.2, cost: 1200 },
        { _id: '2', name: 'Paraffin Wax RT21 (Melting Point 21 deg C)', phaseChangeTemperature: 21, meltingRange: 3, latentHeat: 170000, density: 780, thermalConductivity: 0.15, cost: 950 },
        { _id: '3', name: 'Inorganic Salt Hydrate (18 deg C)', phaseChangeTemperature: 18, meltingRange: 1.5, latentHeat: 190000, density: 1500, thermalConductivity: 0.54, cost: 1100 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPcms();
  }, []);

  const createPcm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get('name') || ''),
      phaseChangeTemperature: Number(formData.get('phaseChangeTemperature')),
      latentHeat: Number(formData.get('latentHeat')),
      cost: Number(formData.get('cost')),
    };

    try {
      await api.post(`${API_BASE_URL}/pcm`, payload);
      setStatus('PCM material saved successfully.');
      setIsModalOpen(false);
      fetchPcms();
    } catch (e) {
      console.error(e);
      setStatus('Failed to create PCM record.');
    }
  };

  return (
    <>
      <section className="panel">
        <div className="panel-header split">
          <div>
            <h2>Phase Change Materials Thermal Mass Catalog</h2>
            <p>
              Phase Change Materials store latent thermal energy during peak solar gain and release heat during high-altitude cold nights.
            </p>
          </div>
          <button className="primary-button" type="button" onClick={() => setIsModalOpen(true)}>
            Add Custom PCM Compound
          </button>
        </div>
        {status && <div className="notice">{status}</div>}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>PCM Name</th>
                <th>Melting Temp</th>
                <th>Melting Range</th>
                <th>Latent Heat</th>
                <th>Density</th>
                <th>Thermal Conductivity</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}>Loading PCM catalog...</td></tr>
              ) : pcms.map((pcm) => (
                <tr key={pcm._id}>
                  <td><strong>{pcm.name}</strong></td>
                  <td><span className="tag">{pcm.phaseChangeTemperature} deg C</span></td>
                  <td>+/- {pcm.meltingRange} deg C</td>
                  <td>{Number(pcm.latentHeat).toLocaleString()} J/kg</td>
                  <td>{pcm.density} kg/m3</td>
                  <td>{pcm.thermalConductivity} W/mK</td>
                  <td>Rs {pcm.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsModalOpen(false)}>
          <section className="modal-panel" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <div className="panel-header split">
              <h2>Add Phase Change Material</h2>
              <button className="ghost-button" type="button" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
            <form className="form-stack" onSubmit={createPcm}>
              <label>
                <span>PCM Material Name</span>
                <input name="name" placeholder="BioPCM High Altitude Grade X" required />
              </label>
              <label>
                <span>Phase Change Temperature (deg C)</span>
                <input name="phaseChangeTemperature" type="number" required />
              </label>
              <label>
                <span>Latent Heat of Fusion (J/kg)</span>
                <input name="latentHeat" type="number" required />
              </label>
              <label>
                <span>Cost per m2 (Rs)</span>
                <input name="cost" type="number" />
              </label>
              <button className="primary-button" type="submit">Save PCM Material</button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
