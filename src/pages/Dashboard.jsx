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
      <button
        onClick={logout}
        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Se déconnecter
      </button>
      <p className="mt-4">
        <Link to="/recherche" className="text-primary font-medium">
          Aller à la recherche
        </Link>
      </p>
    </div>
  );
}