import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../api/axios';
import 'leaflet/dist/leaflet.css';
import './SearchPage.css';

// Fix icône par défaut Leaflet cassée avec les bundlers (Vite/Webpack)
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
    <div className="search-page">
      <header className="search-header">
        <h1>Découvrir les commerces de Mornag</h1>
        <form onSubmit={lancerRecherche} className="search-form">
          <input
            type="text"
            placeholder="Que cherchez-vous ? (ex: jean, basket...)"
            value={motCle}
            onChange={(e) => setMotCle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Zone (ex: Mornag)"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>
        {erreur && <p className="error">{erreur}</p>}
      </header>

      <div className="search-body">
        <div className="results-list">
          {!aRecherche && <p className="hint">Lance une recherche pour voir les commerces.</p>}
          {aRecherche && !loading && resultats.length === 0 && (
            <p className="hint">Aucun résultat trouvé pour votre recherche.</p>
          )}
          {resultats.map((commerce) => (
            <div
              key={commerce.id}
              className="result-card"
              onClick={() => navigate(`/commerces/${commerce.id}`)}
            >
              <h3>{commerce.nom}</h3>
              <p className="result-adresse">{commerce.adresse}</p>
              {commerce.distance_km !== null && (
                <p className="result-distance">📍 {commerce.distance_km} km</p>
              )}
              <p className="result-produits">
                {commerce.Produits?.length || 0} produit(s) trouvé(s)
              </p>
            </div>
          ))}
        </div>

        <div className="map-wrapper">
          <MapContainer center={centreCarte} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RecentrerCarte centre={pointDeReference ? centreCarte : null} />
            {resultats
              .filter((c) => c.latitude && c.longitude)
              .map((commerce) => (
                <Marker key={commerce.id} position={[parseFloat(commerce.latitude), parseFloat(commerce.longitude)]}>
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