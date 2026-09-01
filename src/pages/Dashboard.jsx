import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-16 text-gray-500">Chargement...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-display font-semibold text-ink mb-1">
        Bonjour {user.email.split('@')[0]}
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        {user.role === 'client' && 'Votre espace client Vitrina.'}
        {user.role === 'commercant' && 'Votre espace commerçant Vitrina.'}
        {user.role === 'admin' && "Votre espace d'administration Vitrina."}
      </p>

      {user.role === 'client' && <TableauClient />}
      {user.role === 'commercant' && <TableauCommercant />}
      {user.role === 'admin' && <TableauAdmin />}
    </div>
  );
}

function TableauClient() {
  const [nbFavoris, setNbFavoris] = useState(null);

  useEffect(() => {
    api
      .get('/favoris')
      .then((res) => setNbFavoris(res.data.favoris.length))
      .catch(() => setNbFavoris(0));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <CarteAction
        titre="Rechercher"
        description="Trouver un produit ou un commerce à Mornag."
        lien="/recherche"
        libelleLien="Lancer une recherche"
      />
      <CarteChiffre
        titre="Mes favoris"
        chiffre={nbFavoris}
        lien="/favoris"
        libelleLien="Voir mes favoris"
      />
    </div>
  );
}

function TableauCommercant() {
  const [commerce, setCommerce] = useState(undefined);
  const [nbProduits, setNbProduits] = useState(null);

  useEffect(() => {
    api
      .get('/commerces/me')
      .then((res) => setCommerce(res.data.commerce))
      .catch(() => setCommerce(null));

    api
      .get('/produits/mes-produits')
      .then((res) => setNbProduits(res.data.produits.length))
      .catch(() => setNbProduits(0));
  }, []);

  if (commerce === undefined) {
    return <p className="text-gray-500 text-sm">Chargement...</p>;
  }

  if (commerce === null) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-ink mb-1.5">Créez votre profil boutique</h2>
        <p className="text-sm text-gray-600 mb-4">
          Vous n'avez pas encore de commerce enregistré. Créez-le pour commencer à
          publier votre catalogue.
        </p>
        <Link
          to="/mon-commerce"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Créer mon commerce
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-xs text-gray-500 mb-1">Mon commerce</p>
        <p className="font-semibold text-ink mb-1">{commerce.nom}</p>
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-3 ${
            commerce.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {commerce.active ? 'Visible dans la recherche' : 'Suspendu par un admin'}
        </span>
        <Link to="/mon-commerce" className="block text-sm text-primary font-medium">
          Modifier mon profil →
        </Link>
      </div>
      <CarteChiffre
        titre="Mes produits"
        chiffre={nbProduits}
        lien="/mes-produits"
        libelleLien="Gérer mon catalogue"
      />
    </div>
  );
}

function TableauAdmin() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get('/admin/statistiques')
      .then((res) => setStats(res.data.statistiques))
      .catch(() => {});
  }, []);

  return (
    <div>
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <MiniStat label="Clients" valeur={stats.nbClients} />
          <MiniStat label="Commerçants" valeur={stats.nbCommercants} />
          <MiniStat label="Commerces actifs" valeur={stats.nbCommercesActifs} />
          <MiniStat label="Produits" valeur={stats.nbProduits} />
        </div>
      )}
      <Link
        to="/admin"
        className="inline-block bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
      >
        Ouvrir le panneau d'administration →
      </Link>
    </div>
  );
}

function CarteAction({ titre, description, lien, libelleLien }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="font-semibold text-ink mb-1.5">{titre}</p>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <Link to={lien} className="text-sm text-primary font-medium">
        {libelleLien} →
      </Link>
    </div>
  );
}

function CarteChiffre({ titre, chiffre, lien, libelleLien }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-xs text-gray-500 mb-1">{titre}</p>
      <p className="text-3xl font-display font-semibold text-accent mb-3">
        {chiffre === null ? '—' : chiffre}
      </p>
      <Link to={lien} className="text-sm text-primary font-medium">
        {libelleLien} →
      </Link>
    </div>
  );
}

function MiniStat({ label, valeur }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-2xl font-display font-semibold text-accent">{valeur}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}