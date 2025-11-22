import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'voter',
    agencyName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    if (formData.userType === 'agency' && !formData.agencyName.trim()) {
      setError('Le nom de l\'agence est obligatoire');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Sauvegarder le token et les infos utilisateur
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Rediriger selon le type d'utilisateur
        if (data.user.userType === 'agency') {
          navigate('/agency');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Erreur lors de la création du compte');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
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
              <h5 className="title text-center text-md-start">Inscription Klumer</h5>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-list">
                <li className="item"><a href="/">Accueil</a></li>
                <li className="separator"><i className="feather-chevron-right"></i></li>
                <li className="item current">Inscription</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="login-area rn-section-gapTop">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="form-wrapper-one">
                <h4>Créer un compte</h4>
                
                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-4">
                        <label className="form-label">Prénom *</label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-4">
                        <label className="form-label">Nom *</label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Type de compte *</label>
                    <select 
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="voter">Électeur</option>
                      <option value="agency">Agence/Organisateur</option>
                    </select>
                  </div>

                  {formData.userType === 'agency' && (
                    <div className="mb-4">
                      <label className="form-label">Nom de l'agence *</label>
                      <input 
                        type="text" 
                        name="agencyName"
                        value={formData.agencyName}
                        onChange={handleInputChange}
                        placeholder="Entrez le nom de votre agence"
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="form-label">Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Téléphone *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Mot de passe *</label>
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      minLength="6"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Confirmer le mot de passe *</label>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-4 rn-check-box">
                    <input 
                      type="checkbox" 
                      className="rn-check-box-input" 
                      id="terms" 
                      required 
                    />
                    <label className="rn-check-box-label" htmlFor="terms">
                      J'accepte les <a href="/terms">conditions d'utilisation</a>
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? 'Création en cours...' : 'Créer mon compte'}
                  </button>

                  <div className="text-center mt-3">
                    <span>Déjà un compte ? </span>
                    <a href="/login" className="text-primary">Se connecter</a>
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

export default Register;