import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../api/axios';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MORNAG_CENTRE = [36.5872, 10.2437];

function RecentrerCarte({ centre }) {
  const map = useMap();
  if (centre) {
    map.setView(centre, 14);
  }
  return null;
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [motCle, setMotCle] = useState('');
  const [zone, setZone] = useState('');
  const [resultats, setResultats] = useState([]);
  const [pointDeReference, setPointDeReference] = useState(null);
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
      setPointDeReference(res.data.pointDeReference);
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la recherche.');
    } finally {
      setLoading(false);
    }
  }

  const centreCarte = pointDeReference
    ? [pointDeReference.latitude, pointDeReference.longitude]
    : MORNAG_CENTRE;

  return (
    <div className="flex flex-col h-screen">
      <header className="px-6 py-4 bg-white border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800 mb-3">
          Découvrir les commerces de Mornag
        </h1>
        <form onSubmit={lancerRecherche} className="flex gap-2.5">
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
        {erreur && <p className="text-red-600 text-sm mt-2">{erreur}</p>}
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-90 overflow-y-auto p-4 bg-gray-50 border-r border-gray-200">
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
          {resultats.map((commerce) => (
            <div
              key={commerce.id}
              onClick={() => navigate(`/commerces/${commerce.id}`)}
              className="bg-white border border-gray-200 rounded-xl p-3.5 mb-3 cursor-pointer hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-gray-800 mb-1.5">{commerce.nom}</h3>
              <p className="text-sm text-gray-500 mb-1.5">{commerce.adresse}</p>
              {commerce.distance_km !== null && (
                <p className="text-sm text-primary font-semibold mb-1">
                  📍 {commerce.distance_km} km
                </p>
              )}
              <p className="text-xs text-gray-400">
                {commerce.Produits?.length || 0} produit(s) trouvé(s)
              </p>
            </div>
          ))}
        </div>

        <div className="flex-1">
          <MapContainer center={centreCarte} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RecentrerCarte centre={pointDeReference ? centreCarte : null} />
            {resultats
              .filter((c) => c.latitude && c.longitude)
              .map((commerce) => (
                <Marker
                  key={commerce.id}
                  position={[parseFloat(commerce.latitude), parseFloat(commerce.longitude)]}
                >
                  <Popup>
                    <strong>{commerce.nom}</strong>
                    <br />
                    {commerce.adresse}
                    <br />
                    <button onClick={() => navigate(`/commerces/${commerce.id}`)}>
                      Voir la fiche
                    </button>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}