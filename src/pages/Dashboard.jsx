import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();

  if (loading) return <p className="text-center mt-16 text-gray-500">Chargement...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-lg mx-auto mt-16 p-8 bg-white rounded-xl shadow-md">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Bienvenue sur Vitrina</h1>
      <p className="text-gray-600">Email : {user.email}</p>
      <p className="text-gray-600 mb-4">Rôle : {user.role}</p>

      <div className="flex flex-col gap-2 mb-4">
        <Link to="/recherche" className="text-primary font-medium">
          🔍 Aller à la recherche
        </Link>
        {user.role === 'client' && (
          <Link to="/favoris" className="text-primary font-medium">
            ★ Mes favoris
          </Link>
        )}
        {user.role === 'commercant' && (
          <>
            <Link to="/mon-commerce" className="text-primary font-medium">
              🏬 Mon commerce
            </Link>
            <Link to="/mes-produits" className="text-primary font-medium">
              📦 Mes produits
            </Link>
          </>
        )}
        {user.role === 'admin' && (
          <Link to="/admin" className="text-primary font-medium">
            ⚙️ Panneau d'administration
          </Link>
        )}
      </div>

      <button
        onClick={logout}
        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Se déconnecter
      </button>
    </div>
  );
}