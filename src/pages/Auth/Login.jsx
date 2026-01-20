import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      const user = JSON.parse(userData);
      // Rediriger vers la page appropriée selon le rôle
      redirectBasedOnRole(user);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Fonction pour rediriger selon le rôle
  const redirectBasedOnRole = (user) => {
    const userRole = user.role?.toLowerCase();
    
    // Vérifier si l'utilisateur doit changer son mot de passe
    // Vérification du champ mustChangePassword venant de l'API
    const mustChangePassword = user.mustChangePassword === true;

    if (mustChangePassword) {
      navigate('/changepassword', { 
        state: { 
          userId: user.id,
          email: user.email,
          role: user.role,
          forced: true 
        } 
      });
      return;
    }

    // Redirection normale basée sur le rôle
    if (userRole === 'super_admin') {
      navigate('/SuperAdmin/superadmin');
    } else if (userRole === 'organizer') {
      navigate('/agency');
    } else if (userRole === 'user') {
      navigate('/user-profile');
    } else if (userRole === 'admin') { 
      navigate('/admin');
    } else {
      navigate('/user-profile');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation basique
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer une adresse email valide');
      setLoading(false);
      return;
    }

    try {
      const endpoint = 'https://api-klumer-node-votings-dev.onrender.com/auth/login';
      
      console.log("Tentative de connexion avec:", {
        email: formData.email
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log("Statut de la réponse:", response.status);

      let responseData;
      try {
        const responseText = await response.text();
        console.log("Réponse brute:", responseText);
        
        if (responseText) {
          responseData = JSON.parse(responseText);
        } else {
          responseData = {};
        }
      } catch (parseError) {
        console.error("Erreur de parsing JSON:", parseError);
        setError('Erreur de traitement de la réponse du serveur');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        }
        
        // Messages spécifiques
        if (response.status === 401) {
          errorMessage = 'Email ou mot de passe incorrect';
        } else if (response.status === 400) {
          errorMessage = 'Données de connexion invalides';
        } else if (response.status === 404) {
          errorMessage = 'Compte non trouvé';
        } else if (response.status === 500) {
          errorMessage = 'Erreur interne du serveur';
        }
        
        throw new Error(errorMessage);
      }

      console.log("Données de réponse:", responseData);

      if (responseData.token && responseData.user) {
        // Stocker les tokens et données utilisateur
        localStorage.setItem('userToken', responseData.token);
        localStorage.setItem('refreshToken', responseData.refreshToken || '');
        
        // Stocker les données utilisateur TELES QU'elles viennent de l'API
        // L'API doit inclure le champ mustChangePassword si nécessaire
        localStorage.setItem('userData', JSON.stringify(responseData.user));
        
        // Stocker les données d'agence si elles existent
        if (responseData.agency) {
          localStorage.setItem('agencyData', JSON.stringify(responseData.agency));
        }

        console.log("Rôle de l'utilisateur:", responseData.user.role);
        console.log("Données complètes de l'utilisateur:", responseData.user);
        console.log("mustChangePassword:", responseData.user.mustChangePassword);

        // Rediriger selon le rôle
        redirectBasedOnRole(responseData.user);
        
      } else {
        setError('Réponse incomplète du serveur. Token ou utilisateur manquant.');
      }

    } catch (error) {
      console.error('Erreur détaillée:', error);
      
      let userErrorMessage = 'Erreur de connexion';
      
      if (error.name === 'AbortError') {
        userErrorMessage = 'La connexion a pris trop de temps. Vérifiez votre connexion internet';
      } else if (error.message.includes('Failed to fetch')) {
        userErrorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion internet';
      } else if (error.message.includes('NetworkError')) {
        userErrorMessage = 'Erreur réseau. Vérifiez votre connexion internet';
      } else if (error.message) {
        userErrorMessage = error.message;
      }
      
      setError(userErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour réinitialiser le mot de passe superadmin (pour test)
  const resetSuperAdminPassword = () => {
    localStorage.removeItem('superadmin_password_changed');
    setFormData({
      email: 'admin@klumer.com',
      password: 'SuperAdmin@2025'
    });
    alert('Credentials superadmin chargés pour test');
  };

  return (
    <div className="template-color-1">
      <Header />

      <div className="rn-breadcrumb-inner ptb--30">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <h5 className="title text-center text-md-start">Connexion Klumer</h5>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-list">
                <li className="item"><a href="/">Accueil</a></li>
                <li className="separator"><i className="feather-chevron-right"></i></li>
                <li className="item current">Connexion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="login-area rn-section-gapTop">
        <div className="container">
          <div className="row g-5 justify-content-center">
            <div className="col-lg-5 col-md-7 col-sm-12">
              <div className="form-wrapper-one">
                
                <h4 className="text-center mb-4">
                  Connexion à votre compte
                </h4>

                <div className="alert alert-info mb-4">
                  <small>
                    <i className="feather-info me-2"></i>
                    <strong>Utilisez vos identifiants pour acceder à votre espace</strong> 
                   
                    <br />
                    - Tous les mots de passe doivent contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
                  </small>
                </div>

                {/* Bouton de test superadmin */}
                <div className="text-center mb-4">
                  <button 
                    onClick={resetSuperAdminPassword}
                    className="btn btn-sm btn-outline-warning"
                    type="button"
                  >
                    Charger credentials Super Admin (test)
                  </button>
                </div>

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Erreur !</strong> {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label">Adresse Email</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                      placeholder="votre@email.com"
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">Mot de passe</label>
                    <input 
                      type="password" 
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                      placeholder="Votre mot de passe"
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-4 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        id="rememberMe"
                      />
                      <label className="form-check-label small" htmlFor="rememberMe">
                        Se souvenir de moi
                      </label>
                    </div>
                    <a 
                      href="/ForgotPassword"
                      style={{ 
                        textDecoration: "underline", 
                        cursor: "pointer",
                        color: "#4da3ff",
                        zIndex: 10,
                        pointerEvents: "auto"  
                      }}
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-3 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Connexion en cours...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <p className="mb-3">
                      Vous n'avez pas encore de compte ?
                    </p>
                    <div className="d-flex flex-column gap-2">
                      <Link to="/register" className="btn btn-outline-primary">
                        S'inscrire en tant qu'Électeur
                      </Link>
                      <Link to="/register-organizer" className="btn btn-outline-secondary">
                        S'inscrire en tant qu'Organisateur
                      </Link>
                    </div>
                  </div>
                </form>

                <div className="mt-4 text-center">
                  <small className="text-muted">
                    En vous connectant, vous acceptez nos 
                    <a href="/terms" className="text-primary ms-1">Conditions d'utilisation</a> et 
                    <a href="/privacy" className="text-primary ms-1">Politique de confidentialité</a>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;