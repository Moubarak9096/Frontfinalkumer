// Fichier: src/pages/About/About.jsx
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import des icônes (remplacer par vos icônes réelles)
import { 
  FaUsers, 
  FaChartLine, 
  FaShieldAlt, 
  FaRocket, 
  FaAward, 
  FaGlobe,
  FaCheckCircle,
  FaHandshake,
  FaLightbulb,
  FaCode
} from 'react-icons/fa';

const About = () => {
  const [counters, setCounters] = useState([
    { id: 1, value: 0, target: 1000, label: 'Compétitions organisées', suffix: '+' },
    { id: 2, value: 0, target: 250000, label: 'Participants actifs', suffix: '+' },
    { id: 3, value: 0, target: 98, label: 'Taux de satisfaction', suffix: '%' },
    { id: 4, value: 0, target: 50, label: 'Pays desservis', suffix: '+' }
  ]);

  const [activeAccordion, setActiveAccordion] = useState(null);
  const [teamHover, setTeamHover] = useState(null);

  // Données de l'équipe
  const teamMembers = [
    {
      id: 1,
      name: 'Fiacre DAGBEGNON',
      role: 'CEO & Fondateur',
      image: '/images/team/kevin.jpg',
      bio: '15 ans d\'expérience dans le développement de solutions technologiques innovantes.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      id: 2,
      name: 'Fiacre DAGBEGNON',
      role: 'Directrice Technique',
      image: '/images/team/sophie.jpg',
      bio: 'Expert en architecture cloud et sécurité des systèmes de vote.',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      id: 3,
      name: 'Fiacre DAGBEGNON',
      role: 'Responsable Produit',
      image: '/images/team/thomas.jpg',
      bio: 'Spécialiste en UX/UI et expérience utilisateur pour les plateformes de vote.',
      social: {
        linkedin: '#',
        instagram: '#'
      }
    },
    {
      id: 4,
      name: 'Fiacre DAGBEGNON',
      role: 'Chef de Projet',
      image: '/images/team/lea.jpg',
      bio: 'Gestionnaire de projets IT avec expertise en méthodologies agiles.',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    }
  ];

  // Valeurs de l'entreprise
  const values = [
    {
      icon: <FaShieldAlt />,
      title: 'Sécurité & Confidentialité',
      description: 'Nous garantissons l\'intégrité totale des votes avec un chiffrement de bout en bout.',
      color: 'primary'
    },
    {
      icon: <FaChartLine />,
      title: 'Innovation Continue',
      description: 'Nous repoussons constamment les limites de la technologie de vote en ligne.',
      color: 'success'
    },
    {
      icon: <FaHandshake />,
      title: 'Transparence',
      description: 'Tous nos processus sont audités et vérifiables par des tiers indépendants.',
      color: 'warning'
    },
    {
      icon: <FaUsers />,
      title: 'Accessibilité',
      description: 'Notre plateforme est conçue pour être utilisée par tous, sans barrières techniques.',
      color: 'info'
    }
  ];

  // Processus
  const processes = [
    {
      step: '01',
      title: 'Analyse des besoins',
      description: 'Compréhension approfondie de vos objectifs et contraintes spécifiques.'
    },
    {
      step: '02',
      title: 'Configuration personnalisée',
      description: 'Adaptation de la plateforme à vos règles et processus de vote.'
    },
    {
      step: '03',
      title: 'Tests de sécurité',
      description: 'Audits complets et tests de pénétration par des experts en cybersécurité.'
    },
    {
      step: '04',
      title: 'Déploiement & Support',
      description: 'Mise en production avec accompagnement et support 24/7.'
    }
  ];

  // FAQ
  const faqs = [
    {
      id: 1,
      question: 'Comment Klumer garantit-elle la sécurité des votes ?',
      answer: 'Nous utilisons un chiffrement AES-256 de bout en bout, des signatures numériques, et un système de blockchain privé pour garantir l\'immuabilité et la traçabilité de chaque vote.'
    },
    {
      id: 2,
      question: 'Votre plateforme est-elle conforme au RGPD ?',
      answer: 'Absolument. Klumer est entièrement conforme au RGPD et aux réglementations internationales en matière de protection des données.'
    },
    {
      id: 3,
      question: 'Quel est le temps de mise en place moyen ?',
      answer: 'La configuration standard prend 48 à 72 heures. Pour les projets complexes, notre équipe travaille avec vous pour établir un calendrier personnalisé.'
    },
    {
      id: 4,
      question: 'Offrez-vous des solutions sur mesure ?',
      answer: 'Oui, nous développons des fonctionnalités spécifiques pour répondre aux besoins uniques de chaque organisation.'
    }
  ];

  // Fonction pour animer les compteurs
  useEffect(() => {
    const duration = 2000; // 2 secondes
    const steps = 60;
    const stepDuration = duration / steps;

    counters.forEach((counter, index) => {
      let step = 0;
      const increment = counter.target / steps;
      const timer = setInterval(() => {
        step++;
        setCounters(prev => prev.map((c, i) => 
          i === index ? { ...c, value: Math.min(c.value + increment, c.target) } : c
        ));
        
        if (step >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);
    });

    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div className="template-color-1">
      <Header />
      
      {/* Hero Section */}
      <section className="rn-breadcrumb-inner ptb--150 bg-gradient-primary">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 col-md-8 col-12">
              <div className="breadcrumb-inner">
                <h1 className="title display-3 fw-bold text-white">
                  Redéfinir l'avenir du <span className="text-danger">vote en ligne</span>
                </h1>
                <p className="description text-light fs-5 mb-4">
                  Klumer est la plateforme de vote numérique la plus avancée, combinant sécurité militaire, 
                  expérience utilisateur exceptionnelle et innovation technologique.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link to="/contact" className="btn btn-outline-light btn-lg px-4">
                    <FaHandshake className="me-2" />
                    Demander une démo
                  </Link>
                  <Link to="/solutions" className="btn btn-outline-light btn-lg px-4">
                    Découvrir nos solutions
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-12">
              <div className="thumbnail">
                <img 
                  src="/images/about-hero.svg" 
                  alt="Vote numérique sécurisé" 
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="rn-section-gapTop pb--120">
        <div className="container">
          <div className="row g-4">
            {counters.map((counter) => (
              <div key={counter.id} className="col-lg-3 col-md-6">
                <div className="counter-card text-center p-4 rounded-4 shadow-sm h-100 border">
                  <div className="counter-number mb-3">
                    <h2 className="text-primary display-4 fw-bold">
                      {Math.floor(counter.value)}
                      {counter.suffix}
                    </h2>
                  </div>
                  <h5 className="mb-0">{counter.label}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Mission */}
      <section >
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="section-title mb-4">
                <span className="subtitle text-primary fw-bold">NOTRE MISSION</span>
                <h2 className="title display-5 fw-bold">
                  Révolutionner la démocratie numérique
                </h2>
                <p className="description fs-5 text-muted">
                  Chez Klumer, nous croyons que chaque voix mérite d'être entendue en toute sécurité 
                  et transparence. Nous construisons l'infrastructure de vote de demain, aujourd'hui.
                </p>
              </div>
              
              <div className="mission-points">
                {[
                  "Système de vote infalsifiable",
                  "Interface intuitive accessible à tous",
                  "Conformité réglementaire totale",
                  "Support technique 24h/24 et 7j/7",
                  "Rapports d'audit en temps réel",
                  "Intégration API complète"
                ].map((point, index) => (
                  <div key={index} className="d-flex align-items-center mb-3">
                    <FaCheckCircle className="text-success me-3" size={20} />
                    <span className="fs-5">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="video-promo position-relative rounded-4 overflow-hidden shadow-lg">
                <img 
                  src="/images/mission-dashboard.jpg" 
                  alt="Tableau de bord Klumer" 
                  className="img-fluid rounded-4"
                />
                <div className="video-play-btn position-absolute top-50 start-50 translate-middle">
                  <button className="btn btn-primary btn-lg rounded-circle p-3">
                    <i className="feather-play" style={{ fontSize: '2rem' }}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="rn-section-gap">
        <div className="container">
          <div className="section-title text-center mb-5">
            <span className="subtitle text-primary fw-bold">NOS VALEURS</span>
            <h2 className="title display-5 fw-bold">
              Ce qui nous guide au quotidien
            </h2>
            <p className="description text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Les principes fondamentaux qui définissent notre culture d'entreprise et notre approche
            </p>
          </div>
          
          <div className="row g-4">
            {values.map((value, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className={`value-card text-center p-4 rounded-4 border border-${value.color} border-2 h-100`}>
                  <div className={`value-icon mb-4 text-${value.color}`} style={{ fontSize: '3rem' }}>
                    {value.icon}
                  </div>
                  <h4 className="mb-3">{value.title}</h4>
                  <p className="text-muted mb-0">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Processus */}
      <section className="rn-section-gap bg-gradient-dark text-white">
        <div className="container">
          <div className="section-title text-center mb-5">
            <span className="subtitle text-primary fw-bold">NOTRE PROCESSUS</span>
            <h2 className="title display-5 fw-bold">
              Comment nous travaillons
            </h2>
          </div>
          
          <div className="row g-5 position-relative">
            {/* Ligne de connexion */}
            <div className="process-line position-absolute top-50 start-0 end-0 d-none d-lg-block"></div>
            
            {processes.map((process, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="process-step text-center position-relative">
                  <div className="step-number bg-danger text-dark rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                       style={{ width: '80px', height: '80px', fontSize: '2rem', fontWeight: 'bold' }}>
                    {process.step}
                  </div>
                  <h4 className="mb-3">{process.title}</h4>
                  <p className="text-light opacity-75">{process.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Équipe */}
      <section className="rn-section-gap">
        <div className="container">
          <div className="section-title text-center mb-5">
            <span className="subtitle text-primary fw-bold">NOTRE ÉQUIPE</span>
            <h2 className="title display-5 fw-bold">
              Rencontrez les experts
            </h2>
            <p className="description text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Une équipe passionnée d'experts en technologie, sécurité et expérience utilisateur
            </p>
          </div>
          
          <div className="row g-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="col-lg-3 col-md-6">
                <div 
                  className="team-card text-center rounded-4 overflow-hidden shadow-sm h-100 border"
                  onMouseEnter={() => setTeamHover(member.id)}
                  onMouseLeave={() => setTeamHover(null)}
                >
                  <div className="team-image position-relative overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="img-fluid w-100"
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <div className={`team-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center ${teamHover === member.id ? 'opacity-100' : 'opacity-0'}`}
                         style={{ background: '#065b83', transition: 'all 0.3s ease' }}>
                      <div className="social-links">
                        {Object.entries(member.social).map(([platform, url]) => (
                          <a 
                            key={platform}
                            href={url}
                            className="btn btn-light btn-sm rounded-circle mx-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className={`feather-${platform}`}></i>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="team-info p-4">
                    <h5 className="mb-1">{member.name}</h5>
                    <p className="text-primary mb-3">{member.role}</p>
                    <p className="text-muted small">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section >
        <div className="container">
          <div className="section-title text-center mb-5">
            <span className="subtitle text-primary fw-bold">FAQ</span>
            <h2 className="title display-5 fw-bold">
              Questions fréquentes
            </h2>
          </div>
          
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="accordion" id="faqAccordion">
                {faqs.map((faq, index) => (
                  <div key={faq.id} className="accordion-item border-0 mb-3">
                    <h2 className="accordion-header">
                      <button 
                        className={`accordion-button ${activeAccordion === faq.id ? '' : 'collapsed'} fs-5 fw-bold`}
                        type="button"
                        onClick={() => setActiveAccordion(activeAccordion === faq.id ? null : faq.id)}
                      >
                        {faq.question}
                      </button>
                    </h2>
                    <div className={`accordion-collapse collapse ${activeAccordion === faq.id ? 'show' : ''}`}>
                      <div className="accordion-body fs-5">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="rn-section-gap bg-gradient-primary text-white">
        <div className="container">
          <div className="row align-items-center text-center text-lg-start">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-3">
                Prêt à révolutionner votre processus de vote ?
              </h2>
              <p className="fs-5 mb-0">
                Rejoignez les milliers d'organisations qui font confiance à Klumer
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
              <Link to="/contact" className="btn btn-outline-light btn-lg px-5">
                Commencer maintenant
                <i className="feather-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;