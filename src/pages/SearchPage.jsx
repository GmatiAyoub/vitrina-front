import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function SearchPage() {
  const navigate = useNavigate();
  const [motCle, setMotCle] = useState('');
  const [zone, setZone] = useState('');
  const [resultats, setResultats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [aRecherche, setARecherche] = useState(false);

  async function lancerRecherche(e) {
    e?.preventDefault();
    setLoading(true);
    setErreur('');
    setARecherche(true);
    try {
      const params = {};
      if (motCle.trim()) params.motCle = motCle.trim();
      if (zone.trim()) params.zone = zone.trim();

      const res = await api.get('/recherche', { params });
      setResultats(res.data.resultats);
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la recherche.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-display font-semibold text-ink mb-4">
  Découvrir les commerces de Mornag
</h1>

      <form onSubmit={lancerRecherche} className="flex flex-col sm:flex-row gap-2.5 mb-6">
        <input
          type="text"
          placeholder="Que cherchez-vous ? (ex: jean, basket...)"
          value={motCle}
          onChange={(e) => setMotCle(e.target.value)}
          className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          placeholder="Zone (ex: Mornag)"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-semibold whitespace-nowrap disabled:opacity-60 transition-colors"
        >
          {loading ? 'Recherche...' : 'Rechercher'}
        </button>
      </form>

      {erreur && <p className="text-red-600 text-sm mb-4">{erreur}</p>}

      {!aRecherche && (
        <p className="text-gray-500 text-sm text-center mt-10">
          Lance une recherche pour voir les commerces.
        </p>
      )}
      {aRecherche && !loading && resultats.length === 0 && (
        <p className="text-gray-500 text-sm text-center mt-10">
          Aucun résultat trouvé pour votre recherche.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {resultats.map((commerce) => (
          <div
  key={commerce.id}
  onClick={() => navigate(`/commerces/${commerce.id}`)}
  className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all"
>
  <div className="flex items-start justify-between gap-3">
    <div>
      <h3 className="font-medium text-ink">{commerce.nom}</h3>
      <p className="text-sm text-gray-500 mt-0.5">{commerce.adresse}</p>
      <p className="text-sm text-gray-500">📞 {commerce.telephone}</p>
      <p className="text-sm text-gray-500">🕒 {commerce.horaires}</p>
    </div>
    {commerce.distance_km !== null && (
      <span className="bg-cream text-primary font-semibold text-xs whitespace-nowrap px-2.5 py-1 rounded-full">
        📍 {commerce.distance_km} km
      </span>
    )}
  </div>
            <p className="text-xs text-gray-400 mt-2">
              {commerce.Produits?.length || 0} produit(s) trouvé(s)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}