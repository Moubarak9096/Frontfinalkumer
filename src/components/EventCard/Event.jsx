import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import {
  FaArrowLeft, FaShareAlt, FaFilter, FaSearch,
  FaUsers, FaVoteYea, FaEye, FaSpinner, FaExclamationTriangle,
  FaSync, FaList, FaMedal, FaHeart, FaCalendar, FaTrophy,
  FaClock, FaExclamationCircle, FaRegCopy, FaChevronDown, FaLock,FaCheckCircle, FaMobileAlt, FaCreditCard,FaMapMarkerAlt, FaFolder
} from 'react-icons/fa';
import './Event.css';

const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

// Composant d'alerte personnalisé
const AlertModal = ({ isOpen, title, message, type = 'error', onClose }) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          bgColor: '#FEF2F2',
          borderColor: '#FECACA',
          textColor: '#991B1B',
          icon: '⚠️',
          title: 'Erreur'
        };
      case 'warning':
        return {
          bgColor: '#FFFBEB',
          borderColor: '#FDE68A',
          textColor: '#92400E',
          icon: '⚠️',
          title: 'Attention'
        };
      case 'success':
        return {
          bgColor: '#F0FDF4',
          borderColor: '#BBF7D0',
          textColor: '#166534',
          icon: '✅',
          title: 'Succès'
        };
      default:
        return {
          bgColor: '#FEF2F2',
          borderColor: '#FECACA',
          textColor: '#991B1B',
          icon: '⚠️',
          title: 'Erreur'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="modal-overlay">
      <div 
        className="alert-modal"
        style={{
          backgroundColor: styles.bgColor,
          borderColor: styles.borderColor,
          color: styles.textColor
        }}
      >
        <div className="alert-header">
          <div className="alert-icon">{styles.icon}</div>
          <div className="alert-title">
            <h3>{title || styles.title}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="alert-close-btn"
            style={{ color: styles.textColor }}
          >
            ×
          </button>
        </div>
        
        <div className="alert-body">
          <p>{message}</p>
        </div>
        
        <div className="alert-footer">
          <button 
            onClick={onClose}
            className="alert-ok-btn"
            style={{
              backgroundColor: styles.textColor,
              color: 'white'
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const Event = () => {
  
  const { competitionId } = useParams();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('loading');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('votes');
  const [showRules, setShowRules] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Toutes catégories');
  const [categories, setCategories] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    candidateId: '',
    amount: 500, // Valeur par défaut
    paymentProvider: 'eretupay',
    paymentMethod: 'mobile_money',
    phoneNumber: '',
    network: 'tmoney',
    country: 'TG',
    guestName: '',
    guestEmail: '',
    guestPhone: ''
  });
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  
  // Ajout de l'état pour l'alerte
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Fonction pour déterminer le statut de l'événement
  const determineEventStatus = (startDate, endDate) => {
    if (!startDate || !endDate) return 'ended';
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now > end) {
      return 'ended';
    } else if (now >= start && now <= end) {
      return 'active';
    } else if (now < start) {
      return 'upcoming';
    }
    return 'ended';
  };

  // Charger les catégories depuis l'API
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.map(cat => cat.name));
      }
    } catch (err) {
      console.error('Erreur chargement catégories:', err);
    }
  };

  // Charger les statistiques publiques de la compétition
  const fetchPublicStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/public-statistics`);
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      }
    } catch (err) {
      console.error('Erreur chargement statistiques:', err);
    }
  };


  const handlePaymentSubmit = async (e) => {
  e.preventDefault();
  
  try {
    setProcessingPayment(true);
    
    // Préparer les données pour l'API
    const paymentData = {
      ...paymentForm,
      candidateId: selectedCandidate?.id,
      // S'assurer que le phoneNumber est au bon format
      phoneNumber: paymentForm.phoneNumber.replace(/\s+/g, ''),
      guestPhone: paymentForm.guestPhone.replace(/\s+/g, ''),
      // Vous pouvez ajouter d'autres informations si nécessaire
      competitionId: competitionId
    };
    
    console.log('Envoi du paiement:', paymentData);
    
    // Appeler l'endpoint de paiement
    const response = await fetch(`${API_BASE_URL}/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Réponse du paiement:', result);
    
    // Stocker le résultat
    setPaymentResult(result);
    
    // Mettre à jour les votes du candidat localement
    if (result.votesGranted && result.votesGranted.length > 0) {
      const voteInfo = result.votesGranted[0];
      setCandidates(prevCandidates => 
        prevCandidates.map(candidate => 
          candidate.id === voteInfo.candidateId 
            ? { ...candidate, totalVotes: voteInfo.newTotal }
            : candidate
        )
      );
    }
    
  } catch (err) {
    console.error('Erreur de paiement:', err);
    setAlertMessage(`Erreur lors du paiement: ${err.message}`);
    setShowAlertModal(true);
  } finally {
    setProcessingPayment(false);
  }
};
  // Fonction pour charger les détails de la compétition
  const fetchCompetitionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger les catégories
      await fetchCategories();
      
      const compResponse = await fetch(`${API_BASE_URL}/competitions/${competitionId}`);
      
      if (!compResponse.ok) {
        throw new Error(`Erreur HTTP ${compResponse.status}`);
      }
      
      const competitionData = await compResponse.json();
      
      // Déterminer le statut
      const eventStatus = determineEventStatus(
        competitionData.startDate,
        competitionData.endDate
      );
      setStatus(eventStatus);
      
      setCompetition(competitionData);
      
      // Charger les statistiques publiques
      await fetchPublicStatistics();
      
      // Extraire les sections depuis la réponse
      let sectionsData = [];
      if (competitionData.sections && Array.isArray(competitionData.sections)) {
        sectionsData = competitionData.sections;
      } else {
        // Si pas de sections dans la réponse, essayer d'en charger
        try {
          const sectionsResponse = await fetch(`${API_BASE_URL}/competitions/${competitionId}/sections`);
          if (sectionsResponse.ok) {
            sectionsData = await sectionsResponse.json();
          }
        } catch (err) {
          console.warn('Erreur chargement sections:', err);
        }
      }
      
      // Normaliser les sections
      const normalizedSections = sectionsData.map((section, index) => ({
        id: section.id || `section-${index}`,
        title: section.title || `Section ${index + 1}`,
        description: section.description || '',
        coverImageUrl: section.coverImageUrl || null,
        displayOrder: section.displayOrder || index + 1,
      }));
      
      setSections(normalizedSections);
      
      // Sélectionner la première section par défaut
      if (normalizedSections.length > 0) {
        const firstSection = normalizedSections[0];
        setSelectedSection(firstSection);
        await fetchCandidatesForSection(firstSection);
      }
      
    } catch (err) {
      console.error('Erreur détaillée:', err);
      setError('Impossible de charger les détails de la compétition');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour charger les candidats d'une section
  const fetchCandidatesForSection = async (section) => {
    try {
      setLoadingCandidates(true);
      setCandidates([]);
      
      let candidatesData = [];
      
      // Essayer de charger les candidats depuis l'API
      const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/candidates`);
      
      if (response.ok) {
        const responseData = await response.json();
        
        // Extraire les candidats selon la structure de la réponse
        if (Array.isArray(responseData)) {
          candidatesData = responseData;
        } else if (responseData?.data && Array.isArray(responseData.data)) {
          candidatesData = responseData.data;
        } else if (responseData?.candidates && Array.isArray(responseData.candidates)) {
          candidatesData = responseData.candidates;
        }
        
        // Filtrer par section si une section est spécifique
        if (section.id && section.id !== 'default-section') {
          candidatesData = candidatesData.filter(candidate => 
            candidate.sectionId === section.id || 
            candidate.section?.id === section.id
          );
        }
        
        // Si pas de candidats filtrés, essayer de charger directement pour la section
        if (candidatesData.length === 0) {
          const sectionResponse = await fetch(`${API_BASE_URL}/competitions/${competitionId}/sections/${section.id}/candidates`);
          if (sectionResponse.ok) {
            const sectionData = await sectionResponse.json();
            if (Array.isArray(sectionData)) {
              candidatesData = sectionData;
            }
          }
        }
        
        // Trier les candidats selon le critère choisi
        const sortedCandidates = sortCandidates(candidatesData, sortBy);
        setCandidates(sortedCandidates);
      }
      
    } catch (err) {
      console.error('Erreur candidats:', err);
      setCandidates([]);
    } finally {
      setLoadingCandidates(false);
    }
  };

  // Fonction pour trier les candidats
  const sortCandidates = (candidates, sortCriteria) => {
    const sorted = [...candidates];
    
    switch (sortCriteria) {
      case 'votes':
        return sorted.sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0));
      case 'name':
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'number':
        return sorted.sort((a, b) => (a.candidateNumber || 0) - (b.candidateNumber || 0));
      default:
        return sorted;
    }
  };

  const handleSectionSelect = async (section) => {
    setSelectedSection(section);
    await fetchCandidatesForSection(section);
  };

  const handleSortChange = (criteria) => {
    setSortBy(criteria);
    const sorted = sortCandidates(candidates, criteria);
    setCandidates(sorted);
  };

  const handleViewProfile = (candidate) => {
    setSelectedCandidate(candidate);
  };

  // Effet pour vérifier régulièrement le statut de l'événement
  useEffect(() => {
    const checkStatus = () => {
      if (competition?.startDate && competition?.endDate) {
        const eventStatus = determineEventStatus(
          competition.startDate,
          competition.endDate
        );
        setStatus(eventStatus);
      }
    };

    checkStatus();
    
    const interval = setInterval(checkStatus, 60000);
    
    return () => clearInterval(interval);
  }, [competition]);

  useEffect(() => {
    if (competitionId) {
      fetchCompetitionDetails();
    }
  }, [competitionId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Date invalide';
    }
  };

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const getTimeRemainingDisplay = () => {
    if (!competition?.endDate) return "Terminé";
    
    const eventStatus = determineEventStatus(
      competition.startDate,
      competition.endDate
    );
    
    if (eventStatus === 'ended') return "Terminé";
    if (eventStatus === 'upcoming') return " A Bientôt";
    
    const end = new Date(competition.endDate);
    const now = new Date();
    const diff = end - now;
    
    if (diff <= 0) return "Terminé";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}j ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes} minutes`;
    }
  };

  // Fonction pour obtenir le prix par vote
  const getPricePerVote = () => {
    if (!competition) return 2.50;
    
    if (competition.votePrice !== undefined && competition.votePrice !== null) {
      const price = parseFloat(competition.votePrice);
      return isNaN(price) ? 2.50 : price;
    }
    
    const possiblePriceFields = [
      competition.pricePerVote,
      competition.vote_cost,
      competition.voteCost,
      competition.price,
      competition.cost
    ];
    
    for (const field of possiblePriceFields) {
      if (field !== undefined && field !== null) {
        const price = parseFloat(field);
        if (!isNaN(price)) {
          return price;
        }
      }
    }
    
    return 2.50;
  };

  // Filtrer les candidats par recherche ET catégorie
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Toutes catégories' || 
      candidate.section?.title === selectedCategory ||
      candidate.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Votez pour votre candidat préféré au ${competition?.title || 'Festival'}!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: competition?.title || 'Vote Compétition',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Erreur de partage:', err);
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setAlertMessage('Lien copié dans le presse-papier!');
      setShowAlertModal(true);
    });
  };

  const handleVote = (candidateId) => {
    navigate(`/vote/${candidateId}?competition=${competitionId}`);
  };

  if (loading && !competition) {
    return (
      <div className="template-color-1 festival-theme" style={{ minHeight: '100vh' }}>
        <Header />
        <div className="festival-loading text-center py-5" style={{ minHeight: '60vh' }}>
          <div className="festival-spinner mb-4"></div>
          <h3 className="festival-text mb-3">Chargement de la compétition...</h3>
          <p className="festival-subtext">Préparation des données</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="template-color-1 festival-theme" style={{ minHeight: '100vh' }}>
        <Header />
        <div className="container py-5">
          <div className="festival-error-card p-5 text-center">
            <FaExclamationTriangle className="festival-error-icon mb-4" />
            <h3 className="festival-text mb-3">Erreur de chargement</h3>
            <p className="festival-subtext mb-4">{error}</p>
            <div className="d-flex justify-content-center gap-3">
              <button 
                className="festival-btn festival-btn-secondary"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft className="me-2" />
                Retour
              </button>
              <button 
                className="festival-btn festival-btn-primary"
                onClick={fetchCompetitionDetails}
              >
                <FaSync className="me-2" />
                Réessayer
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const timeRemainingDisplay = getTimeRemainingDisplay();
  const isEventActive = status === 'active';
  const totalCandidates = candidates.length;
  const totalVotes = statistics?.statistics?.totalVotes || competition?.totalVotes || 0;
  const totalParticipants = statistics?.statistics?.totalParticipants || 0;
  const pricePerVote = getPricePerVote();

  // Statistiques à afficher avec couleurs différentes
  const stats = [
    { 
      value: formatNumber(totalVotes), 
      label: "Voies totaux",
      color: '#4a69bd',
      icon: <FaTrophy />
    },
    { 
      value: totalCandidates, 
      label: "Candidats",
      color: '#fad390',
      icon: <FaUsers />
    },
    { 
      value: formatNumber(totalParticipants), 
      label: "Votants actifs",
      color: '#78e08f',
      icon: <FaVoteYea />
    },
    { 
      value: `FCFA${pricePerVote.toFixed(2)}`, 
      label: "Prix par voie",
      color: '#e55039',
      icon: <FaMedal />
    },
  ];

  return (
    <div className="festival-theme" style={{ minHeight: '100vh' }}>
      <Header />
      
      {/* Alert Modal */}
      <AlertModal
        isOpen={showAlertModal}
        title="Événement non disponible"
        message={alertMessage}
        type="error"
        onClose={() => setShowAlertModal(false)}
      />
      
      {/* Image de fond */}
      {competition?.coverImageUrl && (
        <div className="festival-background-image">
          <img 
            src={competition.coverImageUrl} 
            alt={competition.title}
            className="festival-bg-image"
          />
          <div className="festival-bg-overlay"></div>
        </div>
      )}
      
      {/* Contenu principal */}
      <div className="festival-container">
        {/* En-tête du festival */}
        <header className="festival-header">
          <div className="container">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <button 
                className="festival-back-btn"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft className="me-2" />
                Retour
              </button>
              
              {!isEventActive && (
                <span className="festival-status-badge">
                  <FaExclamationCircle className="me-2" />
                  ÉVÉNEMENT TERMINÉ
                </span>
              )}
            </div>
            
            <h1 className="festival-title">
              {competition?.title || "Compétition"}
            </h1>
            
            <p className="festival-subtitle">
              {competition?.description || competition?.shortDescription || "Votez pour votre favori dans cette compétition."}
            </p>
          </div>
        </header>

        {/* Statistiques */}
        <div className="container">
          <div className="festival-stats">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="festival-stat-card"
                style={{ 
                  background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                  borderColor: `${stat.color}40`
                }}
              >
                <div className="festival-stat-icon" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="festival-stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="festival-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="festival-content">
          <div className="container">
            {/* Temps restant et actions */}
            <div className="festival-top-section">
              <div className="festival-time-section">
                <h3>Temps restant</h3>
                <div className={`festival-time-display ${timeRemainingDisplay === "Terminé" ? "festival-time-finished" : ""}`}>
                  {timeRemainingDisplay}
                </div>
              </div>

              <div className="festival-action-buttons">
                <button className="festival-btn festival-btn-share" onClick={handleShare}>
                  <FaShareAlt className="me-2" />
                  Partager
                </button>
                <button 
                  className="festival-btn festival-btn-rules" 
                  onClick={() => setShowRules(true)}
                >
                  Règlement
                </button>
              </div>
            </div>

            {/* Filtres : Catégories et Sections */}
            <div className="festival-filters-section">
              <h3>Plus de votes</h3>
              
              <div className="festival-filters-grid">
              
                {/* Filtre par section */}
               <div className="festival-sections-container">
  <h3>Sections disponibles</h3>
  
  <div className="sections-buttons-grid">
    {/* Bouton pour toutes les sections */}
    <button
      className={`section-button ${!selectedSection ? 'active' : ''}`}
      onClick={() => handleSectionSelect(null)}
    >
      <FaList className="me-2" />
      Toutes les sections
      <span className="section-count">{sections.length}</span>
    </button>

    {/* Boutons pour chaque section */}
    {sections.length > 0 ? (
      sections.map((section) => (
        <button
          key={section.id}
          className={`section-button ${selectedSection?.id === section.id ? 'active' : ''}`}
          onClick={() => handleSectionSelect(section)}
        >
          <FaFolder className="me-2" />
          {section.title}
          <span className="section-count">
            {/* Afficher le nombre de candidats dans cette section */}
            {candidates.filter(c => c.sectionId === section.id).length}
          </span>
        </button>
      ))
    ) : (
      <div className="no-sections-message">
        <FaExclamationCircle className="me-2" />
        Aucune section disponible
      </div>
    )}
  </div>
</div>                  
                  
              </div>
                <input
                      type="text"
                      className="festival-search-input"
                      placeholder="Rechercher un candidat..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={candidates.length === 0}
                    />
            </div>

            {/* Liste des candidats */}
      <div className="festival-candidates-section">
  <div className="festival-candidates-header">
    <h2>
      {selectedSection ? `${selectedSection.title}` : "Candidats en compétition"}
      {selectedCategory !== 'Toutes catégories' && ` - ${selectedCategory}`}
    </h2>
    
    <div className="festival-candidates-meta">
      <span className="festival-candidates-count">
        {filteredCandidates.length} candidat{filteredCandidates.length !== 1 ? 's' : ''}
      </span>
    </div>
  </div>

  {selectedSection ? (
    loadingCandidates ? (
      <div className="festival-loading-candidates">
        <FaSpinner className="festival-spinner" />
        <p>Chargement des candidats...</p>
      </div>
    ) : candidates.length === 0 ? (
      <div className="festival-no-candidates">
        <FaUsers className="festival-no-candidates-icon" />
        <h4>Aucun candidat dans cette section</h4>
        <p className="festival-subtext">
          Cette section ne contient aucun candidat pour le moment.
        </p>
      </div>
    ) : filteredCandidates.length === 0 ? (
      <div className="festival-no-candidates">
        <FaSearch className="festival-no-candidates-icon" />
        <h4>Aucun candidat trouvé</h4>
        <p className="festival-subtext">
          Aucun candidat ne correspond à vos critères de recherche.
        </p>
      </div>
    ) : (
      <div className="festival-artists-grid">
        {filteredCandidates.map((candidate, index) => (
          <div 
            key={candidate.id} 
            className="festival-artist-card"
            onClick={() => handleViewProfile(candidate)}
          >
            {/* Médaille pour les 3 premiers */}
            {index < 3 && candidate.totalVotes && candidate.totalVotes > 0 && (
              <div className={`festival-artist-medal festival-medal-${index + 1}`}>
                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
              </div>
            )}
            
            {/* Numéro du candidat */}
            <div className="festival-artist-number-badge">
              #{candidate.candidateNumber || index + 1}
            </div>
            
            {/* Avatar du candidat - AGRANDI */}
            <div className="festival-artist-avatar-large">
              {candidate.profileImageUrl ? (
                <img 
                  src={candidate.profileImageUrl} 
                  alt={candidate.name}
                  className="festival-artist-img-large"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="festival-artist-img-placeholder-large" 
                style={{ display: candidate.profileImageUrl ? 'none' : 'flex' }}
              >
                {candidate.name?.[0] || 'C'}
              </div>
            </div>
            
            {/* Informations du candidat */}
            <div className="festival-artist-info">
              <h4 className="festival-artist-name">
                {candidate.name}
              </h4>
              <p className="festival-artist-category">
                {candidate.section?.title || selectedSection.title}
              </p>
              
              {candidate.location && (
                <div className="festival-artist-location">
                  <FaMapMarkerAlt className="festival-location-icon" />
                  <span>{candidate.location}</span>
                </div>
              )}
              
              {candidate.bio && (
                <p className="festival-artist-bio">
                  {candidate.bio.length > 100 ? `${candidate.bio.substring(0, 100)}...` : candidate.bio}
                </p>
              )}
              
              <div className="festival-artist-stats">
                <div className="festival-artist-votes">
                  <FaTrophy className="festival-artist-stat-icon" />
                  <span>
                    {formatNumber(candidate.totalVotes || 0)} votes
                  </span>
                </div>
                
                {/* Progression - ajouté comme sur l'image */}
                <div className="festival-artist-progress">
                  <div className="festival-progress-label">
                    <span>Progression</span>
                    <span>0.0%</span>
                  </div>
                </div>
              </div>
              
              <div className="festival-artist-actions">
                <button 
                  className="festival-btn festival-btn-vote"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProfile(candidate);
                  }}
                >
                  <FaVoteYea className="me-2" />
                  Voter
                </button>
                
                <div className="festival-artist-secondary-actions">
                  <button 
                    className="festival-btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                    title="Partager"
                  >
                    <FaShareAlt />
                  </button>
                  <button 
                    className="festival-btn-icon festival-btn-favorite"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProfile(candidate);
                    }}
                    title="Voir le profil"
                  >
                    <FaEye />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  ) : sections.length > 0 ? (
    <div className="festival-select-section">
      <FaList className="festival-select-icon" />
      <h4>Sélectionnez une section</h4>
      <p className="festival-subtext">Veuillez choisir une section pour voir les candidats</p>
      <button 
        className="festival-btn festival-btn-primary"
        onClick={() => handleSectionSelect(sections[0])}
      >
        Voir tous les candidats
      </button>
    </div>
  ) : (
    <div className="festival-select-section">
      <FaExclamationTriangle className="festival-select-icon" />
      <h4>Aucune section disponible</h4>
      <p className="festival-subtext">Cette compétition ne contient aucune section pour le moment.</p>
    </div>
  )}
</div>
          </div>
        </div>
      </div>

      {/* Modal Règlement */}
      {showRules && (
        <div className="festival-modal-overlay" onClick={() => setShowRules(false)}>
          <div className="festival-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="festival-modal-header">
              <h3>Règlement de la compétition</h3>
              <button className="festival-modal-close" onClick={() => setShowRules(false)}>
                ×
              </button>
            </div>
            <div className="festival-modal-body">
              <h4>Règles de participation :</h4>
              <ol>
                <li>Chaque vote coûte {pricePerVote.toFixed(2)}FCFA</li>
                <li>Un seul vote par personne et par candidat est autorisé</li>
                <li>Le vote est ouvert jusqu'à la date de clôture indiquée</li>
                <li>Les résultats seront annoncés à la fin de la compétition</li>
                <li>Toute tentative de fraude entraînera la disqualification</li>
                <li>Les décisions du jury sont finales et sans appel</li>
              </ol>
              
              <div className="festival-modal-footer">
                <button 
                  className="festival-btn festival-btn-primary"
                  onClick={() => setShowRules(false)}
                >
                  J'ai compris
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de profil du candidat */}
      {selectedCandidate && (
        <div className="festival-profile-modal-overlay" onClick={() => setSelectedCandidate(null)}>
          <div className="festival-profile-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="festival-profile-modal-header">
              <h3>Profil du candidat</h3>
              <button 
                className="festival-profile-modal-close"
                onClick={() => setSelectedCandidate(null)}
              >
                ×
              </button>
            </div>
            
            <div className="festival-profile-modal-body">
              <div className="festival-profile-modal-avatar">
                {selectedCandidate.profileImageUrl ? (
                  <img 
                    src={selectedCandidate.profileImageUrl} 
                    alt={selectedCandidate.name}
                    className="festival-profile-modal-img"
                  />
                ) : (
                  <div className="festival-profile-modal-img-placeholder">
                    {selectedCandidate.name?.[0] || 'C'}
                  </div>
                )}
                <div className="festival-profile-modal-number">
                  #{selectedCandidate.candidateNumber || 'N/A'}
                </div>
              </div>
              
              <div className="festival-profile-modal-info">
                <h4 className="festival-profile-modal-name">{selectedCandidate.name}</h4>
                <p className="festival-profile-modal-section">
                  Section: {selectedCandidate.section?.title || selectedSection?.title || 'Non spécifiée'}
                </p>
                
                {selectedCandidate.bio && (
                  <div className="festival-profile-modal-bio-section">
                    <h5>Biographie</h5>
                    <p className="festival-profile-modal-bio">{selectedCandidate.bio}</p>
                  </div>
                )}
                
                <div className="festival-profile-modal-stats">
                  <div className="festival-profile-stat">
                    <FaTrophy className="festival-profile-stat-icon" />
                    <div>
                      <div className="festival-profile-stat-value">
                        {formatNumber(selectedCandidate.totalVotes || 0)}
                      </div>
                      <div className="festival-profile-stat-label">Votes totaux</div>
                    </div>
                  </div>
                  
                  {selectedCandidate.currentRank && (
                    <div className="festival-profile-stat">
                      <FaMedal className="festival-profile-stat-icon" />
                      <div>
                        <div className="festival-profile-stat-value">
                          #{selectedCandidate.currentRank}
                        </div>
                        <div className="festival-profile-stat-label">Classement</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {selectedCandidate.metadata && (
                  <div className="festival-profile-modal-metadata">
                    <h5>Informations supplémentaires</h5>
                    <div className="festival-profile-metadata-grid">
                      {selectedCandidate.metadata.age && (
                        <div className="festival-metadata-item">
                          <span className="festival-metadata-label">Âge:</span>
                          <span className="festival-metadata-value">{selectedCandidate.metadata.age} ans</span>
                        </div>
                      )}
                      {selectedCandidate.metadata.city && (
                        <div className="festival-metadata-item">
                          <span className="festival-metadata-label">Ville:</span>
                          <span className="festival-metadata-value">{selectedCandidate.metadata.city}</span>
                        </div>
                      )}
                      {/* Ajoutez d'autres champs metadata si nécessaire */}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="festival-profile-modal-footer">
              <button 
                className="festival-btn festival-btn-secondary"
                onClick={() => setSelectedCandidate(null)}
              >
                Fermer
              </button>
{/* Dans le modal de profil, modifiez le bouton Voter */}
<button 
  className="festival-btn festival-btn-primary"
  onClick={() => {
    if (!isEventActive) {
      setAlertMessage("Le vote n'est actuellement pas disponible. L'événement est terminé ou n'a pas encore commencé.");
      setShowAlertModal(true);
      return;
    }
    
    // Fermer le modal de profil d'abord
    setSelectedCandidate(null);
    // Puis ouvrir le modal de paiement
    setPaymentForm(prev => ({
      ...prev,
      candidateId: selectedCandidate.id,
      amount: 500 
    }));
    setShowPaymentModal(true);
  }}
>
  <FaVoteYea className="me-2" />
  {!isEventActive ? "Vote non disponible" : "Voter pour ce candidat"}
</button>
            </div>
          </div>
          
        </div>
      )}
      



      {/* Modal de paiement */}
{showPaymentModal && (
  <div className="festival-payment-modal-overlay" onClick={() => setShowPaymentModal(false)}>
    <div className="festival-payment-modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="festival-payment-modal-header">
        <h3>Paiement pour voter</h3>
        <button 
          className="festival-payment-modal-close"
          onClick={() => setShowPaymentModal(false)}
        >
          ×
        </button>
      </div>
      
      <div className="festival-payment-modal-body">
        {paymentResult ? (
          // Affichage du résultat du paiement
          <div className="payment-result">
            <div className={`payment-result-icon ${paymentResult.status === 'PROCESSING' ? 'processing' : 'success'}`}>
              {paymentResult.status === 'PROCESSING' ? <FaSpinner className="fa-spin" /> : <FaCheckCircle />}
            </div>
            <h4>{paymentResult.message}</h4>
            
            {paymentResult.transaction && (
              <div className="transaction-details">
                <h5>Détails de la transaction</h5>
                <div className="transaction-info">
                  <div className="info-row">
                    <span className="info-label">ID Transaction:</span>
                    <span className="info-value">{paymentResult.transaction.id}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Montant:</span>
                    <span className="info-value">{paymentResult.transaction.amount} {paymentResult.transaction.currency}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Statut:</span>
                    <span className="info-value">{paymentResult.transaction.status}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Méthode:</span>
                    <span className="info-value">{paymentResult.transaction.paymentMethod}</span>
                  </div>
                </div>
              </div>
            )}
            
            {paymentResult.votesGranted && paymentResult.votesGranted.length > 0 && (
              <div className="votes-granted">
                <h5>Votes accordés</h5>
                {paymentResult.votesGranted.map((vote, index) => (
                  <div key={index} className="vote-info">
                    <div className="vote-candidate">{vote.candidateName}</div>
                    <div className="vote-count">{vote.voteCount} vote(s)</div>
                    <div className="vote-total">Total: {vote.newTotal}</div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="payment-modal-footer">
              <button 
                className="festival-btn festival-btn-primary"
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedCandidate(null); // Fermer aussi le modal de profil
                }}
              >
                Terminer
              </button>
            </div>
          </div>
        ) : (
          // Formulaire de paiement
          <form onSubmit={handlePaymentSubmit}>
  <div className="payment-form-section">
    <h4>Informations de paiement</h4>
    
    {/* Informations sur le candidat */}
    {selectedCandidate && (
      <div className="candidate-info-summary">
        <h5>Vous votez pour :</h5>
        <div className="candidate-summary">
          <div className="candidate-avatar-small">
            {selectedCandidate.profileImageUrl ? (
              <img 
                src={selectedCandidate.profileImageUrl} 
                alt={selectedCandidate.name}
                className="candidate-summary-img"
              />
            ) : (
              <div className="candidate-summary-placeholder">
                {selectedCandidate.name?.[0] || 'C'}
              </div>
            )}
          </div>
          <div className="candidate-summary-details">
            <strong>{selectedCandidate.name}</strong>
            <small>{selectedCandidate.section?.title || selectedSection?.title || 'Candidat'}</small>
          </div>
        </div>
      </div>
    )}
    
    {/* Prix par vote */}
    <div className="price-info">
      <div className="price-per-vote">
        <FaVoteYea className="price-icon" />
        <span>Prix par vote : <strong>{pricePerVote.toFixed(2)} XOF</strong></span>
      </div>
    </div>
    
    <div className="form-group">
      <label>Nombre de votes (maximum 10)</label>
      <div className="vote-count-control">
        <input
          type="number"
          min="1"
          max="10"
          value={paymentForm.voteCount || 1}
          onChange={(e) => {
            const voteCount = Math.min(10, Math.max(1, parseInt(e.target.value) || 1));
            const totalAmount = voteCount * pricePerVote;
            
            setPaymentForm(prev => ({
              ...prev,
              voteCount: voteCount,
              amount: totalAmount
            }));
          }}
          className="form-control"
        />
        <span className="vote-count-note">Maximum 10 votes par transaction</span>
      </div>
      
      <div className="amount-display">
        <div className="amount-details">
          <span>{paymentForm.voteCount || 1} vote(s) × {pricePerVote.toFixed(2)} XOF =</span>
          <strong>{(paymentForm.voteCount || 1) * pricePerVote} XOF</strong>
        </div>
      </div>
    </div>
    
    {/* Mode de paiement */}
    <div className="form-group">
      <label>Mode de paiement</label>
      <div className="payment-methods">
        <div className={`payment-method-option ${paymentForm.paymentMethod === 'mobile_money' ? 'selected' : ''}`}
             onClick={() => setPaymentForm(prev => ({ ...prev, paymentMethod: 'mobile_money' }))}>
          <div className="payment-method-icon">
            <FaMobileAlt />
          </div>
          <div className="payment-method-info">
            <span className="payment-method-name">Mobile Money</span>
            <span className="payment-method-desc">T-Money, Flooz, Moov Money</span>
          </div>
        </div>
        
        <div className={`payment-method-option ${paymentForm.paymentMethod === 'credit_card' ? 'selected' : ''}`}
             onClick={() => setPaymentForm(prev => ({ ...prev, paymentMethod: 'credit_card' }))}>
          <div className="payment-method-icon">
            <FaCreditCard />
          </div>
          <div className="payment-method-info">
            <span className="payment-method-name">Carte de crédit</span>
            <span className="payment-method-desc">Visa, Mastercard</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Champs pour Mobile Money */}
    {paymentForm.paymentMethod === 'mobile_money' && (
      <div className="mobile-money-section">
        <div className="form-group">
          <label>Réseau mobile</label>
          <select
            value={paymentForm.network}
            onChange={(e) => setPaymentForm(prev => ({ ...prev, network: e.target.value }))}
            className="form-control"
            required
          >
            <option value="">Sélectionnez votre réseau</option>
            <option value="tmoney">T-Money (Togo)</option>
            <option value="moov">Moov Money (Togo)</option>
            <option value="flooz">Flooz (Bénin)</option>
            <option value="orange">Orange Money</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Numéro de téléphone</label>
          <input
            type="tel"
            value={paymentForm.phoneNumber}
            onChange={(e) => setPaymentForm(prev => ({ 
              ...prev, 
              phoneNumber: e.target.value,
              guestPhone: e.target.value // Mettre à jour aussi le téléphone invité
            }))}
            placeholder="+22890123456"
            className="form-control"
            required
          />
          <small className="form-text text-muted">
            Vous recevrez une demande de paiement sur ce numéro
          </small>
        </div>
      </div>
    )}
    
    {/* Informations personnelles */}
    <div className="personal-info-section">
      <h5>Vos informations</h5>
      
      <div className="form-group">
        <label>Nom complet *</label>
        <input
          type="text"
          value={paymentForm.guestName}
          onChange={(e) => setPaymentForm(prev => ({ ...prev, guestName: e.target.value }))}
          placeholder="Votre nom complet"
          className="form-control"
          required
        />
      </div>
      
      <div className="form-group">
        <label>Adresse email *</label>
        <input
          type="email"
          value={paymentForm.guestEmail}
          onChange={(e) => setPaymentForm(prev => ({ ...prev, guestEmail: e.target.value }))}
          placeholder="votre@email.com"
          className="form-control"
          required
        />
      </div>
      
      {paymentForm.paymentMethod !== 'mobile_money' && (
        <div className="form-group">
          <label>Numéro de téléphone *</label>
          <input
            type="tel"
            value={paymentForm.guestPhone}
            onChange={(e) => setPaymentForm(prev => ({ ...prev, guestPhone: e.target.value }))}
            placeholder="+22890123456"
            className="form-control"
            required
          />
        </div>
      )}
    </div>
    
    {/* Informations de sécurité */}
    <div className="payment-security-info">
      <div className="security-badge">
        <FaLock className="security-icon" />
        <span>Paiement 100% sécurisé</span>
      </div>
      <small className="security-details">
        Vos informations sont cryptées et protégées. Aucun paiement ne sera effectué sans votre confirmation.
      </small>
    </div>
    
    {/* Boutons d'action */}
    <div className="payment-modal-footer">
      <button 
        type="button"
        className="festival-btn festival-btn-secondary"
        onClick={() => {
          setShowPaymentModal(false);
          setPaymentResult(null);
        }}
        disabled={processingPayment}
      >
        Annuler
      </button>
      <button 
        type="submit"
        className="festival-btn festival-btn-primary"
        disabled={processingPayment || !paymentForm.guestName || !paymentForm.guestEmail}
      >
        {processingPayment ? (
          <>
            <FaSpinner className="me-2 fa-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <FaVoteYea className="me-2" />
            Confirmer le paiement de {(paymentForm.voteCount || 1) * pricePerVote} XOF
          </>
        )}
      </button>
    </div>
    
    {/* Informations importantes */}
    <div className="payment-notes">
      <div className="payment-note">
        <FaExclamationCircle className="note-icon" />
        <span>Vous recevrez un SMS de confirmation pour valider le paiement</span>
      </div>
      <div className="payment-note">
        <FaClock className="note-icon" />
        <span>Les votes sont immédiatement crédités après confirmation du paiement</span>
      </div>
    </div>
  </div>
</form>
        )}
      </div>
    </div>
  </div>
)}

      <Footer />
      
    </div>
  );
};

export default Event;