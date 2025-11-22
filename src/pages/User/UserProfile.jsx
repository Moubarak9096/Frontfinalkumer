// Fichier: src/pages/User/UserProfile.jsx
import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+228 90 12 34 56',
    userType: 'voter'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', userData);
  };

  return (
    <div className="template-color-1">
      <Header />
      
      <div className="rn-breadcrumb-inner ptb--30">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <h5 className="title text-center text-md-start">Mon Profil</h5>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-list">
                <li className="item"><a href="/">Accueil</a></li>
                <li className="separator"><i className="feather-chevron-right"></i></li>
                <li className="item current">Mon Profil</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="rn-section-gapTop">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="profile-sidebar">
                <div className="user-info text-center mb-4">
                  <img 
                    src="/assets/images/icons/boy-avater.png" 
                    alt="Profile" 
                    className="rounded-circle mb-3"
                    style={{width: '100px', height: '100px'}}
                  />
                  <h5>{userData.firstName} {userData.lastName}</h5>
                  <p className="text-muted">{userData.email}</p>
                </div>
                
                <nav className="profile-nav">
                  <button 
                    className={`btn w-100 text-start mb-2 ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <i className="feather-user me-2"></i>
                    Profil
                  </button>
                  <button 
                    className={`btn w-100 text-start mb-2 ${activeTab === 'votes' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('votes')}
                  >
                    <i className="feather-check-circle me-2"></i>
                    Mes Votes
                  </button>
                  <button 
                    className={`btn w-100 text-start mb-2 ${activeTab === 'events' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('events')}
                  >
                    <i className="feather-calendar me-2"></i>
                    Mes Événements
                  </button>
                  <button 
                    className={`btn w-100 text-start mb-2 ${activeTab === 'security' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('security')}
                  >
                    <i className="feather-shield me-2"></i>
                    Sécurité
                  </button>
                </nav>
              </div>
            </div>
            
            <div className="col-lg-9">
              {activeTab === 'profile' && (
                <div className="profile-content">
                  <h4 className="mb-4">Informations du profil</h4>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Prénom</label>
                          <input 
                            type="text" 
                            name="firstName"
                            value={userData.firstName}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Nom</label>
                          <input 
                            type="text" 
                            name="lastName"
                            value={userData.lastName}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Téléphone</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    
                    <button type="submit" className="btn btn-primary">
                      Mettre à jour le profil
                    </button>
                  </form>
                </div>
              )}
              
              {activeTab === 'votes' && (
                <div className="votes-content">
                  <h4 className="mb-4">Historique de mes votes</h4>
                  <p>Fonctionnalité en cours de développement...</p>
                </div>
              )}
              
              {activeTab === 'events' && (
                <div className="events-content">
                  <h4 className="mb-4">Mes événements participés</h4>
                  <p>Fonctionnalité en cours de développement...</p>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div className="security-content">
                  <h4 className="mb-4">Paramètres de sécurité</h4>
                  <p>Fonctionnalité en cours de développement...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;