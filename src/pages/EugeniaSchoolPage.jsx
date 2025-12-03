import { Link } from 'react-router-dom';
import PageLayout from '../components/shared/PageLayout';

export default function EugeniaSchoolPage() {
  return (
    <PageLayout school="eugenia">
      <div style={{ backgroundColor: '#000000' }}>
      
      {/* Hero Section */}
      <section className="hero py-20 px-4">
        <div className="hero-content text-center max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Bienvenue sur l'Espace Communauté
            <br />
            <span className="text-eugenia-yellow">Eugenia School</span>
          </h1>
          
          <p className="hero-subtitle text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Découvrez la vie, les talents et l'engagement des étudiants Eugenia School
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/eugenia-school/portfolio" className="btn btn-primary text-lg py-4 px-8">
              📁 Découvrir les portfolios
            </Link>
            <Link to="/eugenia-school/ambassadeurs" className="btn btn-secondary text-lg py-4 px-8">
              🌟 Rejoindre les ambassadeurs
            </Link>
            <Link to="/eugenia-school/associations" className="btn btn-secondary text-lg py-4 px-8">
              🎪 Explorer les associations
            </Link>
          </div>
        </div>
      </section>

      {/* Section 1: Portfolio d'École */}
      <section id="portfolio" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenu texte */}
            <div>
              <div className="inline-block bg-eugenia-yellow/20 text-eugenia-burgundy px-4 py-2 rounded-full text-sm font-semibold mb-4">
                📁 Portfolios du Mois
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Exposez vos projets, montrez vos compétences
              </h2>
              
              <div className="space-y-4 mb-6">
                <p className="text-gray-600 text-lg">
                  <strong className="text-eugenia-burgundy">Problème :</strong> Les projets étudiants restent peu visibles, les talents ne sont pas valorisés.
                </p>
                <p className="text-gray-600 text-lg">
                  <strong className="text-eugenia-pink">Solution :</strong> Découvrez les portfolios des étudiants, leurs réalisations techniques, design et innovation.
                </p>
                <p className="text-gray-600 text-lg">
                  <strong className="text-eugenia-yellow">Valeur :</strong> Valorisation des talents, image innovante de l'école, communauté active et inspirante.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/eugenia-school/portfolio" className="btn btn-primary">
                  Découvrir les portfolios
                </Link>
                <a href="https://github.com/eugenia-school" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  Voir sur GitHub
                </a>
              </div>
            </div>

            {/* Visuels */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card text-center">
                <div className="text-5xl mb-2">🎨</div>
                <h3 className="font-bold text-lg mb-2">Design</h3>
                <p className="text-gray-600 text-sm">Projets UI/UX</p>
              </div>
              <div className="card text-center">
                <div className="text-5xl mb-2">💻</div>
                <h3 className="font-bold text-lg mb-2">Développement</h3>
                <p className="text-gray-600 text-sm">Apps & Web</p>
              </div>
              <div className="card text-center">
                <div className="text-5xl mb-2">📱</div>
                <h3 className="font-bold text-lg mb-2">Applications</h3>
                <p className="text-gray-600 text-sm">Mobile & Desktop</p>
              </div>
              <div className="card text-center">
                <div className="text-5xl mb-2">🚀</div>
                <h3 className="font-bold text-lg mb-2">Innovation</h3>
                <p className="text-gray-600 text-sm">Projets disruptifs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Programme Ambassadeur */}
      <section id="ambassadeurs" className="py-16 px-4 bg-gradient-to-br from-eugenia-burgundy/10 to-eugenia-pink/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visuels */}
            <div className="grid grid-cols-1 gap-4 order-2 lg:order-1">
              <div className="card">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold text-xl mb-2">Dashboard Personnel</h3>
                <p className="text-gray-600">Suivez vos points, missions et classement en temps réel.</p>
              </div>
              <div className="card">
                <div className="text-4xl mb-3">⭐</div>
                <h3 className="font-bold text-xl mb-2">Système de Points</h3>
                <p className="text-gray-600">Gagnez des points pour chaque action validée et montez dans le classement.</p>
              </div>
              <div className="card">
                <div className="text-4xl mb-3">📱</div>
                <h3 className="font-bold text-xl mb-2">Posts LinkedIn</h3>
                <p className="text-gray-600">Partagez vos réalisations et valorisez votre parcours.</p>
              </div>
            </div>

            {/* Contenu texte */}
            <div className="order-1 lg:order-2">
              <div className="inline-block bg-eugenia-yellow/20 text-eugenia-burgundy px-4 py-2 rounded-full text-sm font-semibold mb-4">
                🌟 Ambassadeurs du Mois
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Participez aux missions, devenez leader !
              </h2>
              
              <div className="space-y-4 mb-6">
                <p className="text-gray-600 text-lg">
                  <strong className="text-eugenia-burgundy">Problème :</strong> Les ambassadeurs sont dispersés, leurs actions peu suivies.
                </p>
                <p className="text-gray-600 text-lg">
                  <strong className="text-eugenia-pink">Solution :</strong> Suivez et participez aux actions ambassadeurs, missions et événements.
                </p>
                <p className="text-gray-600 text-lg">
                  <strong className="text-eugenia-yellow">Valeur :</strong> Engagement mesurable, leadership reconnu, communauté soudée.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/eugenia-school/ambassadeurs" className="btn btn-primary">
                  Rejoindre le programme
                </Link>
                <Link to="/eugenia-school/leaderboard" className="btn btn-outline">
                  Voir le classement
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Associations */}
      <section id="associations" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenu texte */}
            <div>
              <div className="inline-block bg-eugenia-yellow/20 text-eugenia-burgundy px-4 py-2 rounded-full text-sm font-semibold mb-4">
                🎪 Associations du Mois
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Vivez le campus autrement
              </h2>
              
              <div className="space-y-4 mb-6">
                <p className="text-gray-600 text-lg">
                  <strong className="text-eugenia-burgundy">Problème :</strong> Les assos manquent de visibilité, les événements peu connus.
                </p>
                <p className="text-gray-600 text-lg">
                  <strong className="text-eugenia-pink">Solution :</strong> Explorez la vie associative, agenda des événements, recrutement.
                </p>
                <p className="text-gray-600 text-lg">
                  <strong className="text-eugenia-yellow">Valeur :</strong> Vie étudiante riche, engagement communautaire, réseau actif.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/eugenia-school/associations" className="btn btn-primary">
                  Découvrir les associations
                </Link>
                <Link to="/eugenia-school/associations/agenda" className="btn btn-outline">
                  Voir l'agenda
                </Link>
              </div>
            </div>

            {/* Visuels */}
            <div className="grid grid-cols-3 gap-4">
              {['🎭', '🎵', '⚽', '🎨', '🤝', '💡'].map((emoji, i) => (
                <div key={i} className="card text-center">
                  <div className="text-4xl mb-2">{emoji}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section À propos */}
      <section className="py-16 px-4 bg-gradient-to-br from-eugenia-burgundy/10 to-eugenia-pink/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            À propos d'Eugenia School
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            Eugenia School est une école d'innovation qui forme les talents de demain. 
            Notre plateforme communautaire permet de valoriser l'engagement, les projets 
            et les réalisations de nos étudiants.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Rejoignez une communauté dynamique où chaque talent compte et où l'innovation 
            est au cœur de notre ADN.
          </p>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            Comment ça marche ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-5xl mb-4">1️⃣</div>
              <h3 className="text-2xl font-bold mb-4">Partagez</h3>
              <p className="text-gray-600">
                Les étudiants partagent leurs projets, s'engagent comme ambassadeurs 
                ou participent aux associations.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">2️⃣</div>
              <h3 className="text-2xl font-bold mb-4">Découvrez</h3>
              <p className="text-gray-600">
                Les visiteurs découvrent, likent, partagent ou rejoignent les initiatives 
                et projets étudiants.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">3️⃣</div>
              <h3 className="text-2xl font-bold mb-4">Grandissez</h3>
              <p className="text-gray-600">
                Les talents sont mis en avant, la communauté grandit et l'école 
                rayonne grâce à ses étudiants.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/eugenia-school/portfolio" className="btn btn-primary text-lg px-8 py-4 mr-4">
              Découvrir les portfolios
            </Link>
            <Link to="/eugenia-school/ambassadeurs" className="btn btn-secondary text-lg px-8 py-4">
              Rejoindre les ambassadeurs
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="student-hero-section py-20 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card bg-white/10 backdrop-blur-lg border border-white/20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à rejoindre la communauté ?
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Explorez les portfolios, participez aux programmes ou découvrez les associations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/eugenia-school/portfolio" className="btn btn-primary text-lg px-8 py-4">
                📁 Portfolio
              </Link>
              <Link to="/eugenia-school/ambassadeurs" className="btn btn-secondary text-lg px-8 py-4">
                🌟 Ambassadeur
              </Link>
              <Link to="/eugenia-school/associations" className="btn btn-secondary text-lg px-8 py-4">
                🎪 Association
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>
    </PageLayout>
  );
}

