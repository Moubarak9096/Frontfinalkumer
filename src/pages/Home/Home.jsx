import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import HeroSection from '../../components/HeroSection/HeroSection';
import EventCard from '../../components/EventCard/EventCard';
import axios from "axios";
import CountUp from "../../components/CountUp";
import TextReveal from "../../components/TextReveal";
import { useAuthContext } from '../../context/AuthContext'; // Import du AuthContext

const Home = () => {
  // Utilisation du contexte d'authentification
  const { user, isUser, isAgency, isOrganizer, isSuperAdmin, loading: authLoading } = useAuthContext();
  
  const [competitions, setCompetitions] = useState([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // ✅ Top Organisateurs (restauré)
  const topOrganizers = [
    { id: 1, name: "Gouvernement Togolais", votes: 25000, verified: true, avatar: "/assets/images/client/client-12.png" },
    { id: 2, name: "Mairie de Lomé", votes: 23000, verified: false, avatar: "/assets/images/client/client-2.png" },
    { id: 3, name: "Université de Lomé", votes: 21000, verified: true, avatar: "/assets/images/client/client-3.png" },
    { id: 4, name: "Association Jeunesse", votes: 20000, verified: true, avatar: "/assets/images/client/client-4.png" },
    { id: 5, name: "Ministère de la Culture", votes: 18500, verified: true, avatar: "/assets/images/client/client-5.png" },
    { id: 6, name: "Fédération Sportive", votes: 17500, verified: false, avatar: "/assets/images/client/client-6.png" }
  ];

  // ✅ Charger les compétitions depuis ton API
  useEffect(() => {
    fetchCompetitions();
    fetchCategories();
  }, []);

  // Filtrer et trier les compétitions quand les filtres changent
  useEffect(() => {
    filterAndSortCompetitions();
  }, [competitions, selectedCategory, sortBy]);

  // ✅ Charger les catégories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://api-klumer-node-votings-dev.onrender.com/categories"
      );

      console.log("API categories:", response.data);

      // ✅ L'API renvoie directement un tableau
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur API catégories :", error);
      setCategories([]);
    }
  };
  
  const fetchCompetitions = async () => {
    try {
      const response = await axios.get(
        "https://api-klumer-node-votings-dev.onrender.com/competitions"
      );

      console.log("API competitions:", response.data);

      // ✅ Adapter les données API au format EventCard
      const formatted = response.data.map((c) => ({
        id: c.id,
        title: c.title || c.name,
        description: c.description || "Aucune description disponible",
        // Utiliser l'image de l'événement, sinon une image par défaut
        image: c.image || c.coverImage || c.thumbnail || "/assets/images/portfolio/portfolio-01.jpg",
        endDate: c.endDate || c.end_date || "Non spécifiée",
        startDate: c.startDate || c.start_date,
        createdAt: c.createdAt || c.created_at || new Date().toISOString(),
        participants: c.participants || c.voteCount || 0,
        category: typeof c.category === 'object' ? c.category.name : c.category,
        categoryId: typeof c.category === 'object' ? c.category.id : null,
        status: c.status || "active",
        isActive: c.isActive !== undefined ? c.isActive : true
      }));

      // Trier par date de création (les plus récents d'abord) et prendre les 10 derniers
      const sortedByRecent = [...formatted]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 12);

      setCompetitions(sortedByRecent);
      setFilteredCompetitions(sortedByRecent);
    } catch (error) {
      console.error("Erreur API compétitions :", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer et trier les compétitions
  const filterAndSortCompetitions = () => {
    let filtered = [...competitions];

    // Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter(comp => 
        comp.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        comp.categoryId?.toString() === selectedCategory
      );
    }

    // Trier selon l'option sélectionnée
    switch(sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popular':
        filtered.sort((a, b) => b.participants - a.participants);
        break;
      case 'ending':
        // Filtrer les événements avec une date de fin
        const withEndDate = filtered.filter(c => c.endDate && c.endDate !== "Non spécifiée");
        const withoutEndDate = filtered.filter(c => !c.endDate || c.endDate === "Non spécifiée");
        
        withEndDate.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
        filtered = [...withEndDate, ...withoutEndDate];
        break;
      case 'active':
        filtered.sort((a, b) => (b.isActive === a.isActive ? 0 : b.isActive ? 1 : -1));
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Toujours limiter à 10 événements maximum
    filtered = filtered.slice(0, 12);
    setFilteredCompetitions(filtered);
  };

  // Gestion des changements de filtres
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Fonction pour déterminer le lien de création d'événement
  const getCreateEventLink = () => {
    // Si l'authentification est en cours de chargement, retourner login pour éviter les problèmes
    if (authLoading) {
      return "/login";
    }
    
    // Si l'utilisateur n'est pas connecté, rediriger vers login
    if (!user) {
      return "/login";
    }
    
    // Si l'utilisateur est connecté mais est de type "user", ne pas permettre la création
    if (isUser) {
      return "#"; // ou "/user-profile" selon votre préférence
    }
    
    // Pour tous les autres rôles (agency, organizer, superadmin), permettre la création
    return "/create-event";
  };

  // Fonction pour déterminer si le lien est actif
  const isCreateEventEnabled = () => {
    if (authLoading) return false;
    if (!user) return false;
    if (isUser) return false;
    return true;
  };

  // Fonction pour déterminer le lien des résultats/analyses
  const getAnalyticsLink = () => {
    if (authLoading) {
      return "/login";
    }
    
    if (!user) {
      return "/login";
    }
    
    // Pour les utilisateurs de type "user", rediriger vers leur profil
    if (isUser) {
      return "/user-profile";
    }
    
    // Pour les autres rôles, rediriger vers le dashboard agency
    return "/agency";
  };

  // Fonction pour obtenir le texte du titre de l'étape 3
  const getStep3Title = () => {
    if (isCreateEventEnabled()) {
      return "Créez un événement";
    } else {
      return "Créez un événement";
    }
  };

  // Fonction pour obtenir la description de l'étape 3
  const getStep3Description = () => {
    if (isCreateEventEnabled()) {
      return "Organisez vos propres consultations et votes en ligne.";
    } else {
      return "Inscrivez-vous en tant qu'organisateur pour créer vos événements.";
    }
  };

  return (
    <div className="template-color-1 with-particles">
      <div id="particles-js"></div>

      <Header />
      <HeroSection />

      {/* ✅ Section Top Organisateurs */}
      <div className="rn-top-top-seller-area nice-selector-transparent rn-section-gapTop">
        <div className="container">
          <div className="row mb--30">
            <div className="col-12 justify-sm-center d-flex">
              <h3 className="title">Top Organisateurs</h3>
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

      {/* ✅ Section Événements en Cours (avec API) */}
      <div className="rn-product-area rn-section-gapTop">
        <div className="container">
          <div className="row mb--30 align-items-center">
            <div className="col-12">
              <h3 className="title mb--0">Evénements en cours </h3>
              <p className="text-muted">Découvrez les événements de vote les plus récents</p>
            </div>
          </div>

          {/* ✅ Filtres améliorés */}
          <div className="default-exp-wrapper">
            <div className="inner">
              
              <div className="filter-select-option">
                <label className="filter-leble">Catégorie</label>
               <select 
  id="category-select"
  value={selectedCategory} 
  onChange={handleCategoryChange}
  className="no-nice-select filter-select"
>
  <option value="">Toutes catégories</option>
  {categories.map((cat) => (
    <option key={cat.id} value={cat.name}>
      {cat.name}
    </option>
  ))}
</select>

              </div>

             <>
<style>
  {`
    /* Affichage du champ select */
    .filter-select {
      background: transparent;
      color: #fff;                /* texte visible dans le champ fermé */
      font-size: 1.1rem;
      padding: 0.5rem 1rem;
      border: 1px solid #fff;
      border-radius: 4px;
      cursor: pointer;
      appearance: none;
      transition: border-color 0.2s ease, color 0.2s ease;
    }

    .filter-select:focus {
      outline: none;
      border-color: #dd1b44;      /* focus rouge */
    }

    .filter-select:hover {
      border-color: #dd1b44;      /* survol du champ */
    }

    /* Liste d'options (dans le menu natif) */
    .filter-select option {
    
      color: #141414;             /* texte foncé lisible */
      font-size: 1.1rem;
    }

    /* Option sélectionnée (après choix) */
    .filter-select option:checked {
      background: #dd1b44;        /* rouge Klumer */
      color: #ffffff;
    }
  `}
</style>



  
</>

            </div>
          </div>

          {/* ✅ Affichage des compétitions */}
         
<div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
  {loading ? (
    <div className="col-12 text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
      <p className="text-white mt-3">Chargement des événements...</p>
    </div>
  ) : filteredCompetitions.length === 0 ? (
    <div className="col-12 text-center py-5">
      <div className="alert alert-info">
        <i className="feather-calendar me-2"></i>
        Aucun événement trouvé. 
        {selectedCategory && ` Essayez de changer de catégorie.`}
      </div>
      <button 
        className="btn btn-primary mt-3"
        onClick={() => {
          setSelectedCategory('');
          setSortBy('recent');
        }}
      >
        Voir tous les événements
      </button>
    </div>
  ) : (
    filteredCompetitions.map((competition) => (
      <EventCard key={competition.id} event={competition} />
    ))
  )}
</div>

          {/* Bouton pour voir tous les événements */}
          {!loading && filteredCompetitions.length > 0 && (
            <div className="row mt-5">
              <div className="col-12 text-center">
                <a href="/competitions" className="btn btn-primary btn-lg">
                  <i className="feather-list me-2"></i>
                  Voir tous les événements
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Section Fonctionnalités */}
      <div className="rn-service-area rn-section-gapTop">
        <div className="container">
          <div className="row">
            <div className="col-12 mb--50">
              <h3 className="title">Comment fonctionne Klumer ?</h3>
            </div>
          </div>

          <div className="row g-5">
            {/* Étape 1 */}
            <div className="col-xxl-3 col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="rn-service-one color-shape-7">
                <div className="inner">
                  <div className="icon">
                    <img src="/assets/images/icons/shape-7.png" alt="Créer" />
                  </div>
                  <div className="subtitle">Étape 1</div>
                  <div className="content">
                    <h4 className="title"><a href="/login">Créez votre compte</a></h4>
                    <p className="description">
                      Inscrivez-vous en quelques secondes avec votre email ou numéro de téléphone.
                    </p>
                    <a className="read-more-button" href="/login">
                      <i className="feather-arrow-right"></i>
                    </a>
                  </div>
                </div>
                <a className="over-link" href="/login"></a>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="col-xxl-3 col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="rn-service-one color-shape-1">
                <div className="inner">
                  <div className="icon">
                    <img src="/assets/images/icons/shape-1.png" alt="Participer" />
                  </div>
                  <div className="subtitle">Étape 2</div>
                  <div className="content">
                    <h4 className="title"><a href="/competitions">Participez aux votes</a></h4>
                    <p className="description">
                      Votez en toute sécurité sur les événements qui vous intéressent.
                    </p>
                    <a className="read-more-button" href="/competitions">
                      <i className="feather-arrow-right"></i>
                    </a>
                  </div>
                </div>
                <a className="over-link" href="/competitions"></a>
              </div>
            </div>

            {/* Étape 3 - MODIFIÉE */}
            <div className="col-xxl-3 col-lg-4 col-md-6 col-sm-6 col-12">
              <div className={`rn-service-one color-shape-5 ${!isCreateEventEnabled() ? 'disabled-feature' : ''}`}>
                <div className="inner">
                  <div className="icon">
                    <img src="/assets/images/icons/shape-5.png" alt="Créer événement" />
                    {!isCreateEventEnabled() && user && (
                      <div className="icon-lock">
                        <i className="feather-lock"></i>
                      </div>
                    )}
                  </div>
                  <div className="subtitle">Étape 3</div>
                  <div className="content">
                    <h4 className="title">
                      <a 
                        href={getCreateEventLink()} 
                        className={!isCreateEventEnabled() ? 'disabled-link' : ''}
                        onClick={(e) => {
                          if (!isCreateEventEnabled() && user) {
                            e.preventDefault();
                            // Optionnel: afficher un message ou rediriger
                          }
                        }}
                      >
                        {getStep3Title()}
                      </a>
                    </h4>
                    <p className="description">
                      {getStep3Description()}
                    </p>
                    <a 
                      className={`read-more-button ${!isCreateEventEnabled() ? 'disabled' : ''}`}
                      href={getCreateEventLink()}
                      onClick={(e) => {
                        if (!isCreateEventEnabled() && user) {
                          e.preventDefault();
                          // Rediriger vers la page d'inscription organisateur
                          window.location.href = "/register-organizer";
                        }
                      }}
                    >
                      <i className={`feather-${isCreateEventEnabled() ? 'arrow-right' : 'lock'}`}></i>
                    </a>
                  </div>
                  
                  {/* Message pour les users connectés */}
                  {!isCreateEventEnabled() && user && (
                    <div className="access-message">
                      <small>
                        <i className="feather-info mr-1"></i>
                        Réservé aux organisateurs
                      </small>
                    </div>
                  )}
                </div>
                <a 
                  className="over-link" 
                  href={getCreateEventLink()}
                  onClick={(e) => {
                    if (!isCreateEventEnabled() && user) {
                      e.preventDefault();
                      window.location.href = "/register-organizer";
                    }
                  }}
                ></a>
              </div>
            </div>

            {/* Étape 4 — Analysez les résultats */}
            <div className="col-xxl-3 col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="rn-service-one color-shape-6">
                <div className="inner">
                  <div className="icon">
                    <img src="/assets/images/icons/shape-6.png" alt="Résultats" />
                  </div>
                  <div className="subtitle">Étape 4</div>
                  <div className="content">
                    <h4 className="title">
                      <a href={getAnalyticsLink()}>
                        Analysez les résultats
                      </a>
                    </h4>
                    <p className="description">
                      Consultez les résultats en temps réel avec des statistiques détaillées.
                    </p>
                    <a 
                      className="read-more-button" 
                      href={getAnalyticsLink()}
                    >
                      <i className="feather-arrow-right"></i>
                    </a>
                  </div>
                </div>
                <a 
                  className="over-link" 
                  href={getAnalyticsLink()}
                ></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Section Statistiques */}
      <div className="rn-collection-area rn-section-gapTop">
        <div className="container">
          <TextReveal text="KLUMER C'EST " duration={2000} />

          <div className="row g-5">
            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="text-center">
                <h2 className="text-primary"><CountUp end={50000} duration={2000} />+</h2>
                <p>Utilisateurs inscrits</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="text-center">
                <h2 className="text-primary"><CountUp end={200} duration={2000} />+</h2>
                <p>Événements créés</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="text-center">
                <h2 className="text-primary"><CountUp end={1000000} duration={2000} />+</h2>
                <p>Votes enregistrés</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="text-center">
                <h2 className="text-primary"><CountUp end={10} duration={2000} />+</h2>
                <p>Pays couverts</p>
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