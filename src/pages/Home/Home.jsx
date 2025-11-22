import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import HeroSection from '../../components/HeroSection/HeroSection';
import EventCard from '../../components/EventCard/EventCard';
// import './Home.css';

const Home = () => {
  // Données des événements de vote adaptées pour Klumer
  const events = [
    {
      id: 1,
      title: "Élection Présidentielle Togo 2024",
      description: "Participez à l'élection présidentielle digitale",
      image: "/assets/images/portfolio/portfolio-01.jpg",
      endDate: "2024-12-31",
      participants: 15000,
      category: "Politique",
      status: "active"
    },
    {
      id: 2,
      title: "Concours Meilleur Artiste Togolais",
      description: "Votez pour votre artiste préféré",
      image: "/assets/images/portfolio/portfolio-02.jpg",
      endDate: "2024-11-15", 
      participants: 8500,
      category: "Culture",
      status: "active"
    },
    {
      id: 3,
      title: "Référendum Constitutionnel",
      description: "Donnez votre avis sur les réformes constitutionnelles",
      image: "/assets/images/portfolio/portfolio-03.jpg",
      endDate: "2024-10-30",
      participants: 12000,
      category: "Politique",
      status: "active"
    },
    {
      id: 4,
      title: "Élection Municipale Lomé",
      description: "Choissisez vos représentants locaux",
      image: "/assets/images/portfolio/portfolio-04.jpg",
      endDate: "2024-09-20",
      participants: 9500,
      category: "Politique",
      status: "active"
    },
    {
      id: 5,
      title: "Meilleure Innovation Togolaise",
      description: "Votez pour la meilleure startup de l'année",
      image: "/assets/images/portfolio/portfolio-05.jpg",
      endDate: "2024-08-15",
      participants: 7200,
      category: "Innovation",
      status: "active"
    },
    {
      id: 6,
      title: "Sportif Togolais de l'Année",
      description: "Élisez le meilleur athlète togolais",
      image: "/assets/images/portfolio/portfolio-06.jpg",
      endDate: "2024-07-30",
      participants: 6800,
      category: "Sport",
      status: "active"
    }
  ];

  const topOrganizers = [
    { id: 1, name: "Gouvernement Togolais", votes: 25000, verified: true, avatar: "/assets/images/client/client-12.png" },
    { id: 2, name: "Mairie de Lomé", votes: 23000, verified: false, avatar: "/assets/images/client/client-2.png" },
    { id: 3, name: "Université de Lomé", votes: 21000, verified: true, avatar: "/assets/images/client/client-3.png" },
    { id: 4, name: "Association Jeunesse", votes: 20000, verified: true, avatar: "/assets/images/client/client-4.png" },
    { id: 5, name: "Ministère de la Culture", votes: 18500, verified: true, avatar: "/assets/images/client/client-5.png" },
    { id: 6, name: "Fédération Sportive", votes: 17500, verified: false, avatar: "/assets/images/client/client-6.png" }
  ];

  return (
    <div className="template-color-1 with-particles">
      <div id="particles-js"></div>
      
      <Header />
      <HeroSection />
      
      {/* Section Top Organisateurs */}
      <div className="rn-top-top-seller-area nice-selector-transparent rn-section-gapTop">
        <div className="container">
          <div className="row mb--30">
            <div className="col-12 justify-sm-center d-flex">
              <h3 className="title" data-sal-delay="150" data-sal="slide-up" data-sal-duration="800">
                Top Organisateurs
              </h3>
              <select>
                <option data-display="Ce mois">Ce mois</option>
                <option value="1">7 jours</option>
                <option value="2">15 jours</option>
                <option value="4">30 jours</option>
              </select>
            </div>
          </div>
          
          <div className="row justify-sm-center g-5 top-seller-list-wrapper">
            {topOrganizers.map(organizer => (
              <div key={organizer.id} className="col-5 col-lg-3 col-md-4 col-sm-6 top-seller-list">
                <div className="top-seller-inner-one">
                  <div className="top-seller-wrapper">
                    <div className={`thumbnail ${organizer.verified ? 'varified' : ''}`}>
                      <a href={`/organizer/${organizer.id}`}>
                        <img src={organizer.avatar} alt={organizer.name} />
                      </a>
                    </div>
                    <div className="top-seller-content">
                      <a href={`/organizer/${organizer.id}`}>
                        <h6 className="name">{organizer.name}</h6>
                      </a>
                      <span className="count-number">
                        {organizer.votes.toLocaleString()} votes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Événements en Cours */}
      <div className="rn-product-area rn-section-gapTop">
        <div className="container">
          <div className="row mb--30 align-items-center">
            <div className="col-12">
              <h3 className="title mb--0" data-sal-delay="150" data-sal="slide-up" data-sal-duration="800">
                Événements de Vote en Cours
              </h3>
            </div>
          </div>

          {/* Filtres adaptés pour les votes */}
          <div className="default-exp-wrapper">
            <div className="inner">
              <div className="filter-select-option">
                <label className="filter-leble">TRIER PAR</label>
                <select>
                  <option data-display="Plus populaires">Plus populaires</option>
                  <option value="1">Moins populaires</option>
                  <option value="2">Date de fin</option>
                  <option value="3">Nouveaux</option>
                </select>
              </div>
              
              <div className="filter-select-option">
                <label className="filter-leble">Catégorie</label>
                <select>
                  <option data-display="Toutes catégories">Toutes catégories</option>
                  <option value="1">Politique</option>
                  <option value="2">Culture</option>
                  <option value="3">Éducation</option>
                  <option value="4">Sport</option>
                  <option value="5">Innovation</option>
                </select>
              </div>

              <div className="filter-select-option">
                <label className="filter-leble">Statut</label>
                <select>
                  <option data-display="Tous les statuts">Tous les statuts</option>
                  <option value="1">En cours</option>
                  <option value="2">À venir</option>
                  <option value="3">Terminés</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row g-5 mt_dec--30">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>

      {/* Section Fonctionnalités - Adaptée pour le vote */}
      <div className="rn-service-area rn-section-gapTop">
        <div className="container">
          <div className="row">
            <div className="col-12 mb--50">
              <h3 className="title" data-sal-delay="150" data-sal="slide-up" data-sal-duration="800">
                Comment fonctionne Klumer ?
              </h3>
            </div>
          </div>
          <div className="row g-5">
            <div className="col-xxl-3 col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="rn-service-one color-shape-7">
                <div className="inner">
                  <div className="icon">
                    <img src="/assets/images/icons/shape-7.png" alt="Créer" />
                  </div>
                  <div className="subtitle">Étape 1</div>
                  <div className="content">
                    <h4 className="title"><a href="#">Créez votre compte</a></h4>
                    <p className="description">
                      Inscrivez-vous en quelques secondes avec votre email ou numéro de téléphone.
                    </p>
                    <a className="read-more-button" href="/register">
                      <i className="feather-arrow-right"></i>
                    </a>
                  </div>
                </div>
                <a className="over-link" href="/register"></a>
              </div>
            </div>

            <div className="col-xxl-3 col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="rn-service-one color-shape-1">
                <div className="inner">
                  <div className="icon">
                    <img src="/assets/images/icons/shape-1.png" alt="Participer" />
                  </div>
                  <div className="subtitle">Étape 2</div>
                  <div className="content">
                    <h4 className="title"><a href="#">Participez aux votes</a></h4>
                    <p className="description">
                      Votez en toute sécurité sur les événements qui vous intéressent.
                    </p>
                    <a className="read-more-button" href="/events">
                      <i className="feather-arrow-right"></i>
                    </a>
                  </div>
                </div>
                <a className="over-link" href="/events"></a>
              </div>
            </div>

            <div className="col-xxl-3 col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="rn-service-one color-shape-5">
                <div className="inner">
                  <div className="icon">
                    <img src="/assets/images/icons/shape-5.png" alt="Créer événement" />
                  </div>
                  <div className="subtitle">Étape 3</div>
                  <div className="content">
                    <h4 className="title"><a href="#">Créez un événement</a></h4>
                    <p className="description">
                      Organisez vos propres consultations et votes en ligne.
                    </p>
                    <a className="read-more-button" href="/create-event">
                      <i className="feather-arrow-right"></i>
                    </a>
                  </div>
                </div>
                <a className="over-link" href="/create-event"></a>
              </div>
            </div>

            <div className="col-xxl-3 col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="rn-service-one color-shape-6">
                <div className="inner">
                  <div className="icon">
                    <img src="/assets/images/icons/shape-6.png" alt="Résultats" />
                  </div>
                  <div className="subtitle">Étape 4</div>
                  <div className="content">
                    <h4 className="title"><a href="#">Analysez les résultats</a></h4>
                    <p className="description">
                      Consultez les résultats en temps réel avec des statistiques détaillées.
                    </p>
                    <a className="read-more-button" href="/results">
                      <i className="feather-arrow-right"></i>
                    </a>
                  </div>
                </div>
                <a className="over-link" href="/results"></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Statistiques */}
      <div className="rn-collection-area rn-section-gapTop">
        <div className="container">
          <div className="row mb--50 align-items-center">
            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
              <h3 className="title mb--0" data-sal-delay="150" data-sal="slide-up" data-sal-duration="800">
                Klumer en Chiffres
              </h3>
            </div>
          </div>

          <div className="row g-5">
            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="text-center">
                <h2 className="text-primary">50,000+</h2>
                <p>Utilisateurs inscrits</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="text-center">
                <h2 className="text-primary">200+</h2>
                <p>Événements créés</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="text-center">
                <h2 className="text-primary">1M+</h2>
                <p>Votes enregistrés</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="text-center">
                <h2 className="text-primary">5</h2>
                <p>Régions couvertes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;