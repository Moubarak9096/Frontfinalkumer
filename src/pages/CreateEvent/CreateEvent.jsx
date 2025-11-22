// Fichier: src/pages/CreateEvent/CreateEvent.jsx
import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const CreateEvent = () => {
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    image: null,
    agencyName: '',
    agencyEmail: '',
    agencyPhone: '',
    agencyAddress: '',
    candidates: [{ name: '', description: '', image: null }]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCandidateChange = (index, field, value) => {
    const updatedCandidates = [...eventData.candidates];
    updatedCandidates[index][field] = value;
    setEventData(prev => ({
      ...prev,
      candidates: updatedCandidates
    }));
  };

  const addCandidate = () => {
    setEventData(prev => ({
      ...prev,
      candidates: [...prev.candidates, { name: '', description: '', image: null }]
    }));
  };

  const removeCandidate = (index) => {
    if (eventData.candidates.length > 1) {
      const updatedCandidates = eventData.candidates.filter((_, i) => i !== index);
      setEventData(prev => ({
        ...prev,
        candidates: updatedCandidates
      }));
    }
  };

  const handleFileUpload = (e, field, candidateIndex = null) => {
    const file = e.target.files[0];
    if (file) {
      if (candidateIndex !== null) {
        handleCandidateChange(candidateIndex, field, file);
      } else {
        setEventData(prev => ({
          ...prev,
          [field]: file
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Event data:', eventData);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="template-color-1">
      <Header />
      
      <div className="rn-breadcrumb-inner ptb--30">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <h5 className="title text-center text-md-start">Créer un Événement</h5>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-list">
                <li className="item"><a href="/">Accueil</a></li>
                <li className="separator"><i className="feather-chevron-right"></i></li>
                <li className="item current">Créer Événement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="create-event-area rn-section-gapTop">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              
              {/* Progress Bar */}
              <div className="rn-progress-bar mb-5">
                <div className="progress-steps">
                  <div className={`step ${step >= 1 ? 'active' : ''}`}>
                    <span>1</span>
                    <small>Informations</small>
                  </div>
                  <div className={`step ${step >= 2 ? 'active' : ''}`}>
                    <span>2</span>
                    <small>Agence</small>
                  </div>
                  <div className={`step ${step >= 3 ? 'active' : ''}`}>
                    <span>3</span>
                    <small>Candidats</small>
                  </div>
                </div>
              </div>

              <div className="form-wrapper-one">
                <form onSubmit={handleSubmit}>
                  
                  {/* Étape 1: Informations de base */}
                  {step === 1 && (
                    <div className="step-content">
                      <h4 className="mb-4">Informations de l'événement</h4>
                      
                      <div className="mb-4">
                        <label className="form-label">Titre de l'événement</label>
                        <input 
                          type="text" 
                          name="title"
                          value={eventData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Description</label>
                        <textarea 
                          name="description"
                          value={eventData.description}
                          onChange={handleInputChange}
                          rows="4"
                          required
                        ></textarea>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">Catégorie</label>
                            <select 
                              name="category"
                              value={eventData.category}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Sélectionnez une catégorie</option>
                              <option value="politique">Politique</option>
                              <option value="culture">Culture</option>
                              <option value="sport">Sport</option>
                              <option value="education">Éducation</option>
                              <option value="innovation">Innovation</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">Image de l'événement</label>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'image')}
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">Date de début</label>
                            <input 
                              type="datetime-local" 
                              name="startDate"
                              value={eventData.startDate}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">Date de fin</label>
                            <input 
                              type="datetime-local" 
                              name="endDate"
                              value={eventData.endDate}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="text-end">
                        <button type="button" className="btn btn-primary" onClick={nextStep}>
                          Suivant
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Étape 2: Informations de l'agence */}
                  {step === 2 && (
                    <div className="step-content">
                      <h4 className="mb-4">Informations de l'agence</h4>
                      
                      <div className="mb-4">
                        <label className="form-label">Nom de l'agence</label>
                        <input 
                          type="text" 
                          name="agencyName"
                          value={eventData.agencyName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">Email</label>
                            <input 
                              type="email" 
                              name="agencyEmail"
                              value={eventData.agencyEmail}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">Téléphone</label>
                            <input 
                              type="tel" 
                              name="agencyPhone"
                              value={eventData.agencyPhone}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Adresse</label>
                        <textarea 
                          name="agencyAddress"
                          value={eventData.agencyAddress}
                          onChange={handleInputChange}
                          rows="3"
                          required
                        ></textarea>
                      </div>

                      <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-primary-alta" onClick={prevStep}>
                          Retour
                        </button>
                        <button type="button" className="btn btn-primary" onClick={nextStep}>
                          Suivant
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Étape 3: Candidats */}
                  {step === 3 && (
                    <div className="step-content">
                      <h4 className="mb-4">Ajouter les candidats</h4>
                      
                      {eventData.candidates.map((candidate, index) => (
                        <div key={index} className="candidate-card mb-4 p-4 border rounded">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Candidat {index + 1}</h5>
                            {eventData.candidates.length > 1 && (
                              <button 
                                type="button" 
                                className="btn btn-danger btn-sm"
                                onClick={() => removeCandidate(index)}
                              >
                                <i className="feather-trash-2"></i>
                              </button>
                            )}
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Nom du candidat</label>
                                <input 
                                  type="text" 
                                  value={candidate.name}
                                  onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Photo</label>
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e, 'image', index)}
                                  className="form-control"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea 
                              value={candidate.description}
                              onChange={(e) => handleCandidateChange(index, 'description', e.target.value)}
                              rows="3"
                              required
                            ></textarea>
                          </div>
                        </div>
                      ))}

                      <div className="mb-4">
                        <button type="button" className="btn btn-primary-alta" onClick={addCandidate}>
                          <i className="feather-plus me-2"></i>
                          Ajouter un candidat
                        </button>
                      </div>

                      <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-primary-alta" onClick={prevStep}>
                          Retour
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Créer l'événement
                        </button>
                      </div>
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

export default CreateEvent;