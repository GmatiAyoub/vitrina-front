import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <Link to="/recherche" className="text-xl font-display font-semibold text-primary">
        Vitrina
      </Link>

      <div className="flex items-center gap-5 text-sm">
        <Link to="/recherche" className="text-gray-600 hover:text-primary font-medium">
          Rechercher
        </Link>

        {!user && (
          <>
            <Link to="/login" className="text-gray-600 hover:text-primary font-medium">
              Se connecter
            </Link>
            <Link
              to="/register"
              className="bg-primary hover:bg-primary-dark text-white px-3.5 py-1.5 rounded-lg font-medium"
            >
              S'inscrire
            </Link>
          </>
        )}

        {user?.role === 'client' && (
          <Link to="/favoris" className="text-gray-600 hover:text-primary font-medium">
            Mes favoris
          </Link>
        )}

        {user?.role === 'commercant' && (
          <>
            <Link to="/mon-commerce" className="text-gray-600 hover:text-primary font-medium">
              Mon commerce
            </Link>
            <Link to="/mes-produits" className="text-gray-600 hover:text-primary font-medium">
              Mes produits
            </Link>
          </>
        )}

        {user?.role === 'admin' && (
          <Link to="/admin" className="text-gray-600 hover:text-primary font-medium">
            Administration
          </Link>
        )}

        {user && (
          <>
            <Link to="/dashboard" className="text-gray-600 hover:text-primary font-medium">
              {user.email}
            </Link>
            <button onClick={handleLogout} className="text-red-600 font-medium">
              Déconnexion
            </button>
          </>
        )}
      </div>
    </nav>
  );
}