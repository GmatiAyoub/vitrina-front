import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    if (!user) return;
    chargerFavoris();
  }, [user]);

  function chargerFavoris() {
    setLoading(true);
    api
      .get('/favoris')
      .then((res) => setFavoris(res.data.favoris))
      .catch((err) => setErreur(err.response?.data?.message || 'Erreur lors du chargement.'))
      .finally(() => setLoading(false));
  }

  async function retirer(commerceId) {
    try {
      await api.delete(`/favoris/${commerceId}`);
      setFavoris((prev) => prev.filter((f) => f.Commerce.id !== commerceId));
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors du retrait.');
    }
  }

  if (authLoading) return <p className="text-center text-gray-500 mt-16">Chargement...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'client') return <Navigate to="/dashboard" replace />;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Mes favoris</h1>
        <Link to="/recherche" className="text-primary text-sm font-medium">
          ← Retour à la recherche
        </Link>
      </div>

      {erreur && <p className="text-red-600 text-sm mb-4">{erreur}</p>}
      {loading && <p className="text-gray-500 text-sm">Chargement...</p>}

      {!loading && favoris.length === 0 && (
        <p className="text-gray-500 text-sm">
          Vous n'avez pas encore de commerce favori.{' '}
          <Link to="/recherche" className="text-primary font-medium">
            Explorer les commerces
          </Link>
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {favoris.map((favori) => (
          <div
            key={favori.id}
            className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2"
          >
            <Link to={`/commerces/${favori.Commerce.id}`} className="font-medium text-gray-800">
              {favori.Commerce.nom}
            </Link>
            <p className="text-sm text-gray-500">{favori.Commerce.adresse}</p>
            <p className="text-xs text-gray-400">
              {favori.Commerce.Produits?.length || 0} produit(s) disponible(s)
            </p>
            <button
              onClick={() => retirer(favori.Commerce.id)}
              className="self-start text-sm text-red-600 font-medium mt-1"
            >
              Retirer des favoris
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}