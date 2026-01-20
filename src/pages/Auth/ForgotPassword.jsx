// Fichier: src/pages/Auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaLock, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!email || !email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      setLoading(false);
      return;
    }

    // Simulation d'envoi
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="template-color-1">
      <Header />
      
      {/* Hero Section */}
      <section className="rn-breadcrumb-inner ptb--150 bg-gradient-primary">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 col-md-8 col-12">
              <div className="breadcrumb-inner">
                <div className="mb-4">
                  <Link to="/login" className="text-white d-inline-flex align-items-center">
                    <FaArrowLeft className="me-2" />
                    Retour à la connexion
                  </Link>
                </div>
                
                <h1 className="title display-3 fw-bold text-white mb-4">
                  Mot de passe <span className="text-warning">oublié</span> ?
                </h1>
                <p className="description text-light fs-5">
                  Nous vous aiderons à récupérer l'accès à votre compte
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-12">
              <div className="thumbnail text-center">
                <div className="mb-3">
                  <div className="rounded-circle bg-warning/20 d-inline-flex p-5">
                    <FaLock className="text-warning display-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire Section */}
      <section className="rn-section-gap pb--120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div >
                {success ? (
                  <div className="text-center py-5">
                    <div className="mb-4">
                      <div className="rounded-circle bg-success/20 d-inline-flex p-4 mb-3">
                        <FaCheckCircle className="text-success display-4" />
                      </div>
                    </div>
                    
                    <h3 className="fw-bold text-dark mb-3">Email envoyé avec succès !</h3>
                    
                    <p className="text-muted mb-4">
                      Nous avons envoyé un lien de réinitialisation à l'adresse :
                      <br />
                      <strong className="text-dark">{email}</strong>
                    </p>
                    
                    <div className="alert alert-info text-start mb-4">
                      <div className="d-flex">
                        <div className="flex-shrink-0">
                          <i className="fas fa-info-circle"></i>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <strong>Conseil :</strong> Vérifiez votre dossier spam si vous ne voyez pas l'email dans votre boîte de réception.
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mt-4">
                      <button
                        onClick={() => {
                          setSuccess(false);
                          setEmail('');
                        }}
                        className="btn btn-outline-secondary px-4"
                      >
                        Réessayer avec un autre email
                      </button>
                      <Link
                        to="/login"
                        className="btn btn-primary px-4"
                      >
                        Retour à la connexion
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-5">
                      <h3 className="fw-bold text-dark mb-3">Réinitialisation du mot de passe</h3>
                      <p className="text-muted">
                        Entrez l'adresse email associée à votre compte. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
                      </p>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                      {error && (
                        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                          <strong>Erreur !</strong> {error}
                          <button type="button" className="btn-close" onClick={() => setError('')}></button>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <label className="form-label fs-5 fw-semibold">
                          Adresse email <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FaEnvelope className="text-muted" />
                          </span>
                          <input
                            type="email"
                            className="form-control form-control-lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="votre@email.com"
                          />
                        </div>
                        <small className="text-muted mt-2 d-block">
                          Le lien de réinitialisation sera valide pendant 1 heure
                        </small>
                      </div>
                      
                      <div className="alert alert-warning mb-4">
                        <div className="d-flex">
                          <div className="flex-shrink-0">
                            <i className="fas fa-shield-alt"></i>
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <strong>Sécurité :</strong> Ce lien expirera automatiquement après 1 heure pour des raisons de sécurité.
                          </div>
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            Envoyer le lien de réinitialisation
                            <FaEnvelope className="ms-2" />
                          </>
                        )}
                      </button>
                    </form>
                    
                    <div className="mt-5 pt-4 border-top">
                      <div className="text-center">
                        <p className="text-muted mb-3">
                          Vous n'avez toujours pas reçu d'email ?
                        </p>
                        <Link
                          to="/contact"
                          className="text-primary fw-semibold"
                        >
                          Contactez notre support technique
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Section conseils de sécurité */}
              <div >
                <h5 className="fw-bold text-dark mb-3">
                  <i className="fas fa-lightbulb text-warning me-2"></i>
                  Conseils de sécurité
                </h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-start">
                      <span className="text-success me-2">✓</span>
                      <span className="text-muted">
                        Le lien est envoyé uniquement à l'email associé au compte
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-start">
                      <span className="text-success me-2">✓</span>
                      <span className="text-muted">
                        Ne partagez jamais votre lien de réinitialisation
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-start">
                      <span className="text-success me-2">✓</span>
                      <span className="text-muted">
                        Après réinitialisation, toutes les sessions seront fermées
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-start">
                      <span className="text-success me-2">✓</span>
                      <span className="text-muted">
                        Utilisez un mot de passe fort et unique
                      </span>
                    </div>
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

export default ForgotPassword;