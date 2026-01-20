// Fichier: src/pages/AuthOrga/RegisterOrganizer.jsx
import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useNavigate, Link } from 'react-router-dom';

const RegisterOrganizer = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agencyName: '',
    agencySlug: '',
    agencyDescription: '',
    agencyPhone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
        const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Générer automatiquement le slug à partir du nom de l'agence
  const handleAgencyNameChange = (e) => {
    const agencyName = e.target.value;
    setFormData(prev => ({
      ...prev,
      agencyName: agencyName,
      agencySlug: agencyName
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')
        .substring(0, 50)
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.password || !formData.agencyName || !formData.agencyPhone) {
      setError('Veuillez remplir tous les champs obligatoires');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer une adresse email valide');
      return false;
    }

    const phoneRegex = /^[+]?[0-9\s\-\(\)]{8,20}$/;
    if (!phoneRegex.test(formData.agencyPhone)) {
      setError('Veuillez entrer un numéro de téléphone valide');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      agencyName: formData.agencyName.trim(),
      agencySlug: formData.agencySlug.trim(),
      agencyDescription: formData.agencyDescription.trim(),
      agencyPhone: formData.agencyPhone.trim()
    };

    console.log("Payload envoyé:", payload);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        'https://api-klumer-node-votings-dev.onrender.com/auth/register-organizer',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      console.log("Statut de la réponse:", response.status);

      // Lecture du corps de la réponse UNE SEULE FOIS
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        console.log("Réponse non-JSON:", text);
        throw new Error(`Réponse inattendue du serveur: ${response.status}`);
      }

      console.log("Données de réponse:", responseData);

      if (!response.ok) {
        // Gestion des erreurs HTTP
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        }
        
        // Gestion des erreurs spécifiques
        if (response.status === 400) {
          if (errorMessage.includes('email') || errorMessage.includes('Email')) {
            errorMessage = 'Cette adresse email est déjà utilisée ou invalide';
          } else if (errorMessage.includes('slug') || errorMessage.includes('agencySlug')) {
            errorMessage = 'Cet identifiant d\'agence est déjà utilisé. Veuillez modifier le nom de l\'agence';
          } else if (errorMessage.includes('password')) {
            errorMessage = 'Le mot de passe ne respecte pas les critères de sécurité';
          }
        } else if (response.status === 409) {
          errorMessage = 'Un compte avec cet email ou cette agence existe déjà';
        } else if (response.status === 500) {
          errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard';
        }
        
        throw new Error(errorMessage);
      }

      // Traitement de la réponse réussie
      if (responseData.token && responseData.user && responseData.agency) {
        localStorage.setItem('userToken', responseData.token);
        localStorage.setItem('refreshToken', responseData.refreshToken || '');
        localStorage.setItem('userData', JSON.stringify(responseData.user));
        localStorage.setItem('agencyData', JSON.stringify(responseData.agency));
        
        setSuccess('Compte organisateur créé avec succès ! Redirection en cours...');
        
        setTimeout(() => {
          navigate('/agency');
        }, 2000);
      } else {
        setError('Réponse incomplète du serveur');
      }

    } catch (error) {
      console.error('Erreur détaillée:', error);
      
      let userErrorMessage = 'Erreur lors de l\'inscription';
      
      if (error.name === 'AbortError') {
        userErrorMessage = 'La requête a pris trop de temps. Vérifiez votre connexion internet';
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

  return (
    <div className="template-color-1">
      <Header />

      <div className="rn-breadcrumb-inner ptb--30">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <h5 className="title text-center text-md-start">Inscription Organisateur</h5>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-list">
                <li className="item"><a href="/">Accueil</a></li>
                <li className="separator"><i className="feather-chevron-right"></i></li>
                <li className="item current">Inscription Organisateur</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="register-area rn-section-gapTop">
        <div className="container">
          <div className="row g-5 justify-content-center">
            <div className="col-lg-8 col-md-10 col-sm-12">
              <div className="form-wrapper-one">
                <div className="text-center mb-5">
                  <h4>Créer un compte Organisateur</h4>
                  <p className="text-muted">
                    Inscrivez-vous pour créer et gérer vos événements de vote
                  </p>
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
                  {/* Informations personnelles */}
                  <div >
                    <div className="card-header">
                      <h5 className="mb-0">Informations personnelles</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">
                              Prénom *
                            </label>
                            <input 
                              type="text" 
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                              className="form-control"
                              placeholder="Votre prénom"
                              disabled={loading}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">
                              Nom *
                            </label>
                            <input 
                              type="text" 
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                              className="form-control"
                              placeholder="Votre nom"
                              disabled={loading}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Adresse Email *
                        </label>
                        <input 
                          type="email" 
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="form-control"
                          placeholder="exemple@votredomaine.com"
                          disabled={loading}
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                              Mot de passe *
                            </label>
                            <input 
                              type="password" 
                              id="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              required
                              className="form-control"
                              placeholder="Minimum 6 caractères"
                              minLength="6"
                              disabled={loading}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">
                              Confirmer le mot de passe *
                            </label>
                            <input 
                              type="password" 
                              id="confirmPassword"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              required
                              className="form-control"
                              placeholder="Retapez votre mot de passe"
                              disabled={loading}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informations de l'agence */}
                  <div >
                    <div className="card-header">
                      <h5 className="mb-0">Informations de l'Agence/Organisation</h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label htmlFor="agencyName" className="form-label">
                          Nom de l'agence *
                        </label>
                        <input 
                          type="text" 
                          id="agencyName"
                          name="agencyName"
                          value={formData.agencyName}
                          onChange={handleAgencyNameChange}
                          required
                          className="form-control"
                          placeholder="Ex: Events Agency Pro"
                          disabled={loading}
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="agencySlug" className="form-label">
                          Identifiant unique (URL) *
                          <small className="text-muted ms-2">Généré automatiquement</small>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">klumer.com/</span>
                          <input 
                            type="text" 
                            id="agencySlug"
                            name="agencySlug"
                            value={formData.agencySlug}
                            onChange={handleInputChange}
                            required
                            className="form-control"
                            placeholder="events-agency-pro"
                            disabled={loading}
                          />
                        </div>
                        <small className="text-muted">
                          Cet identifiant sera utilisé dans l'URL de votre page d'agence
                        </small>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="agencyDescription" className="form-label">
                          Description de l'agence
                        </label>
                        <textarea 
                          id="agencyDescription"
                          name="agencyDescription"
                          value={formData.agencyDescription}
                          onChange={handleInputChange}
                          rows="3"
                          className="form-control"
                          placeholder="Décrivez brièvement votre agence ou organisation..."
                          disabled={loading}
                        ></textarea>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="agencyPhone" className="form-label">
                          Téléphone de contact *
                        </label>
                        <input 
                          type="tel" 
                          id="agencyPhone"
                          name="agencyPhone"
                          value={formData.agencyPhone}
                          onChange={handleInputChange}
                          required
                          className="form-control"
                          placeholder="+228 99 99 99 99"
                          disabled={loading}
                        />
                        <small className="text-muted">
                          Format international recommandé
                        </small>
                      </div>
                    </div>
                  </div>

        
<div className="form-check mt-3" style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
  
  {/* ✅ La checkbox seule */}
  <input
    type="checkbox"
    className="form-check-input"
    id="acceptTerms"
    checked={acceptedTerms}
    onChange={(e) => setAcceptedTerms(e.target.checked)}
    style={{ marginTop: "4px" }}
  />

  {/* ✅ Le label ne contient PLUS le lien */}
  <label 
    className="form-check-label" 
    htmlFor="acceptTerms"
    style={{ cursor: "pointer" }}
  >
    J’accepte les
  </label>

  {/* ✅ Le lien est séparé → cliquable */}
  <a 
    href="/conditions"
    style={{ 
      textDecoration: "underline", 
      cursor: "pointer",
      color: "#4da3ff",
      zIndex: 10,            // ✅ garantit que rien ne passe au-dessus
      pointerEvents: "auto"  // ✅ force le clic
    }}
  >
    conditions d’utilisation
  </a>

  <span>et la politique de confidentialité</span>
</div>



<button
  type="submit"
  className="btn btn-primary w-100 mt-4"
  disabled={!acceptedTerms}
  style={{
    opacity: acceptedTerms ? 1 : 0.5,
    cursor: acceptedTerms ? "pointer" : "not-allowed"
  }}
>
  Créer mon compte organisateur
</button>


                  <div className="text-center mt-4">
                    <p className="mb-2">Vous avez déjà un compte ?</p>
                    <div className="d-flex justify-content-center gap-3">
                      <Link to="/login" className="btn btn-outline-primary">
                        Se connecter en tant qu'Organisateur
                      </Link>
                      <Link to="/register" className="btn btn-outline-secondary">
                        S'inscrire en tant qu'Électeur
                      </Link>
                    </div>
                  </div>
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

export default RegisterOrganizer;