// Dans src/components/Header/Header.jsx
import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsAuthenticated(true);
      // Ici vous récupérerez les infos utilisateur depuis votre API
      setUser({
        name: 'Utilisateur Klumer',
        type: 'agency'
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="rn-header haeder-default header--sticky">
      <div className="container">
        <div className="header-inner">
          <div className="header-left">
            <div className="logo-thumbnail logo-custom-css">
              <a className="logo-light" href="/">
                <img src="/assets/images/logo/logo-white.png" alt="Klumer Vote" />
              </a>
              <a className="logo-dark" href="/">
                <img src="/assets/images/logo/logo-dark.png" alt="Klumer Vote" />
              </a>
            </div>
            <div className="mainmenu-wrapper">
              <nav id="sideNav" className="mainmenu-nav d-none d-xl-block">
                <ul className="mainmenu">
                  <li><a href="/">Accueil</a></li>
                  <li><a href="/events">Événements</a></li>
                  <li><a href="/results">Résultats</a></li>
                  <li><a href="/about">À propos</a></li>
                  <li><a href="/contact">Contact</a></li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="header-right">
            {/* Barre de recherche */}
            <div className="setting-option d-none d-lg-block">
              <form className="search-form-wrapper" action="#">
                <input type="search" placeholder="Rechercher un événement..." aria-label="Search" />
                <div className="search-icon">
                  <button><i className="feather-search"></i></button>
                </div>
              </form>
            </div>

            {/* Bouton Créer Événement - visible seulement si authentifié */}
            {isAuthenticated && (
              <div className="setting-option header-btn rbt-site-header">
                <div className="icon-box">
                  <a className="btn btn-primary-alta btn-small" href="/create-event">
                    Créer un Événement
                  </a>
                </div>
              </div>
            )}

            {/* Notifications */}
            {isAuthenticated && (
              <div className="setting-option rn-icon-list notification-badge">
                <div className="icon-box">
                  <a href="/notifications">
                    <i className="feather-bell"></i>
                    <span className="badge">3</span>
                  </a>
                </div>
              </div>
            )}

            {/* Profil utilisateur ou boutons de connexion */}
            {isAuthenticated ? (
              <div className="header_admin" id="header_admin">
                <div className="setting-option rn-icon-list user-account">
                  <div className="icon-box">
                    <a href="/profile">
                      <img src="/assets/images/icons/boy-avater.png" alt="Mon profil" />
                    </a>
                    <div className="rn-dropdown">
                      <div className="rn-inner-top">
                        <h4 className="title">{user?.name}</h4>
                        <span>{user?.type === 'agency' ? 'Agence' : 'Électeur'}</span>
                      </div>
                      <ul className="list-inner">
                        <li><a href="/profile">Mon Profil</a></li>
                        {user?.type === 'agency' && <li><a href="/agency">Mon Agence</a></li>}
                        <li><a href="/my-events">Mes Événements</a></li>
                        <li><a href="/my-votes">Mes Votes</a></li>
                        <li><a href="/settings">Paramètres</a></li>
                        <li><a href="#" onClick={handleLogout}>Déconnexion</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="setting-option header-btn">
                <div className="icon-box">
                  <a className="btn btn-primary btn-small" href="/login">
                    Se connecter
                  </a>
                </div>
              </div>
            )}

            {/* Menu mobile */}
            <div className="setting-option mobile-menu-bar d-block d-xl-none">
              <div className="hamberger">
                <button 
                  className="hamberger-button"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <i className="feather-menu"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="popup-mobile-menu">
          <div className="inner">
            <div className="header-top">
              <div className="logo logo-custom-css">
                <a className="logo-light" href="/">
                  <img src="/assets/images/logo/logo-white.png" alt="Klumer" />
                </a>
              </div>
              <div className="close-menu">
                <button 
                  className="close-button"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="feather-x"></i>
                </button>
              </div>
            </div>
            <nav>
              <ul className="mainmenu">
                <li><a href="/" onClick={() => setIsMobileMenuOpen(false)}>Accueil</a></li>
                <li><a href="/events" onClick={() => setIsMobileMenuOpen(false)}>Événements</a></li>
                <li><a href="/results" onClick={() => setIsMobileMenuOpen(false)}>Résultats</a></li>
                <li><a href="/about" onClick={() => setIsMobileMenuOpen(false)}>À propos</a></li>
                <li><a href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a></li>
                {isAuthenticated ? (
                  <>
                    <li><a href="/create-event" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary">Créer Événement</a></li>
                    <li><a href="/profile" onClick={() => setIsMobileMenuOpen(false)}>Mon Profil</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); setIsMobileMenuOpen(false); }}>Déconnexion</a></li>
                  </>
                ) : (
                  <li><a href="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary">Se connecter</a></li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;