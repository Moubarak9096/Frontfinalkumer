import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
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
        setError(data.message || 'Email ou mot de passe incorrect');
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
          <div className="row g-5">
            <div className="offset-2 col-lg-4 col-md-6 ml_md--0 ml_sm--0 col-sm-12">
              <div className="form-wrapper-one">
                <h4>Connexion</h4>
                
                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-5">
                    <label htmlFor="email" className="form-label">Adresse Email</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="password" className="form-label">Mot de passe</label>
                    <input 
                      type="password" 
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-5 rn-check-box">
                    <input type="checkbox" className="rn-check-box-input" id="rememberMe" />
                    <label className="rn-check-box-label" htmlFor="rememberMe">
                      Se souvenir de moi
                    </label>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary mr--15"
                    disabled={loading}
                  >
                    {loading ? 'Connexion...' : 'Se connecter'}
                  </button>
                  <a href="/register" className="btn btn-primary-alta">
                    S'inscrire
                  </a>
                </form>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="social-share-media form-wrapper-one">
                <h6>Autres moyens de connexion</h6>
                <p>Connectez-vous rapidement avec vos réseaux sociaux</p>
                <button className="another-login login-facebook">
                  <img className="small-image" src="/assets/images/icons/google.png" alt="Google" />
                  <span>Connexion avec Google</span>
                </button>
                <button className="another-login login-facebook">
                  <img className="small-image" src="/assets/images/icons/facebook.png" alt="Facebook" />
                  <span>Connexion avec Facebook</span>
                </button>
                <button className="another-login login-twitter">
                  <img className="small-image" src="/assets/images/icons/tweeter.png" alt="Twitter" />
                  <span>Connexion avec Twitter</span>
                </button>
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