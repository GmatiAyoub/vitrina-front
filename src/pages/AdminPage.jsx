import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [onglet, setOnglet] = useState('utilisateurs');
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    chargerDonnees();
  }, [user]);

  function chargerDonnees() {
    setLoading(true);
    Promise.all([
      api.get('/admin/utilisateurs'),
      api.get('/admin/statistiques'),
      api.get('/admin/logs'),
    ])
      .then(([resUsers, resStats, resLogs]) => {
        setUtilisateurs(resUsers.data.utilisateurs);
        setStats(resStats.data.statistiques);
        setLogs(resLogs.data.logs);
      })
      .catch((err) => setErreur(err.response?.data?.message || 'Erreur lors du chargement.'))
      .finally(() => setLoading(false));
  }

  async function toggleSuspension(utilisateur) {
    const action = utilisateur.active ? 'suspendre' : 'reactiver';
    try {
      await api.patch(`/admin/utilisateurs/${utilisateur.id}/${action}`);
      setUtilisateurs((prev) =>
        prev.map((u) => (u.id === utilisateur.id ? { ...u, active: !u.active } : u))
      );
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'action.");
    }
  }

  if (authLoading) return <p className="text-center text-gray-500 mt-16">Chargement...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Panneau d'administration</h1>
        <Link to="/recherche" className="text-primary text-sm font-medium">
          ← Retour à la recherche
        </Link>
      </div>

      {erreur && <p className="text-red-600 text-sm mb-4">{erreur}</p>}

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard label="Clients" value={stats.nbClients} />
          <StatCard label="Commerçants" value={stats.nbCommercants} />
          <StatCard label="Commerces actifs" value={stats.nbCommercesActifs} />
          <StatCard label="Produits" value={stats.nbProduits} />
        </div>
      )}

      <div className="flex gap-2 mb-4 border-b border-gray-200">
        <button
          onClick={() => setOnglet('utilisateurs')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            onglet === 'utilisateurs' ? 'border-primary text-primary' : 'border-transparent text-gray-500'
          }`}
        >
          Utilisateurs
        </button>
        <button
          onClick={() => setOnglet('logs')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            onglet === 'logs' ? 'border-primary text-primary' : 'border-transparent text-gray-500'
          }`}
        >
          Logs d'actions
        </button>
      </div>

      {loading && <p className="text-gray-500 text-sm">Chargement...</p>}

      {!loading && onglet === 'utilisateurs' && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="py-2">Email</th>
              <th className="py-2">Rôle</th>
              <th className="py-2">Statut</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map((u) => (
              <tr key={u.id} className="border-b border-gray-100">
                <td className="py-2.5 text-gray-800">{u.email}</td>
                <td className="py-2.5 text-gray-600 capitalize">{u.role}</td>
                <td className="py-2.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {u.active ? 'Actif' : 'Suspendu'}
                  </span>
                </td>
                <td className="py-2.5">
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => toggleSuspension(u)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                        u.active
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {u.active ? 'Suspendre' : 'Réactiver'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && onglet === 'logs' && (
        <div className="flex flex-col gap-2">
          {logs.length === 0 && <p className="text-gray-500 text-sm">Aucune action enregistrée.</p>}
          {logs.map((log) => (
            <div key={log.id} className="bg-white border border-gray-200 rounded-lg p-3 text-sm">
              <p className="font-medium text-gray-800">{log.action}</p>
              <p className="text-gray-600">{log.details}</p>
              <p className="text-xs text-gray-400 mt-1">
                Par {log.Utilisateur?.email} — {new Date(log.created_at).toLocaleString('fr-FR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}