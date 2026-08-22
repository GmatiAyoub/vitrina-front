import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../api/axios';
import 'leaflet/dist/leaflet.css';

export default function CommerceDetailPage() {
  const { id } = useParams();
  const [commerce, setCommerce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    setLoading(true);
    setErreur('');
    api
      .get(`/commerces/${id}`)
      .then((res) => setCommerce(res.data.commerce))
      .catch((err) => setErreur(err.response?.data?.message || 'Commerce introuvable.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center text-gray-500 mt-16">Chargement...</p>;
  if (erreur) return <p className="text-center text-red-600 mt-16">{erreur}</p>;
  if (!commerce) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/recherche" className="inline-block mb-4 text-primary text-sm">
        ← Retour à la recherche
      </Link>

      <div className="flex gap-5 items-start mb-5">
        {commerce.photo && (
          <img
            src={`http://localhost:4000${commerce.photo}`}
            alt={commerce.nom}
            className="w-30 h-30 object-cover rounded-xl"
          />
        )}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">{commerce.nom}</h1>
          <p className="text-sm text-gray-600">{commerce.adresse}</p>
          <p className="text-sm text-gray-600">📞 {commerce.telephone}</p>
          <p className="text-sm text-gray-600">🕒 {commerce.horaires}</p>
        </div>
      </div>

      {commerce.latitude && commerce.longitude && (
        <div className="rounded-xl overflow-hidden mb-6">
          <MapContainer
            center={[parseFloat(commerce.latitude), parseFloat(commerce.longitude)]}
            zoom={15}
            style={{ height: '250px', width: '100%' }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[parseFloat(commerce.latitude), parseFloat(commerce.longitude)]}>
              <Popup>{commerce.nom}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-800 mb-3">Catalogue</h2>
      {(!commerce.Produits || commerce.Produits.length === 0) && (
        <p className="text-gray-500 text-sm">Ce commerce n'a pas encore publié de produits.</p>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
        {commerce.Produits?.map((produit) => (
          <div key={produit.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            {produit.photos?.[0] && (
              <img
                src={`http://localhost:4000${produit.photos[0]}`}
                alt={produit.nom}
                className="w-full h-35 object-cover"
              />
            )}
            <h3 className="text-sm font-medium text-gray-800 mx-2.5 mt-2 mb-1">{produit.nom}</h3>
            <p className="text-primary font-bold mx-2.5 mb-1 text-sm">{produit.prix} DT</p>
            {produit.tailles && (
              <p className="text-xs text-gray-500 mx-2.5 mb-2.5">Tailles : {produit.tailles}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}