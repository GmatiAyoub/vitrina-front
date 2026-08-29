import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { LOCALITES_MORNAG } from '../data/localitesMornag';

export default function CommerceProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [commerce, setCommerce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nom: '', localite: '', rue: '', telephone: '', horaires: '' });
  const [photo, setPhoto] = useState(null);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    if (!user) return;
    api
      .get('/commerces/me')
      .then((res) => {
        const c = res.data.commerce;
        setCommerce(c);
        const parties = c.adresse.split(',').map((p) => p.trim());
        const localiteTrouvee = LOCALITES_MORNAG.find((l) => parties.includes(l));
        setForm({
          nom: c.nom,
          localite: localiteTrouvee || 'Mornag Centre',
          rue: localiteTrouvee ? parties.filter((p) => p !== localiteTrouvee).join(', ') : c.adresse,
          telephone: c.telephone,
          horaires: c.horaires,
        });
      })
      .catch(() => setCommerce(null))
      .finally(() => setLoading(false));
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');
    setSucces('');
    setEnvoi(true);

    const adresseComplete = form.rue.trim() ? `${form.rue.trim()}, ${form.localite}` : form.localite;

    const data = new FormData();
    data.append('nom', form.nom);
    data.append('adresse', adresseComplete);
    data.append('telephone', form.telephone);
    data.append('horaires', form.horaires);
    if (photo) data.append('photo', photo);

    try {
      if (commerce) {
        const res = await api.put('/commerces/me', data);
        setCommerce(res.data.commerce);
        setSucces('Commerce mis à jour avec succès.');
      } else {
        const res = await api.post('/commerces', data);
        setCommerce(res.data.commerce);
        setSucces('Commerce créé avec succès !');
      }
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setEnvoi(false);
    }
  }

  if (authLoading || loading) return <p className="text-center text-gray-500 mt-16">Chargement...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'commercant') return <Navigate to="/dashboard" replace />;

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-semibold text-ink">
         {commerce ? 'Mon commerce' : 'Créer mon commerce'}
        </h1>
        <Link to="/dashboard" className="text-primary text-sm font-medium">
          ← Retour
        </Link>
      </div>

      {commerce?.photo && (
        <img
          src={`http://localhost:4000${commerce.photo}`}
          alt={commerce.nom}
          className="w-24 h-24 object-cover rounded-xl mb-4"
        />
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-gray-200">
        <label className="flex flex-col gap-1.5 text-sm text-gray-700">
          Nom du commerce
          <input
            type="text"
            required
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-gray-700">
          Localité (délégation de Mornag)
          <select
            required
            value={form.localite}
            onChange={(e) => setForm({ ...form, localite: e.target.value })}
            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            {LOCALITES_MORNAG.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-gray-700">
          Rue / précision (optionnel)
          <input
            type="text"
            value={form.rue}
            onChange={(e) => setForm({ ...form, rue: e.target.value })}
            placeholder="ex: Avenue Habib Bourguiba, en face de la poste..."
            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-gray-700">
          Téléphone
          <input
            type="text"
            required
            value={form.telephone}
            onChange={(e) => setForm({ ...form, telephone: e.target.value })}
            placeholder="+216 XX XXX XXX"
            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-gray-700">
          Horaires d'ouverture
          <input
            type="text"
            required
            value={form.horaires}
            onChange={(e) => setForm({ ...form, horaires: e.target.value })}
            placeholder="ex: Lun-Sam 9h-19h"
            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-gray-700">
          Photo de la boutique
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="text-sm"
          />
        </label>

        {erreur && <p className="text-red-600 text-sm">{erreur}</p>}
        {succes && <p className="text-green-600 text-sm">{succes}</p>}

        <button
          type="submit"
          disabled={envoi}
          className="bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold disabled:opacity-60 transition-colors"
        >
          {envoi ? 'Enregistrement...' : commerce ? 'Mettre à jour' : 'Créer mon commerce'}
        </button>
      </form>

      {commerce && (
        <Link to="/mes-produits" className="block text-center mt-4 text-primary font-medium">
          📦 Gérer mon catalogue produits →
        </Link>
      )}
    </div>
  );
}