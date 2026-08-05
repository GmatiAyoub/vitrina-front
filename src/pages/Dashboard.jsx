import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();

  if (loading) return <p>Chargement...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="dashboard">
      <h1>Bienvenue sur Vitrina</h1>
      <p>Email : {user.email}</p>
      <p>Rôle : {user.role}</p>
      <button onClick={logout}>Se déconnecter</button>

      {user.role === 'commercant' && <p>👉 Sprint 1 : ici viendra la gestion du catalogue produits.</p>}
      {user.role === 'client' && <p>👉 Sprint 2 : ici viendra la recherche géolocalisée.</p>}
      {user.role === 'admin' && <p>👉 Sprint 3 : ici viendra le panneau d'administration.</p>}
    </div>
  );
}
