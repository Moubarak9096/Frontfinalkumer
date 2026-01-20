// Fichier: src/pages/AuthOrga/ChangePassword.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { userId, email, role, forced = false } = location.state || {};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (!hasUpperCase) {
      return 'Le mot de passe doit contenir au moins une majuscule';
    }
    if (!hasLowerCase) {
      return 'Le mot de passe doit contenir au moins une minuscule';
    }
    if (!hasNumbers) {
      return 'Le mot de passe doit contenir au moins un chiffre';
    }
    if (!hasSpecialChar) {
      return 'Le mot de passe doit contenir au moins un caractère spécial';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('Le nouveau mot de passe doit être différent de l\'ancien');
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      
      // Endpoint pour changer le mot de passe
      const endpoint = 'https://api-klumer-node-votings-dev.onrender.com/auth/change-password';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      let responseData;
      try {
        const responseText = await response.text();
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
        
        if (response.status === 401) {
          errorMessage = 'Mot de passe actuel incorrect';
        }
        
        throw new Error(errorMessage);
      }

      // Mettre à jour les données utilisateur pour indiquer que le mot de passe a été changé
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const updatedUserData = {
        ...userData,
        mustChangePassword: false,
        firstLogin: false,
        passwordChangedAt: new Date().toISOString()
      };
      
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      
      // Pour le superadmin, stocker un indicateur supplémentaire
      if (userData.role === 'superadmin' && userData.email === 'admin@klumer.com') {
        localStorage.setItem('superadmin_password_changed', 'true');
      }

      setSuccess('Mot de passe changé avec succès ! Redirection en cours...');

      // Rediriger après un délai
      setTimeout(() => {
        // Rediriger selon le rôle
        const userRole = userData.role?.toLowerCase();
        
        if (userRole === 'superadmin') {
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
      }, 2000);

    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      setError(error.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="template-color-1">
      <Header />

      <div className="rn-breadcrumb-inner ptb--30">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <h5 className="title text-center text-md-start">Changement de mot de passe</h5>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-list">
                <li className="item"><a href="/">Accueil</a></li>
                <li className="separator"><i className="feather-chevron-right"></i></li>
                <li className="item current">Changer mot de passe</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="change-password-area rn-section-gapTop">
        <div className="container">
          <div className="row g-5 justify-content-center">
            <div className="col-lg-5 col-md-7 col-sm-12">
              <div className="form-wrapper-one">
                
                <h4 className="text-center mb-4">
                  {forced ? 'Changement de mot de passe obligatoire' : 'Changer votre mot de passe'}
                </h4>

                {forced && (
                  <div className="alert alert-warning mb-4">
                    <small>
                      <i className="feather-alert-triangle me-2"></i>
                      <strong>Attention :</strong> Vous devez changer votre mot de passe pour des raisons de sécurité avant de continuer.
                    </small>
                  </div>
                )}

                <div className="alert alert-info mb-4">
                  <small>
                    <i className="feather-info me-2"></i>
                    <strong>Exigences du mot de passe :</strong>
                    <br />
                    • Minimum 8 caractères
                    <br />
                    • Au moins une lettre majuscule
                    <br />
                    • Au moins une lettre minuscule
                    <br />
                    • Au moins un chiffre
                    <br />
                    • Au moins un caractère spécial (!@#$%^&*, etc.)
                  </small>
                </div>

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Erreur !</strong> {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Succès !</strong> {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {!forced && (
                    <div className="mb-4">
                      <label htmlFor="currentPassword" className="form-label">Mot de passe actuel</label>
                      <input 
                        type="password" 
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                        placeholder="Entrez votre mot de passe actuel"
                        disabled={loading}
                      />
                    </div>
                  )}

                  {forced && (
                    <div className="mb-4">
                      <label htmlFor="currentPassword" className="form-label">
                        Mot de passe temporaire / par défaut
                      </label>
                      <input 
                        type="password" 
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                        placeholder="Entrez votre mot de passe actuel"
                        disabled={loading}
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <label htmlFor="newPassword" className="form-label">Nouveau mot de passe</label>
                    <input 
                      type="password" 
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                      placeholder="Entrez votre nouveau mot de passe"
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">Confirmer le nouveau mot de passe</label>
                    <input 
                      type="password" 
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                      placeholder="Confirmez votre nouveau mot de passe"
                      disabled={loading}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-3 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Changement en cours...
                      </>
                    ) : (
                      'Changer le mot de passe'
                    )}
                  </button>

                  {!forced && (
                    <div className="text-center">
                      <button 
                        type="button"
                        className="btn btn-link"
                        onClick={() => navigate(-1)}
                      >
                        Retour
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChangePassword;