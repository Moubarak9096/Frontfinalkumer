import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuthStatus();
    
    // Écouter les événements de changement d'authentification
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Fonction pour vérifier le statut d'authentification
  const checkAuthStatus = () => {
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsAuthenticated(true);
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        setUser(userData);
      } catch (error) {
        console.error('Erreur de parsing des données utilisateur:', error);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Fonction pour rediriger vers le dashboard approprié
  const handleUserDashboardRedirect = () => {
    if (isAuthenticated && user) {
      if (user.userType === 'admin' || user.role === 'admin') {
        navigate('/admin');
      } else if (user.userType === 'superadmin' || user.role === 'superadmin') {
        navigate('/superadmin');
      } else if (user.userType === 'agency' || user.userType === 'organizer' || user.role === 'organizer') {
        navigate('/agency');
      } else {
        navigate('/user-profiles');
      }
    } else {
      navigate('/login');
    }
  };

  // Fonction pour obtenir le texte du dashboard
  const getUserDashboardText = () => {
    if (user?.userType === 'admin' || user?.role === 'admin') {
      return 'Admin';
    } else if (user?.userType === 'superadmin' || user?.role === 'superadmin') {
      return 'Super Admin';
    } else if (user?.userType === 'agency' || user?.userType === 'organizer' || user?.role === 'organizer') {
      return 'Organisateur';
    }
    return 'Mon Profil';
  };

  // Fonction pour obtenir l'icône appropriée
  const getUserIconClass = () => {
    if (user?.userType === 'admin' || user?.role === 'admin') {
      return 'feather-shield';
    } else if (user?.userType === 'superadmin' || user?.role === 'superadmin') {
      return 'feather-award';
    } else if (user?.userType === 'agency' || user?.userType === 'organizer' || user?.role === 'organizer') {
      return 'feather-briefcase';
    }
    return 'feather-user';
  };

  // Fonction pour obtenir le lien du dashboard
  const getUserDashboardLink = () => {
    if (user?.userType === 'admin' || user?.role === 'admin') {
      return '/admin';
    } else if (user?.userType === 'superadmin' || user?.role === 'superadmin') {
      return '/superadmin';
    } else if (user?.userType === 'agency' || user?.userType === 'organizer' || user?.role === 'organizer') {
      return '/agency';
    }
    return '/user-profiles';
  };

  // Fonction pour obtenir le badge de rôle
  const getUserRoleBadge = () => {
    if (user?.userType === 'admin' || user?.role === 'admin') {
      return 'Admin';
    } else if (user?.userType === 'superadmin' || user?.role === 'superadmin') {
      return 'Super Admin';
    } else if (user?.userType === 'agency' || user?.userType === 'organizer' || user?.role === 'organizer') {
      return 'Organisateur';
    }
    return 'Électeur';
  };

  // Fonction pour obtenir la couleur du badge
  const getUserRoleBadgeColor = () => {
    if (user?.userType === 'admin' || user?.role === 'admin') {
      return 'bg-warning';
    } else if (user?.userType === 'superadmin' || user?.role === 'superadmin') {
      return 'bg-danger';
    } else if (user?.userType === 'agency' || user?.userType === 'organizer' || user?.role === 'organizer') {
      return 'bg-info';
    }
    return 'bg-primary';
  };

  // Fonction pour vérifier si l'utilisateur peut créer des événements
  const canCreateEvents = () => {
    return user?.userType === 'agency' || 
           user?.userType === 'organizer' || 
           user?.role === 'organizer' ||
           user?.userType === 'admin' ||
           user?.role === 'admin' ||
           user?.userType === 'superadmin' ||
           user?.role === 'superadmin';
  };

  // Fonction pour vérifier si l'utilisateur a accès au panneau d'administration
  const hasAdminAccess = () => {
    return user?.userType === 'admin' || 
           user?.role === 'admin' ||
           user?.userType === 'superadmin' ||
           user?.role === 'superadmin';
  };

  // Fonction de déconnexion avec appel API
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (token) {
        // Appeler l'API de déconnexion
        await fetch('https://api-klumer-node-votings-dev.onrender.com/auth/logout', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le localStorage
      localStorage.removeItem('userToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('agencyData');
      localStorage.removeItem('loginTime');
      
      // Mettre à jour l'état
      setIsAuthenticated(false);
      setUser(null);
      
      // Rediriger vers la page d'accueil
      navigate('/');
      
      // Recharger pour mettre à jour l'état global
      window.location.reload();
    }
  };

  // Fonction de déconnexion pour le menu mobile
  const handleMobileLogout = () => {
    handleLogout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="rn-header haeder-default header--sticky">
      <div className="container">
        <div className="header-inner">
          <div className="header-left">
            <div className="logo-thumbnail logo-custom-css">
              <a className="logo-light" href="/">
                <img src="/assets/images/logo/Klumer_Logo_Orginal.png" alt="Klumer Vote" />
              </a>
              <a className="logo-dark" href="/">
                <img src="/assets/images/logo/Klumer_Logo_Orginal.png" alt="Klumer Vote" />
              </a>
            </div>
            <div className="mainmenu-wrapper">
              <nav id="sideNav" className="mainmenu-nav d-none d-xl-block">
                <ul className="mainmenu">
                  <li><a href="/">Accueil</a></li>
                  <li><a href="/competitions">Événements</a></li>
                  <li><a href="/results">Résultats</a></li>
                  
                  {/* Menu Admin visible seulement pour les admins et super admins */}
                  {hasAdminAccess() && (
                    <li className="has-dropdown">
                      <a href="#">Administration <i className="feather-chevron-down"></i></a>
                      <ul className="submenu">
                        {user?.userType === 'superadmin' || user?.role === 'superadmin' ? (
                          <>
                            <li><a href="/superadmin/dashboard">Dashboard Super Admin</a></li>
                            <li><a href="/superadmin/users">Gestion Utilisateurs</a></li>
                            <li><a href="/superadmin/admins">Gestion Admins</a></li>
                            <li><a href="/superadmin/events">Événements en Attente</a></li>
                            <li><a href="/superadmin/statistics">Statistiques</a></li>
                          </>
                        ) : (
                          <>
                            <li><a href="/admin/dashboard">Dashboard Admin</a></li>
                            <li><a href="/admin/events">Événements en Attente</a></li>
                            <li><a href="/admin/reports">Rapports</a></li>
                          </>
                        )}
                      </ul>
                    </li>
                  )}
                  
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

            {/* Bouton Créer Événement - visible seulement si autorisé */}
            {isAuthenticated && canCreateEvents() && (
              <div className="setting-option header-btn rbt-site-header d-none d-lg-block">
                <div className="icon-box">
                  <a className="btn btn-primary-alta btn-small" href="/create-event">
                    <i className="feather-plus me-1"></i>
                    Créer un Événement
                  </a>
                </div>
              </div>
            )}

            {/* Icône Dashboard Utilisateur */}
            {isAuthenticated && (
              <div className="setting-option rn-icon-list user-dashboard d-none d-lg-block">
                <div className="icon-box">
                  <button 
                    className="btn btn-outline-primary btn-small"
                    onClick={handleUserDashboardRedirect}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      padding: '8px 15px'
                    }}
                    title={getUserDashboardText()}
                  >
                    <i className={`${getUserIconClass()} me-2`}></i>
                    {getUserDashboardText()}
                  </button>
                </div>
              </div>
            )}

            {/* Bouton de déconnexion visible pour desktop */}
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="setting-option rn-icon-list notification-badge d-none d-lg-block">
                  <div className="icon-box">
                    <a href="/notifications">
                      <i className="feather-bell"></i>
                      <span className="badge">3</span>
                    </a>
                  </div>
                </div>
                
                {/* Bouton de déconnexion desktop */}
                <div className="setting-option header-btn d-none d-lg-block">
                  <div className="icon-box">
                    <button 
                      className="btn btn-outline-danger btn-small"
                      onClick={handleLogout}
                      style={{ marginLeft: '10px' }}
                    >
                      <i className="feather-log-out me-1"></i>
                      Déconnexion
                    </button>
                  </div>
                </div>
                
                {/* Profil utilisateur avec menu déroulant */}
                <div className="header_admin" id="header_admin">
                  <div className="setting-option rn-icon-list user-account">
                    <div className="icon-box">
                      <a href={getUserDashboardLink()}>
                        <img src="/assets/images/icons/boy-avater.png" alt="Mon profil" />
                      </a>
                      <div className="rn-dropdown">
                        <div className="rn-inner-top">
                          <h4 className="title">{user?.firstName || user?.name || user?.email || 'Utilisateur'}</h4>
                          <span className={`badge ${getUserRoleBadgeColor()}`}>
                            {getUserRoleBadge()}
                          </span>
                        </div>
                        <ul className="list-inner">
                          <li>
                            <a href={getUserDashboardLink()}>
                              <i className={`${getUserIconClass()} me-2`}></i>
                              {getUserDashboardText()}
                            </a>
                          </li>
                          
                          {/* Options spécifiques aux admins/super admins */}
                          {hasAdminAccess() && (
                            <>
                              {user?.userType === 'superadmin' || user?.role === 'superadmin' ? (
                                <>
                                  <li><a href="/superadmin/users"><i className="feather-users me-2"></i>Gestion Utilisateurs</a></li>
                                  <li><a href="/superadmin/admins"><i className="feather-shield me-2"></i>Gestion Admins</a></li>
                                  <li><a href="/superadmin/events"><i className="feather-clock me-2"></i>Événements en Attente</a></li>
                                </>
                              ) : (
                                <>
                                  <li><a href="/admin/events"><i className="feather-clock me-2"></i>Événements en Attente</a></li>
                                  <li><a href="/admin/reports"><i className="feather-file-text me-2"></i>Rapports</a></li>
                                </>
                              )}
                            </>
                          )}
                          
                          {/* Options pour les organisateurs */}
                          {canCreateEvents() && (
                            <li><a href="/create-event"><i className="feather-plus me-2"></i>Créer Événement</a></li>
                          )}
                          
                          {/* Options communes */}
                          <li><a href="/my-events"><i className="feather-calendar me-2"></i>Mes Événements</a></li>
                          <li><a href="/my-votes"><i className="feather-check-circle me-2"></i>Mes Votes</a></li>
                          <li><a href="/settings"><i className="feather-settings me-2"></i>Paramètres</a></li>
                          <li>
                            <a href="#" onClick={handleLogout}>
                              <i className="feather-log-out me-2"></i>
                              Déconnexion
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="setting-option header-btn">
                <div className="icon-box">
                  <a className="btn btn-tertiary" href="/login">
                    <i className="feather-log-in me-1"></i>
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
                <li><a href="/competitions" onClick={() => setIsMobileMenuOpen(false)}>Événements</a></li>
                <li><a href="/results" onClick={() => setIsMobileMenuOpen(false)}>Résultats</a></li>
                
                {/* Section Admin dans le menu mobile */}
                {hasAdminAccess() && (
                  <li className="has-dropdown">
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      Administration <i className="feather-chevron-down"></i>
                    </a>
                    <ul className="submenu">
                      {user?.userType === 'superadmin' || user?.role === 'superadmin' ? (
                        <>
                          <li><a href="/superadmin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard Super Admin</a></li>
                          <li><a href="/superadmin/users" onClick={() => setIsMobileMenuOpen(false)}>Gestion Utilisateurs</a></li>
                          <li><a href="/superadmin/admins" onClick={() => setIsMobileMenuOpen(false)}>Gestion Admins</a></li>
                          <li><a href="/superadmin/events" onClick={() => setIsMobileMenuOpen(false)}>Événements en Attente</a></li>
                        </>
                      ) : (
                        <>
                          <li><a href="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard Admin</a></li>
                          <li><a href="/admin/events" onClick={() => setIsMobileMenuOpen(false)}>Événements en Attente</a></li>
                          <li><a href="/admin/reports" onClick={() => setIsMobileMenuOpen(false)}>Rapports</a></li>
                        </>
                      )}
                    </ul>
                  </li>
                )}
                
                <li><a href="/about" onClick={() => setIsMobileMenuOpen(false)}>À propos</a></li>
                <li><a href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a></li>
                
                {/* Section utilisateur authentifié dans le menu mobile */}
                {isAuthenticated && (
                  <>
                    <li className="mobile-user-info">
                      <div className="user-avatar">
                        <img src="/assets/images/icons/boy-avater.png" alt="Avatar" />
                      </div>
                      <div className="user-details">
                        <h5>{user?.firstName || user?.name || user?.email || 'Utilisateur'}</h5>
                        <span className={`badge ${getUserRoleBadgeColor()}`}>
                          {getUserRoleBadge()}
                        </span>
                      </div>
                    </li>
                    
                    {/* Bouton Dashboard selon le type d'utilisateur */}
                    <li>
                      <button 
                        className="btn btn-outline-primary w-100 mb-2"
                        onClick={() => {
                          handleUserDashboardRedirect();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <i className={`${getUserIconClass()} me-2`}></i>
                        {getUserDashboardText()}
                      </button>
                    </li>
                    
                    {/* Bouton Créer Événement pour ceux qui ont la permission */}
                    {canCreateEvents() && (
                      <li>
                        <a href="/create-event" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary-alta w-100 mb-2">
                          <i className="feather-plus me-2"></i>
                          Créer un Événement
                        </a>
                      </li>
                    )}
                    
                    {/* Options spécifiques aux admins */}
                    {hasAdminAccess() && (
                      <>
                        {user?.userType === 'superadmin' || user?.role === 'superadmin' ? (
                          <>
                            <li><a href="/superadmin/users" onClick={() => setIsMobileMenuOpen(false)}><i className="feather-users me-2"></i>Gestion Utilisateurs</a></li>
                            <li><a href="/superadmin/admins" onClick={() => setIsMobileMenuOpen(false)}><i className="feather-shield me-2"></i>Gestion Admins</a></li>
                          </>
                        ) : (
                          <>
                            <li><a href="/admin/events" onClick={() => setIsMobileMenuOpen(false)}><i className="feather-clock me-2"></i>Événements en Attente</a></li>
                          </>
                        )}
                      </>
                    )}
                    
                    {/* Options communes */}
                    <li><a href="/my-events" onClick={() => setIsMobileMenuOpen(false)}><i className="feather-calendar me-2"></i>Mes Événements</a></li>
                    <li><a href="/my-votes" onClick={() => setIsMobileMenuOpen(false)}><i className="feather-check-circle me-2"></i>Mes Votes</a></li>
                    <li><a href="/settings" onClick={() => setIsMobileMenuOpen(false)}><i className="feather-settings me-2"></i>Paramètres</a></li>
                    <li>
                      <button 
                        className="btn btn-outline-danger w-100 mt-3"
                        onClick={handleMobileLogout}
                      >
                        <i className="feather-log-out me-2"></i>
                        Déconnexion
                      </button>
                    </li>
                  </>
                )}
                
                {/* Section non authentifié */}
                {!isAuthenticated && (
                  <li>
                    <a href="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary w-100 mt-3">
                      <i className="feather-log-in me-2"></i>
                      Se connecter
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Style CSS pour l'interface */}
      <style jsx>{`
        .user-dashboard .icon-box button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.9rem;
        }
        
        .mobile-user-info {
          display: flex;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 15px;
        }
        
        .mobile-user-info .user-avatar img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 15px;
        }
        
        .mobile-user-info .user-details h5 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }
        
        .mobile-user-info .user-details .badge {
          font-size: 0.7rem;
          margin-top: 5px;
        }
        
        .btn-outline-primary {
          color: #4a6cf7;
          border-color: #4a6cf7;
        }
        
        .btn-outline-primary:hover {
          background-color: #4a6cf7;
          color: white;
        }
        
        /* Styles pour les menus déroulants */
        .has-dropdown {
          position: relative;
        }
        
        .has-dropdown .submenu {
          display: none;
          position: absolute;
          background: white;
          min-width: 200px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          border-radius: 8px;
          padding: 10px 0;
          z-index: 1000;
        }
        
        .has-dropdown:hover .submenu {
          display: block;
        }
        
        .has-dropdown .submenu li {
          list-style: none;
        }
        
        .has-dropdown .submenu a {
          display: block;
          padding: 8px 20px;
          color: #333;
          text-decoration: none;
        }
        
        .has-dropdown .submenu a:hover {
          background: #f8f9fa;
        }
        
        /* Badge colors */
        .bg-warning {
          background-color: #ffc107 !important;
          color: #000;
        }
        
        .bg-danger {
          background-color: #dc3545 !important;
          color: white;
        }
        
        .bg-info {
          background-color: #17a2b8 !important;
          color: white;
        }
        
        .bg-primary {
          background-color: #4a6cf7 !important;
          color: white;
        }
      `}</style>
    </header>
  );
};

export default Header;