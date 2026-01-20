import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import CircularGallery from './CircularGallery';


const HeroSection = () => {
  const { user, isUser, loading } = useAuthContext();

  // Déterminer si le bouton doit être affiché
  const shouldShowCreateEventButton = () => {
    if (loading) return true; // Pendant le chargement
    if (!user) return true;   // Non connecté
    if (isUser) return false; // Connecté en tant que user
    return true;              // Autres rôles
  };

  const showButton = shouldShowCreateEventButton();

  return (
    <div className="slider-style-5 rn-section-gapTop">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6 order-2 order-lg-1 mt_md--30 mt_sm--30">
            <div className="banner-left-content">
              <span className="title-badge"> Klumer, Service de vote en ligne</span>
              
              {/* Affichage du rôle de l'utilisateur */}
              {!loading && user && (
                <div className="user-role-badge mb-2">
                  <span className={`badge ${
                    isUser ? 'bg-secondary' : 
                    user.role === 'agency' ? 'bg-primary' : 
                    user.role === 'organizer' ? 'bg-warning text-dark' : 
                    'bg-danger'
                  }`}>
                    {isUser ? 'Électeur' : 
                     user.role === 'agency' ? 'Agence' : 
                     user.role === 'organizer' ? 'Organisateur' : 
                     'Administrateur'}
                  </span>
                </div>
              )}
              
              <h2 className="title">
           Simplifiez vos votes  <br />
          en ligne en un clic !
              </h2>
              <p className="banner-disc-one">
                Bienvenue sur la plateforme Klumer, votre solution de vote en ligne sécurisée et efficace. Notre plateforme vous permet de suivre en temps réel l'évolution des votes, offrant ainsi une transparence totale et une interaction  permanente à vos événements.
              </p>
              
              <div className="button-group">
                {showButton ? (
                  <a className="btn btn-large btn-primary" href="/create-event">
                    Créer un Événement
                  </a>
                ) : (
                  <button 
                    className="btn btn-large btn-secondary" 
                    disabled
                    title="Réservé aux organisateurs"
                  >
                    <i className="feather-lock me-2"></i>
                    Créer un Événement
                  </button>
                )}
                
                <a className="btn btn-large btn-primary-alta" href="/competitions">
                  Voir les Événements
                </a>
              </div>
              
              {/* Message contextuel */}
              {!loading && user && isUser && (
                <div className="mt-3">
                  <div>
                    <small>
                      <i className="feather-info text-primary me-1"></i>
                      Pour créer des événements, 
                      <a href="/register-organizer" className="ms-1 fw-bold">devenez organisateur</a>
                    </small>
                  </div>
                </div>
              )}
              
            </div>
            
          </div>

           <div className="col-lg-6 order-1 order-lg-2">
           <div style={{ height: '300px', position: 'relative' }}>
  <CircularGallery  bend={3} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02}/>
</div>
          </div> 
        </div>
        
      </div>
    </div>
  );
};

export default HeroSection;