

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import { FaFileContract, FaShieldAlt, FaUserCheck, FaLock, FaDatabase, FaGlobe, FaBalanceScale, FaGavel } from 'react-icons/fa';

const OrganizerTerms = () => {
  const [activeSection, setActiveSection] = useState('terms');
  const [lastUpdated, setLastUpdated] = useState('15 janvier 2024');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // Données pour la navigation rapide
  const quickLinks = [
    { id: 'terms', label: 'Conditions d\'Utilisation', icon: <FaFileContract /> },
    { id: 'privacy', label: 'Confidentialité', icon: <FaShieldAlt /> },
    { id: 'data', label: 'Traitement des Données', icon: <FaDatabase /> },
    { id: 'rights', label: 'Droits et Obligations', icon: <FaBalanceScale /> },
    { id: 'compliance', label: 'Conformité RGPD', icon: <FaGavel /> }
  ];

  // Fonction pour faire défiler vers une section
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset pour le header fixe
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Simuler l'acceptation des termes
  const handleAcceptTerms = () => {
    setAcceptedTerms(true);
    localStorage.setItem('organizerTermsAccepted', 'true');
    alert('Conditions acceptées avec succès !');
  };

  // Vérifier si les termes ont déjà été acceptés
  useEffect(() => {
    const accepted = localStorage.getItem('organizerTermsAccepted');
    if (accepted === 'true') {
      setAcceptedTerms(true);
    }
  }, []);

  return (
    <div className="template-color-1">
      <Header />
      
      {/* Hero Section */}
      <section className="rn-breadcrumb-inner ptb--150 bg-gradient-dark text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-10 mx-auto text-center">
              <div className="breadcrumb-inner">
                <h1 className="title display-3 fw-bold mb-4">
                  <FaFileContract className="me-3" />
                  Conditions d'Utilisation & Confidentialité
                  <span className="text-warning d-block mt-2">Pour Organisateurs</span>
                </h1>
                <p className="description fs-5 mb-4 opacity-75">
                  Conditions générales, politique de confidentialité et engagements pour les organisateurs 
                  de compétitions sur la plateforme Klumer.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <span className="badge bg-warning text-dark">
                    <FaUserCheck className="me-2" />
                    Dernière mise à jour: {lastUpdated}
                  </span>
                  <span className="badge bg-primary">
                    Version 1.1
                  </span>
                  <span className="badge bg-success">
                    Conforme RGPD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation rapide */}
      <section  style={{ top: '80px', zIndex: 999 }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="quick-nav d-flex flex-wrap justify-content-center gap-2">
                {quickLinks.map((link) => (
                  <button
                    key={link.id}
                    className={`btn ${activeSection === link.id ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center`}
                    onClick={() => scrollToSection(link.id)}
                  >
                    {link.icon}
                    <span className="ms-2 d-none d-md-inline">{link.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="rn-section-gap">
        <div className="container">
          <div className="row">
            {/* Sidebar de navigation */}
            <div className="col-lg-3 d-none d-lg-block">
              <div className="legal-sidebar sticky-top" style={{ top: '180px' }}>
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Navigation</h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="list-group list-group-flush">
                      {quickLinks.map((link) => (
                        <button
                          key={link.id}
                          className={`list-group-item list-group-item-action border-0 ${activeSection === link.id ? 'active' : ''}`}
                          onClick={() => scrollToSection(link.id)}
                        >
                          <div className="d-flex align-items-center">
                            {link.icon}
                            <span className="ms-3">{link.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="card-footer bg-light">
                    <div className="d-grid">
                      <button 
                        className={`btn ${acceptedTerms ? 'btn-success' : 'btn-primary'}`}
                        onClick={handleAcceptTerms}
                        disabled={acceptedTerms}
                      >
                        {acceptedTerms ? (
                          <>
                            <FaUserCheck className="me-2" />
                            Conditions acceptées
                          </>
                        ) : (
                          'Accepter les conditions'
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Aide et Support */}
                <div >
                  <div className="card-body">
                    <h6 className="mb-3">Besoin d'aide ?</h6>
                    <div className="d-grid gap-2">
                      <Link to="/contact" className="btn btn-outline-primary">
                        Contact Support
                      </Link>
                      <a 
                        href="/documents/conditions-organisateurs.pdf" 
                        className="btn btn-outline-secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Télécharger PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu des conditions */}
            <div className="col-lg-9">
              {/* Conditions d'Utilisation */}
              <div id="terms" className="legal-section mb-5">
                <div className="section-header d-flex align-items-center mb-4">
                  <div className="icon-wrapper bg-primary text-white rounded-circle p-3 me-3">
                    <FaFileContract size={24} />
                  </div>
                  <div>
                    <h2 className="display-5 fw-bold">Conditions d'Utilisation</h2>
                    <p className="text-muted">Pour les organisateurs de compétitions sur Klumer</p>
                  </div>
                </div>

                <div >
                  <div className="card-body">
                    <h4 className="text-primary mb-4">1. Acceptation des Conditions</h4>
                    <p className="mb-4">
                      En créant un compte organisateur sur Klumer, vous acceptez sans réserve les présentes 
                      conditions d'utilisation. Ces conditions régissent votre utilisation de la plateforme 
                      en tant qu'organisateur de compétitions, élections ou consultations.
                    </p>

                    <h5 className="mt-4 mb-3">1.1 Définitions</h5>
                    <ul className="list-group list-group-flush mb-4">
                      <li >
                        <strong>Organisateur</strong> : Personne morale ou physique créant et gérant une compétition
                      </li>
                      <li >
                        <strong>Compétition</strong> : Tout événement de vote organisé via la plateforme
                      </li>
                      <li >
                        <strong>Participants</strong> : Personnes prenant part à une compétition
                      </li>
                      <li >
                        <strong>Données</strong> : Informations collectées lors d'une compétition
                      </li>
                    </ul>

                    <h4 className="text-primary mt-5 mb-4">2. Compte Organisateur</h4>
                    <div >
                      <h6><FaLock className="me-2" /> Sécurité du Compte</h6>
                      <p className="mb-0">
                        Vous êtes responsable de la sécurité de votre compte et de toutes les activités 
                        qui y sont menées. Notifiez-nous immédiatement toute utilisation non autorisée.
                      </p>
                    </div>

                    <h5 className="mt-4 mb-3">2.1 Création du Compte</h5>
                    <p>
                      Pour créer un compte organisateur, vous devez :
                    </p>
                    <ul>
                      <li>Fournir des informations exactes et complètes</li>
                      <li>Être majeur selon la législation de votre pays</li>
                      <li>Disposer de l'autorité légale pour organiser des compétitions</li>
                      <li>Accepter expressément ces conditions</li>
                    </ul>

                    <h5 className="mt-4 mb-3">2.2 Suspension et Résiliation</h5>
                    <p>
                      Nous nous réservons le droit de suspendre ou résilier votre compte en cas de :
                    </p>
                    <ul>
                      <li>Violation des conditions d'utilisation</li>
                      <li>Activités frauduleuses ou illégales</li>
                      <li>Non-paiement des frais de service</li>
                      <li>Atteinte à la sécurité de la plateforme</li>
                    </ul>

                    <h4 className="text-primary mt-5 mb-4">3. Organisation de Compétitions</h4>
                    <p>
                      En tant qu'organisateur, vous vous engagez à :
                    </p>
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <div >
                          <div className="card-body">
                            <h6 className="text-primary">3.1 Conformité Légale</h6>
                            <p className="mb-0">
                              Respecter toutes les lois applicables, y compris celles relatives aux 
                              élections, à la protection des données et à la concurrence.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div>
                          <div className="card-body">
                            <h6 className="text-success">3.2 Transparence</h6>
                            <p className="mb-0">
                              Informer clairement les participants des règles, dates et conditions 
                              de la compétition.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div >
                          <div className="card-body">
                            <h6 className="text-warning">3.3 Intégrité</h6>
                            <p className="mb-0">
                              Garantir l'équité et l'intégrité du processus de vote, sans manipulation 
                              ni fraude.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div >
                          <div className="card-body">
                            <h6 className="text-info">3.4 Sécurité</h6>
                            <p className="mb-0">
                              Protéger les données des participants et la confidentialité des votes.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h4 className="text-primary mt-5 mb-4">4. Responsabilités</h4>
                    <div className="table-responsive">
                      <table >
                        <thead className="table-primary">
                          <tr>
                            <th>Responsabilité</th>
                            <th>Description</th>
                            <th>Conséquence</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Données Participants</td>
                            <td>Collecte et traitement légaux</td>
                            <td>Conformité RGPD requise</td>
                          </tr>
                          <tr>
                            <td>Sécurité Compte</td>
                            <td>Protection identifiants</td>
                            <td>Suspension en cas de faille</td>
                          </tr>
                          <tr>
                            <td>Contenu</td>
                            <td>Contenu approprié et légal</td>
                            <td>Suppression immédiate</td>
                          </tr>
                          <tr>
                            <td>Paiements</td>
                            <td>Paiement ponctuel des frais</td>
                            <td>Suspension de service</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h4 className="text-primary mt-5 mb-4">5. Propriété Intellectuelle</h4>
                    <p>
                      Klumer conserve tous les droits de propriété intellectuelle sur la plateforme. 
                      En tant qu'organisateur, vous conservez les droits sur le contenu que vous créez, 
                      mais nous accordez une licence pour l'héberger et l'afficher.
                    </p>
                  </div>
                </div>
              </div>

              {/* Politique de Confidentialité */}
              <div id="privacy" className="legal-section mb-5">
                <div className="section-header d-flex align-items-center mb-4">
                  <div className="icon-wrapper bg-success text-white rounded-circle p-3 me-3">
                    <FaShieldAlt size={24} />
                  </div>
                  <div>
                    <h2 className="display-5 fw-bold">Politique de Confidentialité</h2>
                    <p className="text-muted">Protection des données pour organisateurs</p>
                  </div>
                </div>

                <div >
                  <div className="card-body">
                    <div>
                      <h5><FaShieldAlt className="me-2" /> Notre Engagement</h5>
                      <p className="mb-0">
                        Klumer s'engage à protéger la vie privée des organisateurs et des participants. 
                        Cette politique explique comment nous collectons, utilisons et protégeons vos données.
                      </p>
                    </div>

                    <h4 className="text-success mt-5 mb-4">1. Données Collectées</h4>
                    <div className="row g-4 mb-4">
                      <div className="col-md-4">
                        <div className="text-center p-3 border rounded-3">
                          <FaUserCheck className="text-primary mb-3" size={32} />
                          <h6>Informations Compte</h6>
                          <p className="small mb-0">Nom, email, téléphone, organisation</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="text-center p-3 border rounded-3">
                          <FaDatabase className="text-warning mb-3" size={32} />
                          <h6>Données Compétitions</h6>
                          <p className="small mb-0">Candidats, résultats, paramètres</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="text-center p-3 border rounded-3">
                          <FaLock className="text-danger mb-3" size={32} />
                          <h6>Données Techniques</h6>
                          <p className="small mb-0">IP, logs, cookies, métriques</p>
                        </div>
                      </div>
                    </div>

                    <h5 className="mt-4 mb-3">1.1 Finalités du Traitement</h5>
                    <ul>
                      <li>Fourniture et amélioration des services</li>
                      <li>Communication concernant votre compte</li>
                      <li>Prévention de la fraude et sécurité</li>
                      <li>Conformité légale et réglementaire</li>
                      <li>Analyses et statistiques agrégées</li>
                    </ul>

                    <h4 className="text-success mt-5 mb-4">2. Protection des Données</h4>
                    <div className="row g-3">
                      <div className="col-lg-6">
                        <div >
                          <div className="card-body">
                            <h6 className="text-success">2.1 Mesures Techniques</h6>
                            <ul className="mb-0">
                              <li>Chiffrement AES-256</li>
                              <li>Firewalls et systèmes de détection</li>
                              <li>Sauvegardes régulières</li>
                              <li>Accès sécurisé HTTPS</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div >
                          <div className="card-body">
                            <h6 className="text-primary">2.2 Mesures Organisationnelles</h6>
                            <ul className="mb-0">
                              <li>Accès limité au personnel autorisé</li>
                              <li>Formation sécurité obligatoire</li>
                              <li>Audits réguliers de sécurité</li>
                              <li>Politique de confidentialité interne</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h4 className="text-success mt-5 mb-4">3. Partenaires et Sous-traitants</h4>
                    <p>
                      Nous pouvons partager vos données avec des sous-traitants pour :
                    </p>
                    <div className="table-responsive">
                      <table >
                        <thead>
                          <tr>
                            <th>Sous-traitant</th>
                            <th>Service</th>
                            <th>Protection</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Fournisseur Hébergement</td>
                            <td>Stockage des données</td>
                            <td>Certification ISO 27001</td>
                          </tr>
                          <tr>
                            <td>Service de Paiement</td>
                            <td>Traitement transactions</td>
                            <td>PCI DSS Level 1</td>
                          </tr>
                          <tr>
                            <td>Service d'Email</td>
                            <td>Communications</td>
                            <td>Chiffrement bout-en-bout</td>
                          </tr>
                          <tr>
                            <td>Service d'Analyse</td>
                            <td>Statistiques agrégées</td>
                            <td>Données anonymisées</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Traitement des Données */}
              <div id="data" className="legal-section mb-5">
                <div className="section-header d-flex align-items-center mb-4">
                  <div className="icon-wrapper bg-warning text-white rounded-circle p-3 me-3">
                    <FaDatabase size={24} />
                  </div>
                  <div>
                    <h2 className="display-5 fw-bold">Traitement des Données</h2>
                    <p className="text-muted">Règles spécifiques pour les données de compétitions</p>
                  </div>
                </div>

                <div>
                  <div className="card-body">
                    <h4 className="text-warning mb-4">1. Données des Participants</h4>
                    <div>
                      <h6>⚠️ Responsabilité Partagée</h6>
                      <p className="mb-0">
                        En tant qu'organisateur, vous êtes responsable du traitement des données 
                        des participants. Klumer agit en tant que sous-traitant.
                      </p>
                    </div>

                    <h5 className="mt-4 mb-3">1.1 Base Légale du Traitement</h5>
                    <div className="row g-3 mb-4">
                      <div className="col-md-4">
                        <div >
                          <div className="card-body text-center">
                            <div className="badge bg-primary rounded-circle p-3 mb-3">1</div>
                            <h6>Consentement</h6>
                            <p className="small mb-0">
                              Consentement explicite des participants
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div >
                          <div className="card-body text-center">
                            <div className="badge bg-success rounded-circle p-3 mb-3">2</div>
                            <h6>Exécution Contrat</h6>
                            <p className="small mb-0">
                              Nécessaire pour participer à la compétition
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div >
                          <div className="card-body text-center">
                            <div className="badge bg-info rounded-circle p-3 mb-3">3</div>
                            <h6>Intérêt Légitime</h6>
                            <p className="small mb-0">
                              Pour des finalités légitimes d'organisation
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h5 className="mt-4 mb-3">1.2 Types de Données Collectées</h5>
                    <div className="accordion mb-4" id="dataTypesAccordion">
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#personalData">
                            Données Personnelles
                          </button>
                        </h2>
                        <div id="personalData" className="accordion-collapse collapse show">
                          <div className="accordion-body">
                            <ul>
                              <li>Nom et prénom</li>
                              <li>Adresse email</li>
                              <li>Numéro de téléphone (optionnel)</li>
                              <li>Informations de profil</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#voteData">
                            Données de Vote
                          </button>
                        </h2>
                        <div id="voteData" className="accordion-collapse collapse">
                          <div className="accordion-body">
                            <ul>
                              <li>Choix de vote (anonymisé)</li>
                              <li>Horodatage du vote</li>
                              <li>Localisation générale (région)</li>
                              <li>Informations techniques de connexion</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h4 className="text-warning mt-5 mb-4">2. Conservation des Données</h4>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="table-warning">
                          <tr>
                            <th>Type de Données</th>
                            <th>Durée de Conservation</th>
                            <th>Finalité</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Données de Compte</td>
                            <td>5 ans après dernière activité</td>
                            <td>Gestion compte et historique</td>
                          </tr>
                          <tr>
                            <td>Données Compétitions</td>
                            <td>3 ans après clôture</td>
                            <td>Preuve et vérification</td>
                          </tr>
                          <tr>
                            <td>Données Participants</td>
                            <td>1 an après compétition</td>
                            <td>Support et réclamations</td>
                          </tr>
                          <tr>
                            <td>Données Techniques</td>
                            <td>6 mois</td>
                            <td>Sécurité et maintenance</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Droits et Obligations */}
              <div id="rights" className="legal-section mb-5">
                <div className="section-header d-flex align-items-center mb-4">
                  <div className="icon-wrapper bg-info text-white rounded-circle p-3 me-3">
                    <FaBalanceScale size={24} />
                  </div>
                  <div>
                    <h2 className="display-5 fw-bold">Droits et Obligations</h2>
                    <p className="text-muted">Droits des organisateurs et obligations respectives</p>
                  </div>
                </div>

                <div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="rights-card border-success border-2 rounded-3 p-4 mb-4">
                          <h4 className="text-success mb-4">✅ Vos Droits</h4>
                          <ul className="list-unstyled">
                            <li className="mb-3">
                              <strong>Accès</strong>
                              <p className="mb-0 small">Accéder à vos données personnelles</p>
                            </li>
                            <li className="mb-3">
                              <strong>Rectification</strong>
                              <p className="mb-0 small">Corriger des données inexactes</p>
                            </li>
                            <li className="mb-3">
                              <strong>Effacement</strong>
                              <p className="mb-0 small">Supprimer vos données ("droit à l'oubli")</p>
                            </li>
                            <li className="mb-3">
                              <strong>Portabilité</strong>
                              <p className="mb-0 small">Obtenir vos données dans un format structuré</p>
                            </li>
                            <li>
                              <strong>Opposition</strong>
                              <p className="mb-0 small">Vous opposer à certains traitements</p>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="obligations-card border-primary border-2 rounded-3 p-4 mb-4">
                          <h4 className="text-primary mb-4">📋 Vos Obligations</h4>
                          <ul className="list-unstyled">
                            <li className="mb-3">
                              <strong>Transparence</strong>
                              <p className="mb-0 small">Informer les participants du traitement</p>
                            </li>
                            <li className="mb-3">
                              <strong>Consentement</strong>
                              <p className="mb-0 small">Obtenir un consentement valide</p>
                            </li>
                            <li className="mb-3">
                              <strong>Sécurité</strong>
                              <p className="mb-0 small">Protéger les données des participants</p>
                            </li>
                            <li className="mb-3">
                              <strong>Notification</strong>
                              <p className="mb-0 small">Signaler les violations de données</p>
                            </li>
                            <li>
                              <strong>Conformité</strong>
                              <p className="mb-0 small">Respecter toutes les lois applicables</p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <h4 className="text-info mt-5 mb-4">Exercice de Vos Droits</h4>
                    <p>
                      Pour exercer vos droits ou pour toute question concernant vos données :
                    </p>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div >
                          <div className="card-body">
                            <h6>📧 Par Email</h6>
                            <p className="mb-0">
                              <a href="mailto:privacy@klumer.com" className="text-decoration-none">
                                privacy@klumer.com
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div >
                          <div className="card-body">
                            <h6>📄 Formulaire en Ligne</h6>
                            <p className="mb-0">
                              <Link to="/privacy-request" className="text-decoration-none">
                                Formulaire de demande
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div >
                      <h6>⏱️ Délais de Réponse</h6>
                      <p className="mb-0">
                        Nous nous engageons à répondre à toute demande dans un délai maximum de 30 jours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conformité RGPD */}
              <div id="compliance" className="legal-section">
                <div className="section-header d-flex align-items-center mb-4">
                  <div className="icon-wrapper bg-danger text-white rounded-circle p-3 me-3">
                    <FaGavel size={24} />
                  </div>
                  <div>
                    <h2 className="display-5 fw-bold">Conformité RGPD</h2>
                    <p className="text-muted">Cadre réglementaire et engagements</p>
                  </div>
                </div>

                <div>
                  <div className="card-body">
                    <div className="alert alert-danger">
                      <h5>🔒 Engagement RGPD</h5>
                      <p className="mb-0">
                        Klumer est pleinement conforme au Règlement Général sur la Protection des Données (RGPD) 
                        et s'engage à respecter les principes de protection des données dès la conception.
                      </p>
                    </div>

                    <h4 className="text-danger mt-5 mb-4">1. Principes Fondamentaux</h4>
                    <div className="row g-3 mb-4">
                      {[
                        { title: 'Licéité', desc: 'Traitement fondé sur une base légale' },
                        { title: 'Loyauté', desc: 'Transparence envers les personnes concernées' },
                        { title: 'Minimisation', desc: 'Collecte uniquement des données nécessaires' },
                        { title: 'Exactitude', desc: 'Données exactes et mises à jour' },
                        { title: 'Limitation', desc: 'Conservation limitée dans le temps' },
                        { title: 'Intégrité', desc: 'Confidentialité et sécurité garanties' }
                      ].map((principle, index) => (
                        <div key={index} className="col-md-6 col-lg-4">
                          <div className="border rounded-3 p-3 h-100">
                            <div className="d-flex align-items-center mb-2">
                              <div className="badge bg-danger rounded-circle p-2 me-2">
                                {index + 1}
                              </div>
                              <h6 className="mb-0">{principle.title}</h6>
                            </div>
                            <p className="small mb-0">{principle.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h4 className="text-danger mt-5 mb-4">2. Documentation Obligatoire</h4>
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Document</th>
                            <th>Description</th>
                            <th>Disponible</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Registre des Traitements</td>
                            <td>Inventaire des activités de traitement</td>
                            <td className="text-success"> Oui</td>
                          </tr>
                          <tr>
                            <td>Analyse d'Impact</td>
                            <td>Évaluation des risques pour les droits</td>
                            <td className="text-success"> Oui</td>
                          </tr>
                            <tr>
                            <td>Accords Sous-traitants</td>
                            <td>Contrats avec tous les sous-traitants</td>
                            <td className="text-success"> Oui</td>
                          </tr>
                          <tr>
                            <td>Politique de Sécurité</td>
                            <td>Mesures techniques et organisationnelles</td>
                            <td className="text-success"> Oui</td>
                          </tr>
                          <tr>
                            <td>Procédures de Violation</td>
                            <td>Gestion des violations de données</td>
                            <td className="text-success"> Oui</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h4 className="text-danger mt-5 mb-4">3. Violation de Données</h4>
                    <div className="row g-4">
                      <div className="col-lg-6">
                        <div >
                          <div className="card-body">
                            <h6 className="text-danger">3.1 Notification</h6>
                            <p>
                              En cas de violation de données personnelles, nous notifierons :
                            </p>
                            <ul>
                              <li>L'autorité de protection dans les 72 heures</li>
                              <li>Les personnes concernées si risque élevé</li>
                              <li>Les organisateurs concernés immédiatement</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div >
                          <div className="card-body">
                            <h6 className="text-warning">3.2 Responsabilité</h6>
                            <p>
                              En tant qu'organisateur, vous devez :
                            </p>
                            <ul>
                              <li>Signaler immédiatement toute violation suspectée</li>
                              <li>Coopérer avec nos investigations</li>
                              <li>Mettre en œuvre les mesures correctives recommandées</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h6> Certifications</h6>
                      <div className="d-flex flex-wrap gap-3 mt-2">
                        <span className="badge bg-primary">ISO 27001</span>
                        <span className="badge bg-success">GDPR Compliant</span>
                        <span className="badge bg-warning text-dark">Privacy Shield</span>
                        <span className="badge bg-info">SOC 2 Type II</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton d'acceptation */}
              <div className="text-center mt-5 pt-4 border-top">
                <div className="d-flex flex-column align-items-center">
                  <div className="mb-4">
                    <h4 className="mb-3">Acceptation des Conditions</h4>
                    <p className="text-muted">
                      En acceptant ces conditions, vous confirmez avoir lu, compris 
                      et accepté l'intégralité des termes ci-dessus.
                    </p>
                  </div>
                  
                  <div className="d-flex flex-wrap justify-content-center gap-3">
                    <button 
                      className={`btn ${acceptedTerms ? 'btn-success' : 'btn-primary btn-lg'} px-5`}
                      onClick={handleAcceptTerms}
                      disabled={acceptedTerms}
                    >
                      {acceptedTerms ? (
                        <>
                          <FaUserCheck className="me-2" />
                          Conditions déjà acceptées
                        </>
                      ) : (
                        'Accepter toutes les conditions'
                      )}
                    </button>
                    
                    <Link to="/contact" className="btn btn-outline-primary btn-lg px-5">
                      Questions ?
                    </Link>
                  </div>
                  
                  <div className="mt-4">
                    <small className="text-muted">
                      En cliquant sur "Accepter", vous reconnaissez être l'organisateur autorisé 
                      et acceptez les conditions au nom de votre organisation.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section de contact */}
      <section >
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <div >
                <div className="card-body p-5">
                  <h3 className="mb-4">Besoin d'aide avec la conformité ?</h3>
                  <p className="text-muted mb-4">
                    Notre équipe dédiée à la protection des données est à votre disposition 
                    pour vous aider à comprendre et mettre en œuvre ces exigences.
                  </p>
                  <div className="d-flex flex-wrap justify-content-center gap-3">
                    <Link to="/contact" className="btn btn-primary px-4">
                      Contactez notre DPO
                    </Link>
                    <a 
                      href="/documents/kit-conformite-organisateurs.pdf"
                      className="btn btn-outline-primary px-4"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Télécharger le kit conformité
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrganizerTerms;