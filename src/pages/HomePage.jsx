import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-14 text-center">
        <p className="text-accent font-semibold text-sm tracking-wide uppercase mb-4">
          Mornag · Vêtements & chaussures
        </p>
        <h1 className="text-4xl sm:text-5xl font-display font-semibold text-ink leading-tight mb-5">
          Les commerces de votre quartier,
          <br />
          sans faire défiler Facebook.
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto mb-8">
          Vitrina rassemble les boutiques de Mornag dans un seul endroit : cherchez un
          article, trouvez le commerce le plus proche, contactez-le directement.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/recherche"
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Rechercher un commerce
          </Link>
          <Link
            to="/register"
            className="bg-white border border-gray-300 hover:border-primary text-ink px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Je suis commerçant
          </Link>
        </div>
      </section>

      {/* Comment ça marche - côté client */}
      <section className="max-w-4xl mx-auto px-6 py-14 border-t border-gray-200">
        <h2 className="text-xl font-display font-semibold text-ink text-center mb-10">
          Comment ça marche
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <Etape
            numero="01"
            titre="Cherchez"
            description="Un mot-clé (jean, basket) ou une zone (Mornag Centre, El Gounna...)."
          />
          <Etape
            numero="02"
            titre="Comparez"
            description="Consultez les fiches commerce : catalogue, horaires, distance."
          />
          <Etape
            numero="03"
            titre="Contactez"
            description="Appelez ou déplacez-vous directement, sans intermédiaire."
          />
        </div>
      </section>

      {/* Pour les commerçants */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-accent font-semibold text-sm tracking-wide uppercase mb-3">
              Pour les commerçants
            </p>
            <h2 className="text-2xl font-display font-semibold text-ink mb-4">
              Remplacez vos Stories qui disparaissent en 24h
              par une vitrine permanente.
            </h2>
            <p className="text-gray-600 mb-6">
              Créez votre profil boutique, publiez votre catalogue en quelques minutes,
              et soyez trouvé par les clients de votre quartier — même si vous venez
              d'ouvrir.
            </p>
            <Link
              to="/register"
              className="inline-block bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
            >
              Créer ma boutique
            </Link>
          </div>
          <ul className="flex flex-col gap-4">
            <Avantage texte="Catalogue permanent, plus besoin de republier chaque jour" />
            <Avantage texte="Visible dès l'inscription, sans historique ni audience à construire" />
            <Avantage texte="Vos clients vous trouvent par produit et par zone" />
          </ul>
        </div>
      </section>

      <footer className="max-w-4xl mx-auto px-6 py-10 text-center">
        <p className="text-sm text-gray-400">Vitrina · Mornag, Tunisie</p>
      </footer>
    </div>
  );
}

function Etape({ numero, titre, description }) {
  return (
    <div>
      <p className="text-accent font-display font-semibold text-2xl mb-2">{numero}</p>
      <h3 className="font-semibold text-ink mb-1.5">{titre}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function Avantage({ texte }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
      <span className="text-gray-700 text-sm">{texte}</span>
    </li>
  );
}