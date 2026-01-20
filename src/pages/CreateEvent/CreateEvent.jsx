
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://api-klumer-node-votings-dev.onrender.com';

const CreateEvent = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

const [eventCreated, setEventCreated] = useState(false);

  const [showDraftPopup, setShowDraftPopup] = useState(false);
  const [createdCompetitionId, setCreatedCompetitionId] = useState(null);
  const [popupLoading, setPopupLoading] = useState(false);
  const [originalAction, setOriginalAction] = useState('draft');

  // États pour les erreurs de dates
  const [dateErrors, setDateErrors] = useState({
    startDate: '',
    endDate: ''
  });

  // État pour l'avertissement de prix
  const [priceWarning, setPriceWarning] = useState(false);

  const validateCandidatesForSubmission = () => {
    const totalCandidates = eventData.sections.reduce((total, section) => 
      total + (section.candidates || []).length, 0
    );
    
    if (totalCandidates < 2) {
      setError('Pour soumettre à validation, vous devez avoir au moins 2 candidats.');
      return false;
    }

    // Vérifier que tous les candidats ont un nom
    const hasEmptyCandidateNames = eventData.sections.some(section =>
      (section.candidates || []).some(candidate => !candidate.name.trim())
    );
    
    if (hasEmptyCandidateNames) {
      setError('Pour soumettre à validation, tous les candidats doivent avoir un nom.');
      return false;
    }

    return true;
  };

  // Données de l'événement
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    categoryId: '',
    votePrice: 1,
    startDate: '',
    endDate: '',
    eventImage: null,
    eventImagePreview: null,
    sections: [
      {
        title: '',
        description: '',
        sectionImage: null,
        sectionImagePreview: null,
        candidates: [{ 
          name: '', 
          bio: '', 
          candidateImage: null,
          candidateImagePreview: null
        }]
      }
    ]
  });

  // Fonction pour obtenir la date/heure actuelle au format datetime-local
  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Fonction pour valider les dates
  const validateDates = () => {
    const errors = { startDate: '', endDate: '' };
    let isValid = true;
    
    const now = new Date();
    const startDate = new Date(eventData.startDate);
    const endDate = new Date(eventData.endDate);
    
    if (!eventData.startDate) {
      errors.startDate = 'La date de début est requise';
      isValid = false;
    } else if (startDate < now) {
      errors.startDate = 'La date de début doit être supérieure ou égale à la date actuelle à la minute près';
      isValid = false;
    }
    
    if (!eventData.endDate) {
      errors.endDate = 'La date de fin est requise';
      isValid = false;
    } else if (endDate <= startDate) {
      errors.endDate = 'La date de fin doit être supérieure à la date de début à la minute près';
      isValid = false;
    }
    
    setDateErrors(errors);
    return isValid;
  };

  // Gestionnaire de changement pour tous les champs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setEventData(prev => ({
      ...prev,
      [name]: name === 'votePrice' ? Number(value) : value
    }));
    
    // Mettre à jour le titre de la première section avec le titre de l'événement
    if (name === 'title' && eventData.sections[0]) {
      setEventData(prev => ({
        ...prev,
        sections: prev.sections.map((section, index) => 
          index === 0 ? { ...section, title: value } : section
        )
      }));
    }
    
    // Validation en temps réel pour les dates
    if (name === 'startDate' || name === 'endDate') {
      setTimeout(() => {
        const now = new Date();
        const startDate = name === 'startDate' ? new Date(value) : new Date(eventData.startDate);
        const endDate = name === 'endDate' ? new Date(value) : new Date(eventData.endDate);
        
        const newErrors = { ...dateErrors };
        
        if (name === 'startDate') {
          if (!value) {
            newErrors.startDate = 'La date de début est requise';
          } else if (startDate < now) {
            newErrors.startDate = 'La date de début doit être supérieure ou égale à la date actuelle à la minute près';
          } else {
            newErrors.startDate = '';
            if (eventData.endDate && endDate <= startDate) {
              newErrors.endDate = 'La date de fin doit être supérieure à la date de début à la minute près';
            } else {
              newErrors.endDate = '';
            }
          }
        }
        
        if (name === 'endDate') {
          if (!value) {
            newErrors.endDate = 'La date de fin est requise';
          } else if (endDate <= startDate) {
            newErrors.endDate = 'La date de fin doit être supérieure à la date de début à la minute près';
          } else {
            newErrors.endDate = '';
          }
        }
        
        setDateErrors(newErrors);
      }, 0);
    }
    
    // Validation du prix du vote
    if (name === 'votePrice') {
      const priceValue = Number(value);
      
      if (priceValue < 100) {
        setPriceWarning(true);
      } else {
        setPriceWarning(false);
      }
    }
    
    setError('');
  };

  // Fonction utilitaire pour uploader une image
  const uploadImage = async (file, type = 'image') => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const formData = new FormData();
      formData.append(type, file);

      const endpoint = type === 'images' 
        ? `${API_BASE}/upload/images` 
        : `${API_BASE}/upload/image`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur upload: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return result.url || result.imageUrl || result.data?.url;
    } catch (error) {
      console.error('Erreur upload image:', error);
      throw error;
    }
  };

  // Vérifier l'authentification et récupérer les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_BASE}/categories`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else if (data.data && Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          console.warn('Format de réponse inattendu:', data);
          setCategories([]);
        }
      } catch (error) {
        console.error('Erreur récupération catégories:', error);
        setError(`Impossible de charger les catégories: ${error.message}`);
      }
    };

    fetchCategories();
  }, [navigate]);

  // Gestionnaires de changement pour les sections
  const handleSectionChange = (sIndex, field, value) => {
    const sections = [...eventData.sections];
    sections[sIndex][field] = value;
    setEventData(prev => ({ ...prev, sections }));
  };

  const handleCandidateChange = (sIndex, cIndex, field, value) => {
    const sections = [...eventData.sections];
    sections[sIndex].candidates[cIndex][field] = value;
    setEventData(prev => ({ ...prev, sections }));
  };

  // Gestionnaire pour l'image de l'événement
  const handleEventImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventData(prev => ({
          ...prev,
          eventImage: file,
          eventImagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestionnaire pour l'image d'une section
  const handleSectionImageChange = (e, sIndex) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const sections = [...eventData.sections];
        sections[sIndex].sectionImage = file;
        sections[sIndex].sectionImagePreview = reader.result;
        setEventData(prev => ({ ...prev, sections }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestionnaire pour l'image d'un candidat
  const handleCandidateImageChange = (e, sIndex, cIndex) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const sections = [...eventData.sections];
        sections[sIndex].candidates[cIndex].candidateImage = file;
        sections[sIndex].candidates[cIndex].candidateImagePreview = reader.result;
        setEventData(prev => ({ ...prev, sections }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSection = () => {
    setEventData(prev => ({
      ...prev,
      sections: [...prev.sections, { 
        title: `Section ${prev.sections.length + 1}`, 
        description: '',
        sectionImage: null,
        sectionImagePreview: null,
        candidates: [{ 
          name: '', 
          bio: '', 
          candidateImage: null,
          candidateImagePreview: null
        }] 
      }]
    }));
  };

  const removeSection = (index) => {
    if (eventData.sections.length > 1) {
      const sections = [...eventData.sections];
      sections.splice(index, 1);
      setEventData(prev => ({ ...prev, sections }));
    }
  };

  const addCandidate = (sIndex) => {
    const sections = [...eventData.sections];
    sections[sIndex].candidates.push({ 
      name: '', 
      bio: '', 
      candidateImage: null,
      candidateImagePreview: null
    });
    setEventData(prev => ({ ...prev, sections }));
  };

  const removeCandidate = (sIndex, cIndex) => {
    const sections = [...eventData.sections];
    if (sections[sIndex].candidates.length > 1) {
      sections[sIndex].candidates.splice(cIndex, 1);
      setEventData(prev => ({ ...prev, sections }));
    }
  };

  // Dans la fonction nextStep, modifiez la validation pour l'étape 1 :
  const nextStep = () => {
    if (step === 1) {
      if (!eventData.title || !eventData.description || !eventData.categoryId) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      const datesValid = validateDates();
      if (!datesValid) {
        setError('Veuillez corriger les erreurs dans les dates');
        return;
      }
      
      // Validation spécifique pour le prix
      if (eventData.votePrice === 0) {
        setError('Le prix du vote doit être supérieur à 0 FCFA. Pour créer un vote gratuit, veuillez contacter notre équipe technique.');
        return;
      }
      
      if (eventData.votePrice < 100) {
        let message = '';
        
        if (eventData.votePrice < 100) {
          message = `Le prix du vote est de ${eventData.votePrice} FCFA (inférieur à 100 FCFA).\n\n` +
                   'Voulez-vous vraiment continuer avec ce prix ?';
        }
        
        const confirmPrice = window.confirm(message);
        
        if (!confirmPrice) {
          return;
        }
      }
    } else if (step === 2) {
      for (const section of eventData.sections) {
        if (!section.title || section.candidates.length === 0) {
          setError('Chaque section doit avoir un titre et au moins un candidat');
          return;
        }
        for (const candidate of section.candidates) {
          if (!candidate.name) {
            setError('Tous les candidats doivent avoir un nom');
            return;
          }
        }
      }
    }
    setStep(step + 1);
    setError('');
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

// Fonction pour soumettre un brouillon à validation
const submitDraftForApproval = async () => {
  if (!createdCompetitionId) {
    setError('ID de compétition non trouvé');
    return;
  }

  setPopupLoading(true);
  setError('');

  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error('Veuillez vous reconnecter');
    }

    // Si l'action originale était 'submit', valider les candidats
    if (originalAction === 'submit') {
      if (!validateCandidatesForSubmission()) {
        setPopupLoading(false);
        return;
      }
    } else {
      // Pour les brouillons, validation plus légère
      const totalCandidates = eventData.sections.reduce((total, section) => 
        total + (section.candidates || []).length, 0
      );
      
      if (totalCandidates < 2) {
        setError('Pour soumettre à validation, vous devez avoir au moins 2 candidats.');
        setPopupLoading(false);
        return;
      }

      const hasEmptyCandidateNames = eventData.sections.some(section =>
        (section.candidates || []).some(candidate => !candidate.name.trim())
      );
      
      if (hasEmptyCandidateNames) {
        setError('Pour soumettre à validation, tous les candidats doivent avoir un nom.');
        setPopupLoading(false);
        return;
      }
    }


const response = await fetch(`${API_BASE}/competitions/${createdCompetitionId}/submit`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({}) 
});

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur lors de la soumission: ${errorText}`);
    }

    // Fermer le popup et rediriger
    setShowDraftPopup(false);
    setSuccess('✅ Événement soumis avec succès ! Il est maintenant en attente de validation par l\'administrateur. Redirection...');
    
    setTimeout(() => {
      navigate('/competitions');
    }, 2000);

  } catch (error) {
    console.error('Erreur:', error);
    setError(`❌ ${error.message}`);
  } finally {
    setPopupLoading(false);
  }
};

// Fonction pour fermer et rediriger
const closeAndRedirect = () => {
  setShowDraftPopup(false);
  setSuccess(' Événement enregistré comme brouillon. Vous pourrez le soumettre plus tard.');
  
  // Redirection après un court délai
  setTimeout(() => {
    navigate('/competitions');
  }, 1500);
};

  // Fonction pour continuer vers la liste des compétitions
  const continueToList = () => {
    setShowDraftPopup(false);
    navigate('/competitions');
  };

  // Modifiez la fonction handleSubmit pour gérer le popup
  const handleSubmit = async (action = 'draft') => {
    setLoading(true);
    setUploading(true);
    setError('');
    setSuccess('');

    // Stocker l'action originale
    setOriginalAction(action);

    try {
      // Valider les champs obligatoires
      if (!eventData.title || !eventData.description || !eventData.categoryId || eventData.votePrice === undefined) {
        setError('Veuillez remplir tous les champs obligatoires');
        setLoading(false);
        setUploading(false);
        return;
      }

      // Valider que le prix est supérieur à 0
      if (eventData.votePrice === 0) {
        setError('Le prix du vote doit être supérieur à 0 FCFA. Pour créer un vote gratuit, veuillez contacter notre équipe technique.');
        setLoading(false);
        setUploading(false);
        return;
      }

      // Valider les dates
      const datesValid = validateDates();
      if (!datesValid) {
        setError('Veuillez corriger les erreurs dans les dates avant de soumettre');
        setLoading(false);
        setUploading(false);
        return;
      }

      // Validation spécifique pour la soumission
      if (action === 'submit') {
        if (!validateCandidatesForSubmission()) {
          setLoading(false);
          setUploading(false);
          return;
        }
      }

      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Veuillez vous reconnecter');
      }

      // 1️⃣ Upload de l'image de l'événement
      let eventImageUrl = null;
      if (eventData.eventImage) {
        setSuccess('📤 Upload de l\'image de l\'événement...');
        eventImageUrl = await uploadImage(eventData.eventImage, 'image');
      }

      // 2️⃣ Création de la compétition avec TOUJOURS le statut draft pour le popup
      const competitionData = {
        title: eventData.title.trim(),
        description: eventData.description.trim(),
        shortDescription: (eventData.shortDescription || eventData.description.substring(0, 100)).trim(),
        categoryId: eventData.categoryId,
        coverImageUrl: eventImageUrl || 'https://via.placeholder.com/800x400?text=Événement',
        votePrice: Number(eventData.votePrice),
        startDate: new Date(eventData.startDate).toISOString(),
        endDate: new Date(eventData.endDate).toISOString(),
        registrationDeadline: new Date(eventData.endDate).toISOString(),
        minVotesPerTransaction: 1,
        maxVotesPerTransaction: 100,
        allowMultipleVotesSameCandidate: true,
        enableLeaderboard: true,
        status: 'draft' // Toujours en draft pour le popup
      };

      const competitionRes = await fetch(`${API_BASE}/competitions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(competitionData)
      });

      const responseText = await competitionRes.text();

      if (!competitionRes.ok) {
        throw new Error(`Erreur création compétition: ${responseText}`);
      }

      const competition = JSON.parse(responseText);
      const competitionId = competition.id || competition._id || competition.data?.id;
      
      if (!competitionId) {
        throw new Error('ID de compétition non reçu de l\'API');
      }
      
      // 3️⃣ Traitement des sections
      for (let i = 0; i < eventData.sections.length; i++) {
        const section = eventData.sections[i];
        
        let sectionImageUrl = null;
        if (section.sectionImage) {
          setSuccess(`📤 Upload de l'image pour la section ${i + 1}...`);
          sectionImageUrl = await uploadImage(section.sectionImage, 'image');
        }

        const sectionData = {
          title: section.title.trim(),
          description: section.description.trim(),
          displayOrder: i + 1,
          image: sectionImageUrl || null
        };

        const sectionRes = await fetch(`${API_BASE}/competitions/${competitionId}/sections`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sectionData)
        });

        if (!sectionRes.ok) {
          const sectionError = await sectionRes.text();
          throw new Error(`Erreur création section ${i + 1}: ${sectionError}`);
        }

        const createdSection = await sectionRes.json();
        const sectionId = createdSection.id || createdSection._id || createdSection.data?.id;

        if (!sectionId) {
          throw new Error(`ID de section ${i + 1} non reçu de l'API`);
        }

        // 4️⃣ Traitement des candidats de la section
        const candidatePromises = section.candidates.map(async (candidate, cIndex) => {
          let candidateImageUrl = null;
          if (candidate.candidateImage) {
            setSuccess(`📤 Upload de la photo pour ${candidate.name || `candidat ${cIndex + 1}`}...`);
            candidateImageUrl = await uploadImage(candidate.candidateImage, 'image');
          }

          const candidateData = {
            name: candidate.name.trim(),
            bio: candidate.bio.trim(),
            profileImageUrl: candidateImageUrl || 'https://via.placeholder.com/150',
            sectionId: sectionId,
            metadata: {}
          };

          const candidateRes = await fetch(`${API_BASE}/competitions/${competitionId}/candidates`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(candidateData)
          });

          if (!candidateRes.ok) {
            const candidateError = await candidateRes.text();
            throw new Error(`Erreur création candidat ${candidate.name}: ${candidateError}`);
          }

          return candidateRes;
        });

        await Promise.all(candidatePromises);
      }


setCreatedCompetitionId(competitionId);
setEventCreated(true); 
setShowDraftPopup(true);
    } catch (error) {
      console.error('Erreur détaillée:', error);
      setError(`❌ ${error.message}`);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="template-color-1">
      <style>
        {`
          /* Couleur du texte dans les inputs et selects */
          .create-event-area input,
          .create-event-area textarea,
          .create-event-area select,
          .create-event-area .form-control,
          .create-event-area .no-nice-select {
            color: #065b83 !important;
          }
          
          /* Couleur du placeholder */
          .create-event-area input::placeholder,
          .create-event-area textarea::placeholder {
            color: #065b83 !important;
            opacity: 0.7;
          }
          
          /* Couleur du texte après sélection */
          .create-event-area select option {
            color: #065b83;
          }
          
          /* Supprimer le fond blanc des sections et de la confirmation */
          .create-event-area .step-content,
          .create-event-area .form-wrapper-one,
          .create-event-area .section-card,
          .create-event-area .candidate-card,
          .create-event-area .confirmation-card {
            background-color: transparent !important;
          }
          
          /* Bordures pour les cartes */
          .create-event-area .section-card,
          .create-event-area .candidate-card,
          .create-event-area .confirmation-card {
            border: 1px solid rgba(6, 91, 131, 0.2) !important;
          }
          
          /* Style pour les alertes de prix */
          .price-warning {
            border-color: #ffc107 !important;
          }
          
          /* Style spécifique pour la barre de progression */
          .rn-progress-bar .step.active {
            background-color: #065b83;
            color: white;
          }
          
          /* Assurer la visibilité du texte dans les inputs */
          .form-control:focus {
            color: #065b83 !important;
          }
          
          /* Style pour les messages d'erreur spécifiques */
          .error-message {
            background-color: rgba(220, 53, 69, 0.1);
            border-left: 4px solid #dc3545;
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
          }

        /* Styles pour le popup */
.draft-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(6, 91, 131, 0.95); /* Fond bleu semi-transparent */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px); /* Effet flou d'arrière-plan */
}

.draft-popup-content {
  background-color: rgba(255, 255, 255, 0.15); /* Fond blanc très transparent */
  border-radius: 15px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2); /* Bordure légère */
  backdrop-filter: blur(10px); /* Effet de verre dépoli */
  -webkit-backdrop-filter: blur(10px); /* Pour Safari */
}

.draft-popup-content h4 {
  color: white; /* Texte blanc pour contraster */
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.draft-popup-content .status-badge {
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  background-color: rgba(255, 193, 7, 0.9); /* Jaune avec transparence */
  color: #856404;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.draft-popup-content .event-details {
  background-color: rgba(255, 255, 255, 0.1); /* Fond très léger */
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.draft-popup-content .event-details p {
  margin-bottom: 8px;
  color: white; /* Texte blanc */
  font-weight: 500;
}

.draft-popup-content .event-details p strong {
  color: #cce7ff; /* Bleu clair pour les labels */
  font-weight: 600;
}

.draft-popup-content .text-muted {
  color: rgba(255, 255, 255, 0.8) !important; /* Texte gris clair */
}

.draft-popup-content .popup-buttons {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.draft-popup-content .popup-buttons button {
  flex: 1;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.draft-popup-content .popup-buttons button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.draft-popup-content .btn-primary-alta {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.draft-popup-content .btn-primary-alta:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.3);
}

.draft-popup-content .btn-primary {
  background-color: rgba(6, 91, 131, 0.8);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.draft-popup-content .btn-primary:hover:not(:disabled) {
  background-color: rgba(6, 91, 131, 0.9);
}

.draft-popup-content .btn-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
}

.draft-popup-content .btn-link:hover {
  color: white;
  text-decoration: underline;
}

.draft-popup-content .alert {
  background-color: rgba(220, 53, 69, 0.2);
  color: white;
  border-color: rgba(220, 53, 69, 0.5);
}

.draft-popup-content .alert-success {
  background-color: rgba(40, 167, 69, 0.2);
  color: white;
  border-color: rgba(40, 167, 69, 0.5);
}

.draft-popup-content .alert-warning {
  background-color: rgba(255, 193, 7, 0.2);
  color: white;
  border-color: rgba(255, 193, 7, 0.5);
}

@media (max-width: 576px) {
  .draft-popup-content .popup-buttons {
    flex-direction: column;
  }
  
  .draft-popup-content {
    padding: 20px;
  }
}

/* Animation d'apparition */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.draft-popup-overlay {
  animation: fadeIn 0.3s ease-out;
}

.draft-popup-content {
  animation: fadeIn 0.4s ease-out 0.1s both;
}
        `}
      </style>
      
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
            <div className="col-lg-10">
              
              <div className="rn-progress-bar mb-5">
                <div className="progress-steps">
                  <div className={`step ${step >= 1 ? 'active' : ''}`}>
                    <span>1</span>
                    <small>Informations</small>
                  </div>
                  <div className={`step ${step >= 2 ? 'active' : ''}`}>
                    <span>2</span>
                    <small>Sections</small>
                  </div>
                  <div className={`step ${step >= 3 ? 'active' : ''}`}>
                    <span>3</span>
                    <small>Confirmation</small>
                  </div>
                </div>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <div className="form-wrapper-one">
                <form onSubmit={(e) => e.preventDefault()}>
                  
                  {step === 1 && (
                    <div className="step-content">
                      <h4 className="mb-4" style={{color: '#065b83'}}>Informations de l'événement</h4>
                      
                      <div className="mb-4">
                        <label className="form-label" style={{color: '#065b83'}}>Titre de l'événement *</label>
                        <input 
                          type="text" 
                          name="title"
                          value={eventData.title}
                          onChange={handleInputChange}
                          placeholder="Ex: Élection du meilleur artiste 2024"
                          required
                          className="form-control"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label" style={{color: '#065b83'}}>Description complète *</label>
                        <textarea 
                          name="description"
                          value={eventData.description}
                          onChange={handleInputChange}
                          rows="4"
                          placeholder="Décrivez votre événement en détail..."
                          required
                          className="form-control"
                        ></textarea>
                      </div>

                      <div className="mb-4">
                        <label className="form-label" style={{color: '#065b83'}}>Description courte</label>
                        <input 
                          type="text" 
                          name="shortDescription"
                          value={eventData.shortDescription}
                          onChange={handleInputChange}
                          placeholder="Brève description (max 100 caractères)"
                          className="form-control"
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label" style={{color: '#065b83'}}>Catégorie *</label>
                            <select 
                              name="categoryId"
                              value={eventData.categoryId}
                              onChange={handleInputChange}
                              required
                              className="form-control no-nice-select"
                            >
                              <option value="">Sélectionnez une catégorie</option>
                              {categories.length === 0 ? (
                                <option value="" disabled>Chargement des catégories...</option>
                              ) : (
                                categories.map(cat => (
                                  <option key={cat.id || cat._id} value={cat.id || cat._id}>
                                    {cat.name || cat.title}
                                  </option>
                                ))
                              )}
                            </select>
                            {categories.length === 0 && !error && (
                              <div className="text-muted small mt-1">Aucune catégorie disponible</div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label" style={{color: '#065b83'}}>Prix du vote (FCFA) *</label>
                            <input 
                              type="number" 
                              name="votePrice"
                              value={eventData.votePrice}
                              onChange={handleInputChange}
                              min="0"
                              step="1"
                              required
                              className={`form-control ${priceWarning ? 'price-warning' : ''}`}
                            />
                            
                            {priceWarning && (
                              <div className="alert alert-warning mt-2 p-2">
                                <i className="fas fa-info-circle me-2"></i>
                                <strong>Note :</strong> 
                                {eventData.votePrice === 0 ? (
                                  <span> Le vote sera gratuit.</span>
                                ) : eventData.votePrice < 100 ? (
                                  <span> Le prix du vote est inférieur à 100 FCFA.</span>
                                ) : null}
                              </div>
                            )}
                            
                            {/* Message d'erreur spécifique pour prix = 0 */}
                            {eventData.votePrice === 0 && (
                              <div className="error-message mt-2">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                <strong>Attention :</strong>   Veuillez définir un prix supérieur à 0 FCFA.
                                Pour créer un vote gratuit, veuillez contacter notre equipe technique
                              </div>
                            )}
                            
                            {!priceWarning && eventData.votePrice >= 100 && (
                              <div className="text-muted small mt-1">
                                Prix par vote : {eventData.votePrice} FCFA
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label" style={{color: '#065b83'}}>Date de début *</label>
                            <input 
                              type="datetime-local" 
                              name="startDate"
                              value={eventData.startDate}
                              onChange={handleInputChange}
                              required
                              className={`form-control ${dateErrors.startDate ? 'is-invalid' : eventData.startDate ? 'is-valid' : ''}`}
                              min={getCurrentDateTimeLocal()}
                            />
                            {dateErrors.startDate && (
                              <div className="invalid-feedback">{dateErrors.startDate}</div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label" style={{color: '#065b83'}}>Date de fin *</label>
                            <input 
                              type="datetime-local" 
                              name="endDate"
                              value={eventData.endDate}
                              onChange={handleInputChange}
                              required
                              className={`form-control ${dateErrors.endDate ? 'is-invalid' : eventData.endDate && !dateErrors.endDate ? 'is-valid' : ''}`}
                              min={eventData.startDate || getCurrentDateTimeLocal()}
                            />
                            {dateErrors.endDate && (
                              <div className="invalid-feedback">{dateErrors.endDate}</div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label" style={{color: '#065b83'}}>Image de l'événement</label>
                        <div className="image-upload-container">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleEventImageChange}
                            className="form-control"
                          />
                          {eventData.eventImagePreview && (
                            <div className="image-preview mt-3">
                              <img 
                                src={eventData.eventImagePreview} 
                                alt="Aperçu de l'événement" 
                                className="img-fluid rounded"
                                style={{ maxHeight: '200px' }}
                              />
                              <small className="text-muted d-block mt-2">
                                {eventData.eventImage?.name}
                              </small>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-end">
                        <button type="button" className="btn btn-primary" onClick={nextStep}>
                          Suivant <i className="feather-arrow-right ms-2"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="step-content">
                      <h4 className="mb-4" style={{color: '#065b83'}}>Sections et Candidats</h4>
                      
                      {eventData.sections.map((section, sIndex) => (
                        <div key={sIndex} className="section-card mb-4 p-4 border rounded">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0" style={{color: '#065b83'}}>
                              Section {sIndex + 1} {sIndex === 0 && "(Principale)"}
                            </h5>
                            {eventData.sections.length > 1 && (
                              <button 
                                type="button" 
                                className="btn btn-danger btn-sm"
                                onClick={() => removeSection(sIndex)}
                              >
                                <i className="feather-trash-2"></i> Supprimer
                              </button>
                            )}
                          </div>

                          <div className="mb-4">
                            <label className="form-label" style={{color: '#065b83'}}>Titre de la section *</label>
                            <input 
                              type="text" 
                              value={section.title}
                              onChange={(e) => handleSectionChange(sIndex, 'title', e.target.value)}
                              placeholder={sIndex === 0 ? "Le titre de cette section sera automatiquement celui de la compétition" : "Ex: Catégorie Rap"}
                              required
                              className="form-control"
                            />
                            {sIndex === 0 && (
                              <small className="text-muted">
                                Cette section porte automatiquement le nom de la compétition. Vous pouvez la modifier si nécessaire.
                              </small>
                            )}
                          </div>

                          <div className="mb-4">
                            <label className="form-label" style={{color: '#065b83'}}>Description de la section</label>
                            <textarea 
                              value={section.description}
                              onChange={(e) => handleSectionChange(sIndex, 'description', e.target.value)}
                              rows="2"
                              placeholder="Description de cette section..."
                              className="form-control"
                            ></textarea>
                          </div>

                          <div className="mb-4">
                            <label className="form-label" style={{color: '#065b83'}}>Image de la section (optionnel)</label>
                            <div className="image-upload-container">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => handleSectionImageChange(e, sIndex)}
                                className="form-control"
                              />
                              {section.sectionImagePreview && (
                                <div className="image-preview mt-3">
                                  <img 
                                    src={section.sectionImagePreview} 
                                    alt={`Aperçu section ${sIndex + 1}`} 
                                    className="img-fluid rounded"
                                    style={{ maxHeight: '150px' }}
                                  />
                                  <small className="text-muted d-block mt-2">
                                    {section.sectionImage?.name}
                                  </small>
                                </div>
                              )}
                            </div>
                          </div>

                          <h6 className="mb-3" style={{color: '#065b83'}}>Candidats de cette section:</h6>
                          
                          {section.candidates.map((candidate, cIndex) => (
                            <div key={cIndex} className="candidate-card mb-3 p-3 border rounded">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="mb-0" style={{color: '#065b83'}}>Candidat {cIndex + 1}</h6>
                                {section.candidates.length > 1 && (
                                  <button 
                                    type="button" 
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeCandidate(sIndex, cIndex)}
                                  >
                                    <i className="feather-trash-2"></i>
                                  </button>
                                )}
                              </div>

                              <div className="row">
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label" style={{color: '#065b83'}}>Nom du candidat *</label>
                                    <input 
                                      type="text" 
                                      value={candidate.name}
                                      onChange={(e) => handleCandidateChange(sIndex, cIndex, 'name', e.target.value)}
                                      placeholder="Nom complet"
                                      required
                                      className="form-control"
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label" style={{color: '#065b83'}}>Photo du candidat</label>
                                    <div className="image-upload-container">
                                      <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => handleCandidateImageChange(e, sIndex, cIndex)}
                                        className="form-control"
                                      />
                                      {candidate.candidateImagePreview && (
                                        <div className="image-preview mt-2">
                                          <img 
                                            src={candidate.candidateImagePreview} 
                                            alt={`Aperçu ${candidate.name}`} 
                                            className="img-fluid rounded-circle"
                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                          />
                                          <small className="text-muted d-block mt-1">
                                            {candidate.candidateImage?.name}
                                          </small>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-3">
                                <label className="form-label" style={{color: '#065b83'}}>Biographie</label>
                                <textarea 
                                  value={candidate.bio}
                                  onChange={(e) => handleCandidateChange(sIndex, cIndex, 'bio', e.target.value)}
                                  rows="2"
                                  placeholder="Présentation du candidat..."
                                  className="form-control"
                                ></textarea>
                              </div>
                            </div>
                          ))}

                          <button 
                            type="button" 
                            className="btn btn-primary-alta mb-3"
                            onClick={() => addCandidate(sIndex)}
                          >
                            <i className="feather-plus me-2"></i>
                            Ajouter un candidat
                          </button>
                        </div>
                      ))}

                      <div className="mb-4">
                        <button type="button" className="btn btn-primary-alta" onClick={addSection}>
                          <i className="feather-plus me-2"></i>
                          Ajouter une section
                        </button>
                      </div>

                      <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-primary-alta" onClick={prevStep}>
                          <i className="feather-arrow-left me-2"></i>
                          Retour
                        </button>
                        <button type="button" className="btn btn-primary" onClick={nextStep}>
                          Suivant <i className="feather-arrow-right ms-2"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="step-content">
                      <h4 className="mb-4" style={{color: '#065b83'}}>Confirmation</h4>
                      
                      <div>
                        <h5 className="text-primary" style={{color: '#065b83'}}>{eventData.title}</h5>
                        <p className="text-muted">{eventData.description}</p>
                        
                        {eventData.eventImagePreview && (
                          <div className="mb-3">
                            <img 
                              src={eventData.eventImagePreview} 
                              alt="Aperçu événement" 
                              className="img-fluid rounded"
                              style={{ maxHeight: '200px' }}
                            />
                          </div>
                        )}
                        
                        <div className="row mt-4">
                          <div className="col-md-6">
                            <p><strong style={{color: '#065b83'}}>Catégorie:</strong> {
                              categories.find(cat => (cat.id || cat._id) == eventData.categoryId)?.name || 
                              categories.find(cat => (cat.id || cat._id) == eventData.categoryId)?.title || 
                              'Non spécifiée'
                            }</p>
                            <p><strong style={{color: '#065b83'}}>Prix du vote:</strong> 
                              {eventData.votePrice === 0 ? ' Gratuit' : ` ${eventData.votePrice} FCFA`}
                              {priceWarning && eventData.votePrice > 0 && eventData.votePrice < 100 && (
                                <span className="text-warning ms-2">(Prix inférieur à 100 FCFA)</span>
                              )}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p><strong style={{color: '#065b83'}}>Début:</strong> {new Date(eventData.startDate).toLocaleString()}</p>
                            <p><strong style={{color: '#065b83'}}>Fin:</strong> {new Date(eventData.endDate).toLocaleString()}</p>
                          </div>
                        </div>

                        <hr />
                        
                        <h6 style={{color: '#065b83'}}>Sections:</h6>
                        {eventData.sections.map((section, sIndex) => (
                          <div key={sIndex} className="mb-3">
                            <p className="mb-1">
                              <strong style={{color: '#065b83'}}>Section {sIndex + 1}:</strong> {section.title}
                              {sIndex === 0 && section.title === eventData.title && (
                                <span className="text-muted ms-2">(Section principale)</span>
                              )}
                            </p>
                            {section.sectionImagePreview && (
                              <div className="mt-2 mb-2">
                                <img 
                                  src={section.sectionImagePreview} 
                                  alt={`Aperçu section ${sIndex + 1}`}
                                  className="img-fluid rounded"
                                  style={{ maxHeight: '100px' }}
                                />
                              </div>
                            )}
                            <p className="small text-muted mb-1">Candidats: {section.candidates.length}</p>
                          </div>
                        ))}
                      </div>

                      <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-primary-alta" onClick={prevStep}>
                          <i className="feather-arrow-left me-2"></i>
                          Retour
                        </button>
                        
                        <div className="d-flex gap-3">
  {/* Bouton Enregistrer comme brouillon */}
  <button 
    type="button" 
    className="btn btn-secondary"
    onClick={() => handleSubmit('draft')}
   disabled={loading || uploading || showDraftPopup || eventCreated}
  >
    {loading || uploading ? (
      <>
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        {uploading ? 'Upload des images...' : 'Enregistrement...'}
      </>
    ) : (
      <>
        <i className="feather-save me-2"></i>
        {createdCompetitionId ? 'Événement déjà créé' : 'Enregistrer comme brouillon'}
      </>
    )}
  </button>
  
  {/* Bouton Soumettre à validation */}
  <button 
    type="button" 
    className="btn btn-primary"
    onClick={() => handleSubmit('submit')}
    disabled={loading || uploading || eventData.votePrice === 0 || showDraftPopup || createdCompetitionId}
  >
    {loading || uploading ? (
      <>
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        {uploading ? 'Upload des images...' : 'Soumission...'}
      </>
    ) : (
      <>
        <i className="feather-check-circle me-2"></i>
        {eventData.votePrice === 0 ? 'Vote gratuit non autorisé' : 
         createdCompetitionId ? 'Événement déjà créé' : 'Soumettre à validation'}
      </>
    )}
  </button>
</div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

    {/* Popup pour les brouillons */}
{showDraftPopup && (
  <div className="draft-popup-overlay">
    <div className="draft-popup-content">
      <h4>
        {originalAction === 'submit' 
          ? 'Événement Prêt à Être Soumis' 
          : 'Événement Enregistré comme Brouillon'
        }
      </h4>
      
      <div className="text-center mb-3">
        <span className="status-badge draft">
          {originalAction === 'submit' 
            ? 'PRÊT POUR SOUMISSION' 
            : 'STATUT: BROUILLON'
          }
        </span>
      </div>
      
      <div className="event-details">
        <p><strong>Titre:</strong> {eventData.title}</p>
        <p><strong>Catégorie:</strong> {
          categories.find(cat => (cat.id || cat._id) == eventData.categoryId)?.name || 
          categories.find(cat => (cat.id || cat._id) == eventData.categoryId)?.title || 
          'Non spécifiée'
        }</p>
        <p><strong>Prix du vote:</strong> {eventData.votePrice} FCFA</p>
        <p><strong>Date de début:</strong> {new Date(eventData.startDate).toLocaleString()}</p>
        <p><strong>Date de fin:</strong> {new Date(eventData.endDate).toLocaleString()}</p>
        <p><strong>Sections:</strong> {eventData.sections.length}</p>
        <p><strong>Candidats totaux:</strong> {
          eventData.sections.reduce((total, section) => total + section.candidates.length, 0)
        }</p>
      </div>
      
      <p className="text-muted text-center mb-4">
        {originalAction === 'submit'
          ? 'Votre événement a été enregistré. Vous pouvez le soumettre maintenant ou plus tard.'
          : 'Votre événement a été enregistré comme brouillon. Vous pouvez le soumettre maintenant ou plus tard.'
        }
      </p>
      
      {error && <div className="alert alert-danger mb-3">{error}</div>}
      
      <div className="popup-buttons">
        <button 
          type="button" 
          className="btn btn-primary-alta"
          onClick={closeAndRedirect}
          disabled={popupLoading}
        >
          <i className="feather-clock me-2"></i>
          Fermer ou soumettre plus tard
        </button>
        
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={submitDraftForApproval}
          disabled={popupLoading}
        >
          {popupLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Soumission...
            </>
          ) : (
            <>
              <i className="feather-check-circle me-2"></i>
              {originalAction === 'submit' ? 'Soumettre maintenant' : 'Soumettre à validation'}
            </>
          )}
        </button>
      </div>
      
      <div className="text-center mt-3">
        <button 
          type="button" 
          className="btn btn-link"
          onClick={closeAndRedirect}
          disabled={popupLoading}
        >
          Retourner à la liste des compétitions
        </button>
      </div>
    </div>
  </div>
)}
      <Footer />
    </div>
  );
};

export default CreateEvent;
