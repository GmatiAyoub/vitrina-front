import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const FORM_VIDE = { nom: '', description: '', prix: '', tailles: '', disponibilite: true };

export default function MyProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');

  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [produitEnEdition, setProduitEnEdition] = useState(null);
  const [form, setForm] = useState(FORM_VIDE);
  const [photos, setPhotos] = useState([]);
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    if (!user) return;
    chargerProduits();
  }, [user]);

  function chargerProduits() {
    setLoading(true);
    api
      .get('/produits/mes-produits')
      .then((res) => setProduits(res.data.produits))
      .catch((err) => setErreur(err.response?.data?.message || 'Erreur lors du chargement.'))
      .finally(() => setLoading(false));
  }

  function ouvrirCreation() {
    setProduitEnEdition(null);
    setForm(FORM_VIDE);
    setPhotos([]);
    setErreur('');
    setSucces('');
    setAfficherFormulaire(true);
  }

  function ouvrirEdition(produit) {
    setProduitEnEdition(produit);
    setForm({
      nom: produit.nom,
      description: produit.description || '',
      prix: produit.prix,
      tailles: produit.tailles || '',
      disponibilite: produit.disponibilite,
    });
    setPhotos([]);
    setErreur('');
    setSucces('');
    setAfficherFormulaire(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');
    setSucces('');

    if (!produitEnEdition && photos.length === 0) {
      setErreur('Au moins une photo est obligatoire pour publier un produit.');
      return;
    }

    setEnvoi(true);
    const data = new FormData();
    data.append('nom', form.nom);
    data.append('description', form.description);
    data.append('prix', form.prix);
    data.append('tailles', form.tailles);
    data.append('disponibilite', form.disponibilite);
    photos.forEach((f) => data.append('photos', f));

    try {
      if (produitEnEdition) {
        await api.put(`/produits/${produitEnEdition.id}`, data);
        setSucces('Produit mis à jour.');
      } else {
        await api.post('/produits', data);
        setSucces('Produit ajouté avec succès.');
      }
      setAfficherFormulaire(false);
      chargerProduits();
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setEnvoi(false);
    }
  }

  async function supprimer(produit) {
    if (!window.confirm(`Supprimer "${produit.nom}" ? Cette action est irréversible.`)) return;
    try {
      await api.delete(`/produits/${produit.id}`);
      setProduits((prev) => prev.filter((p) => p.id !== produit.id));
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la suppression.');
    }
  }

  if (authLoading) return <p className="text-center text-gray-500 mt-16">Chargement...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'commercant') return <Navigate to="/dashboard" replace />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-semibold text-ink">Mes produits</h1>
        <div className="flex gap-4 items-center">
          <Link to="/mon-commerce" className="text-primary text-sm font-medium">
            ← Mon commerce
          </Link>
          <button
            onClick={ouvrirCreation}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            + Ajouter un produit
          </button>
        </div>
      </div>

      {erreur && !afficherFormulaire && <p className="text-red-600 text-sm mb-4">{erreur}</p>}
      {succes && !afficherFormulaire && <p className="text-green-600 text-sm mb-4">{succes}</p>}

      {afficherFormulaire && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-gray-200 mb-6"
        >
          <h2 className="font-semibold text-gray-800">
            {produitEnEdition ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>

          <label className="flex flex-col gap-1.5 text-sm text-gray-700">
            Nom du produit
            <input
              type="text"
              required
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-gray-700">
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <div className="flex gap-4">
            <label className="flex flex-col gap-1.5 text-sm text-gray-700 flex-1">
              Prix (DT)
              <input
                type="number"
                step="0.001"
                min="0.001"
                required
                value={form.prix}
                onChange={(e) => setForm({ ...form, prix: e.target.value })}
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm text-gray-700 flex-1">
              Tailles (ex: S,M,L,XL)
              <input
                type="text"
                value={form.tailles}
                onChange={(e) => setForm({ ...form, tailles: e.target.value })}
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.disponibilite}
              onChange={(e) => setForm({ ...form, disponibilite: e.target.checked })}
            />
            Disponible à la vente
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-gray-700">
            Photos {!produitEnEdition && <span className="text-red-500">(au moins 1 requise)</span>}
            {produitEnEdition && (
              <span className="text-xs text-gray-400">
                Laisser vide pour conserver les photos actuelles
              </span>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => setPhotos(Array.from(e.target.files))}
              className="text-sm"
            />
          </label>

          {erreur && <p className="text-red-600 text-sm">{erreur}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={envoi}
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-semibold disabled:opacity-60 transition-colors"
            >
              {envoi ? 'Enregistrement...' : produitEnEdition ? 'Mettre à jour' : 'Publier le produit'}
            </button>
            <button
              type="button"
              onClick={() => setAfficherFormulaire(false)}
              className="px-5 py-2.5 rounded-lg font-medium text-gray-600 border border-gray-300"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-gray-500 text-sm">Chargement...</p>}
      {!loading && produits.length === 0 && !afficherFormulaire && (
        <p className="text-gray-500 text-sm">Aucun produit publié pour l'instant.</p>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {produits.map((produit) => (
          <div key={produit.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            {produit.photos?.[0] && (
              <img
                src={`http://localhost:4000${produit.photos[0]}`}
                alt={produit.nom}
                className="w-full h-36 object-cover"
              />
            )}
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-800">{produit.nom}</h3>
              <p className="text-accent font-bold text-sm mt-1">{produit.prix} DT</p>
              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  produit.disponibilite ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {produit.disponibilite ? 'Disponible' : 'Indisponible'}
              </span>
              <div className="flex gap-3 mt-3">
                <button onClick={() => ouvrirEdition(produit)} className="text-xs font-medium text-primary">
                  Modifier
                </button>
                <button onClick={() => supprimer(produit)} className="text-xs font-medium text-red-600">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
