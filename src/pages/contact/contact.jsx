// Fichier: src/pages/Contact/Contact.jsx
import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaGlobe, FaHeadset,  } from 'react-icons/fa';
import { BsWatch } from 'react-icons/bs';
import { TbWorldLatitude } from 'react-icons/tb';
import { GiGlobe, GiPadlock } from 'react-icons/gi';
import { GrDocument } from 'react-icons/gr';
import { RxRocket } from 'react-icons/rx';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    privacyPolicy: false
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      title: 'Notre siège',
      details: ['123 Avenue de la Technologie', '75015 Lomé, Togo'],
      link: 'https://maps.google.com',
      color: 'primary'
    },
    {
      icon: <FaPhone />,
      title: 'Téléphone',
      details: ['+228 99 99 99 99', '+228 99 99 99 99'],
      link: 'tel:+228999999',
      color: 'success'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      details: ['contact@klumer.com', 'support@klumer.com'],
      link: 'mailto:contact@klumer.com',
      color: 'warning'
    },
    {
      icon: <FaClock />,
      title: 'Horaires',
      details: ['Lun-Ven: 9h-18h', 'Support 24/7 disponible'],
      color: 'info'
    }
  ];

  const departments = [
    {
      name: 'Support Technique',
      email: 'support@klumer.com',
      phone: '+228 99 99 99 99',
      description: 'Assistance technique et résolution de problèmes'
    },
    {
      name: 'Commercial',
      email: 'sales@klumer.com',
      phone: '+228 99 99 99 99',
      description: 'Demandes de devis et informations commerciales'
    },
    {
      name: 'Partnership',
      email: 'partners@klumer.com',
      phone: '+008 99 99 99 99',
      description: 'Partenariats et collaborations stratégiques'
    },
    {
      name: 'Presse & Médias',
      email: 'press@klumer.com',
      phone: '+228 99 99 99 99',
      description: 'Relations presse et demandes médiatiques'
    }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.privacyPolicy) {
      setError('Veuillez accepter la politique de confidentialité');
      setLoading(false);
      return;
    }

    // Simulation d'envoi
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('Votre message a été envoyé avec succès ! Nous vous répondrons dans les 24h.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        privacyPolicy: false
      });
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
                <h1 className="title display-3 fw-bold text-white">
                  Contactez-nous, <span className="text-danger ">discutons</span> de votre projet
                </h1>
                <p className="description text-light fs-5 mb-4">
                  Notre équipe est à votre écoute pour répondre à toutes vos questions 
                  et vous accompagner dans votre projet de vote numérique.
                </p>
                <div className="d-flex flex-wrap gap-3 align-items-center">
                  <button className="btn btn-outline-light btn-lg px-4">
                    <FaHeadset className="me-2" />
                    Support 24/7
                  </button>
                  <span className="text-light">
                    <FaClock className="me-2" />
                    Réponse sous 2 heures
                  </span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-12">
              <div className="thumbnail">
                <img 
                  src="/images/contact-hero.svg" 
                  alt="Contact Klumer" 
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="rn-section-gapTop pb--120">
        <div className="container">
          <div className="row g-4">
            {contactInfo.map((info, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="contact-card text-center p-4 rounded-4 shadow-sm h-100 border">
                  <div className={`contact-icon mb-4 text-${info.color}`} style={{ fontSize: '3rem' }}>
                    {info.icon}
                  </div>
                  <h4 className="mb-3">{info.title}</h4>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="mb-1 text-muted">{detail}</p>
                  ))}
                  {info.link && (
                    <a 
                      href={info.link} 
                      className="btn btn-sm btn-outline-primary mt-3"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Voir sur la carte
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section >
        <div className="container">
          <div className="row g-5">
            {/* Formulaire */}
            <div className="col-lg-8">
              <div >
                <div className="section-title mb-5">
                  <span className="subtitle text-primary fw-bold">ENVOYEZ-NOUS UN MESSAGE</span>
                  <h2 className="title display-5 fw-bold">
                    Comment pouvons-nous vous aider ?
                  </h2>
                </div>

                {/* Messages d'alerte */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Erreur !</strong> {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                  </div>
                )}
                
                {success && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Succès !</strong> {success}
                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label fs-5">
                        Prénom <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        className="form-control form-control-lg"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label fs-5" >
                        Nom <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        className="form-control form-control-lg"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label fs-5">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control form-control-lg"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label fs-5">Téléphone</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control form-control-lg"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label fs-5">Entreprise</label>
                      <input
                        type="text"
                        name="company"
                        className="form-control form-control-lg"
                        value={formData.company}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label fs-5">
                        Sujet <span className="text-danger">*</span>
                      </label>
                      <select
                        name="subject"
                        className="form-select form-select-lg"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="demo">Demande de démo</option>
                        <option value="quote">Demande de devis</option>
                        <option value="support">Support technique</option>
                        <option value="partnership">Partenariat</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fs-5">
                      Message <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="message"
                      className="form-control form-control-lg"
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Décrivez-nous votre projet ou votre demande..."
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        name="privacyPolicy"
                        className="form-check-input"
                        checked={formData.privacyPolicy}
                        onChange={handleChange}
                        id="privacyPolicy"
                      />
                      <label className="form-check-label ms-2" htmlFor="privacyPolicy">
                        J'accepte la{' '}
                        <a href="/" className="text-primary">
                          politique de confidentialité
                        </a>{' '}
                        et je consens au traitement de mes données personnelles.
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg px-5"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer le message
                        <i className="feather-send ms-2"></i>
                      </>
                    )}
                  </button>
                </form>    
              </div>
            </div>

            {/* Map & Info */}
            <div className="col-lg-4">
              {/* Carte */}
              <div className="map-container mb-5 rounded-4 overflow-hidden shadow-sm">
                <iframe
                  title="Klumer Headquarters"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.991440608186!2d2.2922926155086297!3d48.858373608660986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1641234567890!5m2!1sfr!2sfr"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>

              {/* Departments */}
              <div className="departments-list">
                <h4 className="mb-4">Contactez le bon service</h4>
                {departments.map((dept, index) => (
                  <div key={index} className="department-item border rounded-3 p-3 mb-3">
                    <h5 className="mb-2">{dept.name}</h5>
                    <p className="text-muted small mb-2">{dept.description}</p>
                    <div className="d-flex justify-content-between">
                      <a href={`mailto:${dept.email}`} className="text-primary">
                        <FaEnvelope className="me-1" />
                        {dept.email}
                      </a>
                      <a href={`tel:${dept.phone}`} className="text-success">
                        <FaPhone className="me-1" />
                        {dept.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="rn-section-gap">
        <div className="container">
          <div className="section-title text-center mb-5">
            <span className="subtitle text-primary fw-bold">RÉPONSES RAPIDES</span>
            <h2 className="title display-5 fw-bold">
              Questions fréquentes sur le contact
            </h2>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="faq-item p-4 border rounded-4 h-100">
                <h5 className="mb-3"> <FaPhone /> Quel est le délai de réponse ?</h5>
                <p className="text-muted mb-0">
                  Nous nous engageons à répondre à toutes les demandes sous 2 heures 
                  pendant les heures ouvrables, et sous 24 heures maximum.
                </p>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <div className="faq-item p-4 border rounded-4 h-100">
                <h5 className="mb-3"><BsWatch />  Puis-je programmer une réunion ?</h5>
                <p className="text-muted mb-0">
                  Oui, notre équipe commerciale peut vous proposer un créneau 
                  pour une démonstration personnalisée. Répondez simplement à 
                  notre premier email.
                </p>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <div className="faq-item p-4 border rounded-4 h-100">
                <h5 className="mb-3"><GiGlobe />  Support international</h5>
                <p className="text-muted mb-0">
                  Nous fournissons un support en français, anglais et espagnol, 
                  24h/24 et 7j/7 pour nos clients internationaux.
                </p>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <div className="faq-item p-4 border rounded-4 h-100">
                <h5 className="mb-3"><GiPadlock />  Confidentialité garantie</h5>
                <p className="text-muted mb-0">
                  Toutes vos informations sont traitées avec la plus stricte 
                  confidentialité et protégées par chiffrement.
                </p>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <div className="faq-item p-4 border rounded-4 h-100">
                <h5 className="mb-3"><GrDocument />  Documents nécessaires</h5>
                <p className="text-muted mb-0">
                  Pour une demande de devis, préparez simplement vos besoins 
                  en termes d'utilisateurs, élections et fonctionnalités.
                </p>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <div className="faq-item p-4 border rounded-4 h-100">
                <h5 className="mb-3"><RxRocket />  Démarrage rapide</h5>
                <p className="text-muted mb-0">
                  Après signature, nous pouvons démarrer votre projet sous 
                  48h. Notre équipe vous accompagne à chaque étape.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="rn-section-gap bg-gradient-primary text-white">
        <div className="container">
          <div className="row align-items-center text-center text-lg-start">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-3">
                Besoin d'une réponse immédiate ?
              </h2>
              <p className="fs-5 mb-0">
                Appelez notre équipe de support au +228 99 99 99 99
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
              <a href="tel:+33123456789" className="btn btn-outline-light btn-lg px-5">
                <FaPhone className="me-2" />
                Appeler maintenant
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;