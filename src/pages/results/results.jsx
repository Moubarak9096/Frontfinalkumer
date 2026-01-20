// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../../components/Header/Header';
// import Footer from '../../components/Footer/Footer';
// import {
//   FaArrowLeft, FaShareAlt, FaFilter, FaSearch, FaUsers,
//   FaTrophy, FaMedal, FaCrown, FaDownload, FaPrint, FaChartBar,
//   FaTable, FaMapMarkerAlt, FaCalendarAlt, FaPercentage,
//   FaRegClock, FaSortAmountDown, FaEye, FaList, FaSpinner,
//   FaExclamationTriangle, FaSync, FaCheckCircle, FaRegFilePdf,
//   FaFileExcel, FaFileCsv, FaChartLine, FaUserFriends, FaGlobe,
//   FaChevronDown, FaCalendar, FaTimes,FaVoteYea
// } from 'react-icons/fa';
// import './results.css';

// // Composants de graphique avec Recharts
// import {
//   BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis,
//   CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
//   RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
// } from 'recharts';

// const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

// // Composant d'alerte personnalisé
// const AlertModal = ({ isOpen, title, message, type = 'error', onClose }) => {
//   if (!isOpen) return null;

//   const getTypeStyles = () => {
//     switch (type) {
//       case 'error':
//         return {
//           bgColor: '#FEF2F2',
//           borderColor: '#FECACA',
//           textColor: '#991B1B',
//           icon: '⚠️',
//           title: 'Erreur'
//         };
//       case 'warning':
//         return {
//           bgColor: '#FFFBEB',
//           borderColor: '#FDE68A',
//           textColor: '#92400E',
//           icon: '⚠️',
//           title: 'Attention'
//         };
//       case 'success':
//         return {
//           bgColor: '#F0FDF4',
//           borderColor: '#BBF7D0',
//           textColor: '#166534',
//           icon: '✅',
//           title: 'Succès'
//         };
//       default:
//         return {
//           bgColor: '#FEF2F2',
//           borderColor: '#FECACA',
//           textColor: '#991B1B',
//           icon: '⚠️',
//           title: 'Erreur'
//         };
//     }
//   };

//   const styles = getTypeStyles();

//   return (
//     <div className="modal-overlay">
//       <div 
//         className="alert-modal"
//         style={{
//           backgroundColor: styles.bgColor,
//           borderColor: styles.borderColor,
//           color: styles.textColor
//         }}
//       >
//         <div className="alert-header">
//           <div className="alert-icon">{styles.icon}</div>
//           <div className="alert-title">
//             <h3>{title || styles.title}</h3>
//           </div>
//           <button 
//             onClick={onClose} 
//             className="alert-close-btn"
//             style={{ color: styles.textColor }}
//           >
//             ×
//           </button>
//         </div>
        
//         <div className="alert-body">
//           <p>{message}</p>
//         </div>
        
//         <div className="alert-footer">
//           <button 
//             onClick={onClose}
//             className="alert-ok-btn"
//             style={{
//               backgroundColor: styles.textColor,
//               color: 'white'
//             }}
//           >
//             OK
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Results = () => {
//   const navigate = useNavigate();
  
//   // États principaux
//   const [loading, setLoading] = useState(true);
//   const [competitions, setCompetitions] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [selectedCompetition, setSelectedCompetition] = useState(null);
//   const [selectedSection, setSelectedSection] = useState(null);
//   const [candidates, setCandidates] = useState([]);
//   const [error, setError] = useState(null);
  
//   // Filtres et options
//   const [searchQuery, setSearchQuery] = useState('');
//   const [viewMode, setViewMode] = useState('chart'); // 'chart' ou 'table'
//   const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'details', 'regional', 'timeline'
//   const [statistics, setStatistics] = useState(null);
  
//   // Données supplémentaires
//   const [regionalResults, setRegionalResults] = useState([]);
//   const [voteTimeline, setVoteTimeline] = useState([]);
//   const [demographics, setDemographics] = useState(null);
//   const [exporting, setExporting] = useState(false);
//   const [shareModal, setShareModal] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
  
//   // États pour l'alerte
//   const [showAlertModal, setShowAlertModal] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
  
//   // Fonction pour déterminer le statut de l'événement
//   const determineEventStatus = (startDate, endDate) => {
//     if (!startDate || !endDate) return 'ended';
    
//     const now = new Date();
//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     if (now > end) {
//       return 'ended';
//     } else if (now >= start && now <= end) {
//       return 'active';
//     } else if (now < start) {
//       return 'upcoming';
//     }
//     return 'ended';
//   };
  
//   // Vérifier si l'événement est actif
//   const isEventActive = selectedCompetition ? 
//     determineEventStatus(selectedCompetition.startDate, selectedCompetition.endDate) === 'active' : 
//     false;

//   // Fonction pour charger toutes les compétitions
//   const fetchCompetitions = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await fetch(`${API_BASE_URL}/competitions`);
      
//       if (!response.ok) {
//         throw new Error(`Erreur HTTP ${response.status}`);
//       }
      
//       const competitionsData = await response.json();
      
//       // Trier les compétitions par date de fin (la plus récente en premier)
//       const sortedCompetitions = competitionsData.sort((a, b) => {
//         const dateA = new Date(a.endDate || a.createdAt);
//         const dateB = new Date(b.endDate || b.createdAt);
//         return dateB - dateA;
//       });
      
//       setCompetitions(sortedCompetitions);
      
//       // Sélectionner la première compétition (la plus récente) par défaut
//       if (sortedCompetitions.length > 0) {
//         const latestCompetition = sortedCompetitions[0];
//         setSelectedCompetition(latestCompetition);
//         await fetchSections(latestCompetition.id);
//       }
      
//     } catch (err) {
//       console.error('Erreur détaillée:', err);
//       setError('Impossible de charger la liste des compétitions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fonction pour charger les sections d'une compétition
//   const fetchSections = async (competitionId) => {
//     try {
//       setError(null);
      
//       const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/sections`);
      
//       if (response.ok) {
//         const sectionsData = await response.json();
        
//         const normalizedSections = sectionsData.map((section, index) => ({
//           id: section.id || `section-${index}`,
//           title: section.title || `Section ${index + 1}`,
//           description: section.description || '',
//           displayOrder: section.displayOrder || index + 1,
//         }));
        
//         // Trier les sections par displayOrder
//         normalizedSections.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        
//         setSections(normalizedSections);
        
//         // Sélectionner la première section par défaut au lieu de la dernière
//         if (normalizedSections.length > 0) {
//           const firstSection = normalizedSections[0];
//           setSelectedSection(firstSection);
//           await fetchCandidates(competitionId, firstSection);
//         } else {
//           setSelectedSection(null);
//           setCandidates([]);
//         }
//       }
      
//     } catch (err) {
//       console.error('Erreur chargement sections:', err);
//       setError('Impossible de charger les sections de cette compétition');
//     }
//   };

//   // Fonction pour charger les candidats
//   const fetchCandidates = async (competitionId, section) => {
//     try {
//       setError(null);
      
//       let candidatesData = [];
      
//       // Charger tous les candidats de la compétition
//       const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/candidates`);
      
//       if (response.ok) {
//         const responseData = await response.json();
        
//         // Extraire les candidats selon la structure de la réponse
//         if (Array.isArray(responseData)) {
//           candidatesData = responseData;
//         } else if (responseData?.data && Array.isArray(responseData.data)) {
//           candidatesData = responseData.data;
//         } else if (responseData?.candidates && Array.isArray(responseData.candidates)) {
//           candidatesData = responseData.candidates;
//         }
        
//         // Filtrer par section si spécifiée
//         if (section.id && section.id !== 'default-section') {
//           candidatesData = candidatesData.filter(candidate => 
//             candidate.sectionId === section.id || 
//             candidate.section?.id === section.id
//           );
//         }
        
//         // Trier par votes décroissants et calculer les pourcentages
//         const totalVotes = candidatesData.reduce((sum, candidate) => sum + (candidate.totalVotes || 0), 0);
        
//         const sortedCandidates = candidatesData
//           .sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0))
//           .map((candidate, index) => {
//             const votes = candidate.totalVotes || 0;
//             const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
            
//             return {
//               ...candidate,
//               position: index + 1,
//               votes: votes,
//               percentage: parseFloat(percentage.toFixed(2)),
//               color: getColorForPosition(index + 1)
//             };
//           });
        
//         setCandidates(sortedCandidates);
        
//         // Charger les statistiques
//         await fetchStatistics(competitionId);
        
//         // Charger les données régionales si disponibles
//         await fetchRegionalResults(competitionId);
        
//         // Charger la timeline des votes
//         await fetchVoteTimeline(competitionId);
        
//         // Charger les données démographiques
//         await fetchDemographics(competitionId);
//       }
      
//     } catch (err) {
//       console.error('Erreur candidats:', err);
//       setCandidates([]);
//     }
//   };

//   // Fonction pour charger les statistiques
//   const fetchStatistics = async (competitionId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/public-statistics`);
//       if (response.ok) {
//         const data = await response.json();
//         setStatistics(data.statistics || data);
//       }
//     } catch (err) {
//       console.error('Erreur statistiques:', err);
//     }
//   };

//   // Fonction pour charger les résultats régionaux
//   const fetchRegionalResults = async (competitionId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/regional-results`);
//       if (response.ok) {
//         const data = await response.json();
//         setRegionalResults(data);
//       }
//     } catch (err) {
//       console.error('Erreur résultats régionaux:', err);
//       setRegionalResults([]);
//     }
//   };

//   // Fonction pour charger la timeline des votes
//   const fetchVoteTimeline = async (competitionId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/vote-timeline`);
//       if (response.ok) {
//         const data = await response.json();
//         // Transformer les données pour le graphique
//         const timelineData = Array.isArray(data) ? data : [];
//         setVoteTimeline(timelineData);
//       }
//     } catch (err) {
//       console.error('Erreur timeline:', err);
//       setVoteTimeline([]);
//     }
//   };

//   // Fonction pour charger les données démographiques
//   const fetchDemographics = async (competitionId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/demographics`);
//       if (response.ok) {
//         const data = await response.json();
//         setDemographics(data);
//       }
//     } catch (err) {
//       console.error('Erreur données démographiques:', err);
//       setDemographics(null);
//     }
//   };

//   // Gestion du changement de compétition
//   const handleCompetitionChange = (competitionId) => {
//     const competition = competitions.find(c => c.id === competitionId);
//     if (competition) {
//       setSelectedCompetition(competition);
//       setSelectedSection(null); // Réinitialiser la section
//       setCandidates([]); // Réinitialiser les candidats
//       fetchSections(competitionId);
//     }
//   };

//   const handleViewProfile = (candidate) => {
//     setSelectedCandidate(candidate);
//   };

//   // Gestion du changement de section
//   const handleSectionChange = (sectionId) => {
//     const section = sections.find(s => s.id === sectionId);
//     if (section && selectedCompetition) {
//       setSelectedSection(section);
//       fetchCandidates(selectedCompetition.id, section);
//     }
//   };

//   // Fonction pour gérer le vote
//   const handleVoteClick = (candidate) => {
//     if (!isEventActive) {
//       setAlertMessage("Le vote n'est actuellement pas disponible. L'événement est terminé ou n'a pas encore commencé.");
//       setShowAlertModal(true);
//       return;
//     }
    
//     // Si l'événement est actif, on peut voter
//     // Vous pouvez ajouter ici la logique pour ouvrir le modal de paiement
//     // Par exemple: navigate(`/vote/${candidate.id}?competition=${selectedCompetition.id}`);
//     alert(`Voter pour ${candidate.name} - Cette fonctionnalité de vote est en cours de développement`);
//   };

//   // Fonction pour obtenir une couleur selon la position
//   const getColorForPosition = (position) => {
//     if (position === 1) return '#FFD700'; // Or
//     if (position === 2) return '#C0C0C0'; // Argent
//     if (position === 3) return '#CD7F32'; // Bronze
//     const colors = ['#4a69bd', '#78e08f', '#fad390', '#e55039', '#8e44ad', '#3498db'];
//     return colors[(position - 1) % colors.length];
//   };

//   // Formatage des nombres
//   const formatNumber = (num) => {
//     if (num === undefined || num === null) return '0';
//     return new Intl.NumberFormat('fr-FR').format(num);
//   };

//   // Formatage des pourcentages
//   const formatPercentage = (num) => {
//     if (num === undefined || num === null) return '0%';
//     return `${num.toFixed(1)}%`;
//   };

//   // Formatage des dates
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Non spécifié';
//     try {
//       return new Date(dateString).toLocaleDateString('fr-FR', {
//         weekday: 'long',
//         day: 'numeric',
//         month: 'long',
//         year: 'numeric'
//       });
//     } catch (e) {
//       return 'Date invalide';
//     }
//   };

//   // Fonction de partage
//   const handleShare = async () => {
//     if (!selectedCompetition) return;
    
//     const shareUrl = window.location.href;
//     const shareText = `Découvrez les résultats de ${selectedCompetition.title}!`;
    
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: `Résultats - ${selectedCompetition.title}`,
//           text: shareText,
//           url: shareUrl,
//         });
//       } catch (err) {
//         console.log('Erreur de partage:', err);
//         copyToClipboard(shareUrl);
//       }
//     } else {
//       copyToClipboard(shareUrl);
//     }
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text).then(() => {
//       setAlertMessage('Lien copié dans le presse-papier!');
//       setShowAlertModal(true);
//     });
//   };

//   // Filtrer les candidats par recherche
//   const filteredCandidates = candidates.filter(candidate =>
//     candidate.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     candidate.bio?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   useEffect(() => {
//     fetchCompetitions();
//   }, []);

//   if (loading && !selectedCompetition) {
//     return (
//       <div className="festival-theme" style={{ minHeight: '100vh' }}>
//         <Header />
//         <div className="festival-loading text-center py-5" style={{ minHeight: '60vh' }}>
//           <div className="festival-spinner mb-4"></div>
//           <h3 className="festival-text mb-3">Chargement des résultats...</h3>
//           <p className="festival-subtext">Préparation des données statistiques</p>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (error && !selectedCompetition) {
//     return (
//       <div className="festival-theme" style={{ minHeight: '100vh' }}>
//         <Header />
//         <div className="container py-5">
//           <div className="festival-error-card p-5 text-center">
//             <FaExclamationTriangle className="festival-error-icon mb-4" />
//             <h3 className="festival-text mb-3">Erreur de chargement</h3>
//             <p className="festival-subtext mb-4">{error}</p>
//             <div className="d-flex justify-content-center gap-3">
//               <button 
//                 className="festival-btn festival-btn-secondary"
//                 onClick={() => navigate(-1)}
//               >
//                 <FaArrowLeft className="me-2" />
//                 Retour
//               </button>
//               <button 
//                 className="festival-btn festival-btn-primary"
//                 onClick={fetchCompetitions}
//               >
//                 <FaSync className="me-2" />
//                 Réessayer
//               </button>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // Statistiques à afficher
//   const stats = selectedCompetition ? [
//     { 
//       value: formatNumber(statistics?.totalVotes || 0), 
//       label: "Votes totaux",
//       color: '#4a69bd',
//       icon: <FaTrophy />
//     },
//     { 
//       value: formatNumber(statistics?.totalParticipants || 0), 
//       label: "Participants",
//       color: '#78e08f',
//       icon: <FaUserFriends />
//     },
//     { 
//       value: candidates.length > 0 ? candidates[0].name : 'N/A', 
//       label: "Grand Gagnant",
//       color: '#FFD700',
//       icon: <FaCrown />
//     },
//     { 
//       value: candidates.length > 0 ? formatPercentage(candidates[0].percentage || 0) : '0%', 
//       label: "Score du gagnant",
//       color: '#e55039',
//       icon: <FaPercentage />
//     },
//   ] : [];

//   return (
//     <div className="festival-theme" style={{ minHeight: '100vh' }}>
//       <Header />
      
//       {/* Alert Modal */}
//       <AlertModal
//         isOpen={showAlertModal}
//         title="Événement non disponible"
//         message={alertMessage}
//         type="error"
//         onClose={() => setShowAlertModal(false)}
//       />
      
//       {/* Image de fond de la compétition sélectionnée */}
//       {selectedCompetition?.coverImageUrl && (
//         <div className="festival-background-image">
//           <img 
//             src={selectedCompetition.coverImageUrl} 
//             alt={selectedCompetition.title}
//             className="festival-bg-image"
//           />
//           <div className="festival-bg-overlay"></div>
//         </div>
//       )}
      
//       {/* Contenu principal */}
//       <div className="festival-container">
//         {/* Sélecteurs en haut */}
//         <div className="festival-selectors-section">
//           <div className="container">
//             <div className="festival-selectors-card">
//               <div className="festival-selectors-header">
//                 <h3 className="festival-selectors-title">
//                   <FaChartBar className="me-2" />
//                   Analyse des Résultats
//                 </h3>
//                 <p className="festival-selectors-subtitle">
//                   Sélectionnez une compétition et une section pour voir les statistiques détaillées
//                 </p>
//               </div>
              
//               <div className="festival-selectors-grid">
//                 {/* Sélecteur de compétition */}
//                 <div className="festival-selector-group">
//                   <label className="festival-selector-label">
//                     <FaCalendar className="me-2" />
//                     Compétition
//                   </label>
//                   <div className="festival-select-wrapper">
//                     <select 
//                       className="festival-select festival-select-large"
//                       value={selectedCompetition?.id || ''}
//                       onChange={(e) => handleCompetitionChange(e.target.value)}
//                       disabled={loading || competitions.length === 0}
//                     >
//                       <option value="">{competitions.length === 0 ? 'Chargement...' : 'Sélectionnez une compétition'}</option>
//                       {competitions.map((competition) => (
//                         <option key={competition.id} value={competition.id}>
//                           {competition.title} 
//                           {competition.endDate && ` (${formatDate(competition.endDate)})`}
//                         </option>
//                       ))}
//                     </select>
//                     <FaChevronDown className="festival-select-arrow" />
//                   </div>
//                 </div>

//                 {/* Sélecteur de section */}
//                 <div className="festival-selector-group">
//                   <label className="festival-selector-label">
//                     <FaList className="me-2" />
//                     Section
//                   </label>
//                   <div className="festival-select-wrapper">
//                     <select 
//                       className="festival-select festival-select-large"
//                       value={selectedSection?.id || ''}
//                       onChange={(e) => handleSectionChange(e.target.value)}
//                       disabled={!selectedCompetition || sections.length === 0}
//                     >
//                       <option value="">
//                         {!selectedCompetition ? 'Sélectionnez d\'abord une compétition' : 
//                          sections.length === 0 ? 'Aucune section disponible' : 
//                          'Sélectionnez une section'}
//                       </option>
//                       {sections.map((section) => (
//                         <option key={section.id} value={section.id}>
//                           {section.title}
//                         </option>
//                       ))}
//                     </select>
//                     <FaChevronDown className="festival-select-arrow" />
//                   </div>
//                 </div>
//               </div>
              
//               {/* Recherche rapide */}
//               <div className="festival-search-container">
//                 <div className="festival-search-wrapper">
//                   <FaSearch className="festival-search-icon" />
//                   <input
//                     type="text"
//                     className="festival-search-input"
//                     placeholder="Rechercher un candidat..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     disabled={!selectedSection || candidates.length === 0}
//                   />
//                   {searchQuery && (
//                     <button 
//                       className="festival-search-clear"
//                       onClick={() => setSearchQuery('')}
//                     >
//                       <FaTimes />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* En-tête des résultats */}
//         {selectedCompetition && selectedSection && (
//           <>
//             <header className="festival-header">
//               <div className="container">
//                 <div className="d-flex justify-content-between align-items-start mb-4">
//                   <button 
//                     className="festival-back-btn"
//                     onClick={() => navigate(-1)}
//                   >
//                     <FaArrowLeft className="me-2" />
//                     Retour
//                   </button>
                  
//                   <div className="festival-status-badge festival-badge-success">
//                     <FaCheckCircle className="me-2" />
//                     RÉSULTATS {selectedCompetition.status === 'active' ? 'EN DIRECT' : 'FINAUX'}
//                   </div>
//                 </div>
                
//                 <h1 className="festival-title">
//                   {selectedCompetition.title}
//                 </h1>
                
//                 <p className="festival-subtitle">
//                   {selectedSection.title} - Découvrez les résultats officiels
//                   {selectedCompetition.endDate && ` (clôturé le ${formatDate(selectedCompetition.endDate)})`}
//                 </p>
//               </div>
//             </header>

//             {/* Statistiques principales */}
//             <div className="container">
//               <div className="festival-stats">
//                 {stats.map((stat, index) => (
//                   <div 
//                     key={index} 
//                     className="festival-stat-card"
//                     style={{ 
//                       background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
//                       borderColor: `${stat.color}40`
//                     }}
//                   >
//                     <div className="festival-stat-icon" style={{ color: stat.color }}>
//                       {stat.icon}
//                     </div>
//                     <div className="festival-stat-value" style={{ color: stat.color }}>
//                       {stat.value}
//                     </div>
//                     <div className="festival-stat-label">{stat.label}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="festival-content">
//               <div className="container">
//                 {/* Barre d'outils */}
//                 <div className="festival-tools-section">
//                   <div className="festival-tools-grid">
//                     <div className="festival-tools-left">
//                       <div className="festival-view-toggle">
//                         <button 
//                           className={`festival-btn ${viewMode === 'chart' ? 'festival-btn-primary' : 'festival-btn-secondary'}`}
//                           onClick={() => setViewMode('chart')}
//                         >
//                           <FaChartBar className="me-2" />
//                           Graphiques
//                         </button>
//                         <button 
//                           className={`festival-btn ${viewMode === 'table' ? 'festival-btn-primary' : 'festival-btn-secondary'}`}
//                           onClick={() => setViewMode('table')}
//                         >
//                           <FaTable className="me-2" />
//                           Tableau
//                         </button>
//                       </div>
//                     </div>
                    
//                     <div className="festival-tools-right">
//                       <button 
//                         className="festival-btn festival-btn-share"
//                         onClick={handleShare}
//                       >
//                         <FaShareAlt className="me-2" />
//                         Partager
//                       </button>
//                       <button 
//                         className="festival-btn festival-btn-secondary"
//                         onClick={() => window.print()}
//                       >
//                         <FaPrint className="me-2" />
//                         Imprimer
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Onglets */}
//                 <div className="festival-tabs">
//                   <button 
//                     className={`festival-tab ${activeTab === 'overview' ? 'festival-tab-active' : ''}`}
//                     onClick={() => setActiveTab('overview')}
//                   >
//                     Vue d'ensemble
//                   </button>
//                   <button 
//                     className={`festival-tab ${activeTab === 'details' ? 'festival-tab-active' : ''}`}
//                     onClick={() => setActiveTab('details')}
//                   >
//                     Détails par candidat
//                   </button>
//                   <button 
//                     className={`festival-tab ${activeTab === 'regional' ? 'festival-tab-active' : ''}`}
//                     onClick={() => setActiveTab('regional')}
//                   >
//                     Analyse régionale
//                   </button>
//                   <button 
//                     className={`festival-tab ${activeTab === 'timeline' ? 'festival-tab-active' : ''}`}
//                     onClick={() => setActiveTab('timeline')}
//                   >
//                     Chronologie
//                   </button>
//                   {demographics && (
//                     <button 
//                       className={`festival-tab ${activeTab === 'demographics' ? 'festival-tab-active' : ''}`}
//                       onClick={() => setActiveTab('demographics')}
//                     >
//                       Démographie
//                     </button>
//                   )}
//                 </div>

//                 {/* Vue d'ensemble */}
//                 {activeTab === 'overview' && (
//                   <div className="festival-overview-section">
//                     {/* Graphique des résultats */}
//                     {viewMode === 'chart' ? (
//                       <div className="festival-chart-card">
//                         <h3 className="festival-chart-title">Top 10 des candidats - {selectedSection?.title}</h3>
//                         <div style={{ height: '400px', width: '100%' }}>
//                           <ResponsiveContainer width="100%" height="100%">
//                             <BarChart data={filteredCandidates.slice(0, 10)}>
//                               <CartesianGrid strokeDasharray="3 3" stroke="#666" />
//                               <XAxis dataKey="name" stroke="#fff" />
//                               <YAxis stroke="#fff" />
//                               <Tooltip 
//                                 contentStyle={{ 
//                                   backgroundColor: 'rgba(0,0,0,0.8)',
//                                   borderColor: '#667eea',
//                                   color: '#fff'
//                                 }}
//                                 formatter={(value) => [`${formatNumber(value)} votes`, 'Votes']}
//                               />
//                               <Legend />
//                               <Bar 
//                                 dataKey="votes" 
//                                 name="Nombre de votes"
//                                 radius={[10, 10, 0, 0]}
//                               >
//                                 {filteredCandidates.slice(0, 10).map((candidate, index) => (
//                                   <Cell key={candidate.id} fill={candidate.color} />
//                                 ))}
//                               </Bar>
//                             </BarChart>
//                           </ResponsiveContainer>
//                         </div>
//                       </div>
//                     ) : (
//                       /* Tableau des résultats */
//                       <div className="festival-table-card">
//                         <h3 className="festival-chart-title">Classement complet - {selectedSection?.title}</h3>
//                         <div className="festival-table-responsive">
//                           <table className="festival-table">
//                             <thead>
//                               <tr>
//                                 <th>Position</th>
//                                 <th>Candidat</th>
//                                 <th>Section</th>
//                                 <th>Votes</th>
//                                 <th>Pourcentage</th>
//                                 <th>Statut</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {filteredCandidates.map((candidate) => (
//                                 <tr key={candidate.id}>
//                                   <td>
//                                     <div className="festival-position">
//                                       {candidate.position <= 3 ? (
//                                         <span className={`festival-medal festival-medal-${candidate.position}`}>
//                                           {candidate.position === 1 ? '🥇' : 
//                                            candidate.position === 2 ? '🥈' : '🥉'}
//                                         </span>
//                                       ) : (
//                                         <span className="festival-position-number">
//                                           #{candidate.position}
//                                         </span>
//                                       )}
//                                     </div>
//                                   </td>
//                                   <td>
//                                     <div className="festival-candidate-info">
//                                       {candidate.profileImageUrl ? (
//                                         <img 
//                                           src={candidate.profileImageUrl} 
//                                           alt={candidate.name}
//                                           className="festival-candidate-avatar"
//                                         />
//                                       ) : (
//                                         <div className="festival-candidate-avatar-placeholder">
//                                           {candidate.name?.[0] || 'C'}
//                                         </div>
//                                       )}
//                                       <div>
//                                         <div className="festival-candidate-name">{candidate.name}</div>
//                                         {candidate.bio && (
//                                           <div className="festival-candidate-bio">{candidate.bio.substring(0, 50)}...</div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </td>
//                                   <td>{candidate.section?.title || selectedSection?.title || 'N/A'}</td>
//                                   <td>
//                                     <div className="festival-votes-count">
//                                       {formatNumber(candidate.votes || 0)}
//                                     </div>
//                                   </td>
//                                   <td>
//                                     <div className="festival-percentage-bar">
//                                       <div 
//                                         className="festival-percentage-fill"
//                                         style={{ 
//                                           width: `${candidate.percentage}%`,
//                                           backgroundColor: candidate.color
//                                         }}
//                                       ></div>
//                                       <span className="festival-percentage-text">
//                                         {formatPercentage(candidate.percentage)}
//                                       </span>
//                                     </div>
//                                   </td>
//                                   <td>
//                                     <span className={`festival-status-badge ${
//                                       candidate.position === 1 ? 'festival-badge-gold' :
//                                       candidate.position === 2 ? 'festival-badge-silver' :
//                                       candidate.position === 3 ? 'festival-badge-bronze' :
//                                       'festival-badge-secondary'
//                                     }`}>
//                                       {candidate.position === 1 ? 'GAGNANT' :
//                                        candidate.position === 2 ? '2ÈME' :
//                                        candidate.position === 3 ? '3ÈME' : 'FINALISTE'}
//                                     </span>
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>
//                     )}

//                     {/* Graphiques supplémentaires */}
//                     <div className="festival-charts-grid">
//                       <div className="festival-chart-card">
//                         <h4 className="festival-chart-title">Répartition des votes (Top 5)</h4>
//                         <div style={{ height: '300px', width: '100%' }}>
//                           <ResponsiveContainer width="100%" height="100%">
//                             <PieChart>
//                               <Pie
//                                 data={filteredCandidates.slice(0, 5)}
//                                 cx="50%"
//                                 cy="50%"
//                                 labelLine={false}
//                                 label={({ name, percentage }) => `${name}: ${percentage}%`}
//                                 outerRadius={80}
//                                 fill="#8884d8"
//                                 dataKey="percentage"
//                               >
//                                 {filteredCandidates.slice(0, 5).map((candidate, index) => (
//                                   <Cell key={`cell-${index}`} fill={candidate.color} />
//                                 ))}
//                               </Pie>
//                               <Tooltip 
//                                 formatter={(value) => [`${value}%`, 'Pourcentage']}
//                                 contentStyle={{ 
//                                   backgroundColor: 'rgba(0,0,0,0.8)',
//                                   borderColor: '#667eea',
//                                   color: '#fff'
//                                 }}
//                               />
//                             </PieChart>
//                           </ResponsiveContainer>
//                         </div>
//                       </div>

//                       <div className="festival-chart-card">
//                         <h4 className="festival-chart-title">Comparaison des 3 premiers</h4>
//                         <div style={{ height: '300px', width: '100%' }}>
//                           <ResponsiveContainer width="100%" height="100%">
//                             <RadarChart data={filteredCandidates.slice(0, 3)}>
//                               <PolarGrid />
//                               <PolarAngleAxis dataKey="name" stroke="#fff" />
//                               <PolarRadiusAxis stroke="#fff" />
//                               <Radar 
//                                 name="Votes" 
//                                 dataKey="votes" 
//                                 stroke="#667eea" 
//                                 fill="#667eea" 
//                                 fillOpacity={0.6} 
//                               />
//                               <Tooltip 
//                                 contentStyle={{ 
//                                   backgroundColor: 'rgba(0,0,0,0.8)',
//                                   borderColor: '#667eea',
//                                   color: '#fff'
//                                 }}
//                                 formatter={(value) => [`${formatNumber(value)} votes`, 'Votes']}
//                               />
//                             </RadarChart>
//                           </ResponsiveContainer>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Détails par candidat */}
//                 {activeTab === 'details' && (
//                   <div className="festival-candidates-section">
//                     <div className="festival-candidates-header">
//                       <h2>Détails des candidats - {selectedSection?.title}</h2>
//                       <div className="festival-candidates-meta">
//                         <span className="festival-candidates-count">
//                           {filteredCandidates.length} candidat{filteredCandidates.length !== 1 ? 's' : ''}
//                         </span>
//                       </div>
//                     </div>

//                     {filteredCandidates.length === 0 ? (
//                       <div className="festival-no-candidates">
//                         <FaUsers className="festival-no-candidates-icon" />
//                         <h4>Aucun candidat trouvé</h4>
//                         <p className="festival-subtext">
//                           Aucun candidat ne correspond à vos critères de recherche.
//                         </p>
//                       </div>
//                     ) : (
//                       <div className="festival-results-grid">
//                         {filteredCandidates.map((candidate) => (
//                           <div key={candidate.id} className="festival-result-card">
//                             {/* Médaille pour les 3 premiers */}
//                             {candidate.position <= 3 && (
//                               <div className={`festival-result-medal festival-medal-${candidate.position}`}>
//                                 {candidate.position === 1 ? "🥇" : 
//                                  candidate.position === 2 ? "🥈" : "🥉"}
//                               </div>
//                             )}
                            
//                             <div className="festival-result-header">
//                               <div className="festival-result-avatar">
//                                 {candidate.profileImageUrl ? (
//                                   <img 
//                                     src={candidate.profileImageUrl} 
//                                     alt={candidate.name}
//                                     className="festival-result-img"
//                                   />
//                                 ) : (
//                                   <div className="festival-result-img-placeholder">
//                                     {candidate.name?.[0] || 'C'}
//                                   </div>
//                                 )}
//                                 <div className="festival-result-number">
//                                   #{candidate.position}
//                                 </div>
//                               </div>
                              
//                               <div className="festival-result-title">
//                                 <h4>{candidate.name}</h4>
//                                 <p>{candidate.section?.title || selectedSection?.title || 'Candidat'}</p>
//                               </div>
//                             </div>
                            
//                             <div className="festival-result-stats">
//                               <div className="festival-result-stat">
//                                 <FaTrophy className="festival-result-stat-icon" />
//                                 <div>
//                                   <div className="festival-result-stat-value">
//                                     {formatNumber(candidate.votes || 0)}
//                                   </div>
//                                   <div className="festival-result-stat-label">Votes</div>
//                                 </div>
//                               </div>
                              
//                               <div className="festival-result-stat">
//                                 <FaPercentage className="festival-result-stat-icon" />
//                                 <div>
//                                   <div className="festival-result-stat-value">
//                                     {formatPercentage(candidate.percentage)}
//                                   </div>
//                                   <div className="festival-result-stat-label">Score</div>
//                                 </div>
//                               </div>
//                             </div>
                            
//                             <div className="festival-result-progress">
//                               <div 
//                                 className="festival-result-progress-bar"
//                                 style={{ 
//                                   width: `${candidate.percentage}%`,
//                                   backgroundColor: candidate.color
//                                 }}
//                               ></div>
//                             </div>
                            
//                             {candidate.bio && (
//                               <div className="festival-result-bio">
//                                 <p>{candidate.bio.substring(0, 150)}...</p>
//                               </div>
//                             )}
                            
//                             <div className="festival-result-actions">
//                               <button 
//                                 className="festival-btn festival-btn-vote"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleVoteClick(candidate);
//                                 }}
//                                 disabled={!isEventActive}
//                               >
//                                 <FaVoteYea className="me-2" />
//                                 {isEventActive ? "Voter" : "Événement terminé"}
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Analyse régionale */}
//                 {activeTab === 'regional' && (
//                   <div className="festival-regional-section">
//                     <div className="festival-chart-card">
//                       <h3 className="festival-chart-title">Distribution géographique des votes</h3>
//                       {regionalResults.length > 0 ? (
//                         <div style={{ height: '500px', width: '100%' }}>
//                           <ResponsiveContainer width="100%" height="100%">
//                             <BarChart data={regionalResults}>
//                               <CartesianGrid strokeDasharray="3 3" stroke="#666" />
//                               <XAxis dataKey="region" stroke="#fff" />
//                               <YAxis stroke="#fff" />
//                               <Tooltip 
//                                 contentStyle={{ 
//                                   backgroundColor: 'rgba(0,0,0,0.8)',
//                                   borderColor: '#667eea',
//                                   color: '#fff'
//                                 }}
//                                 formatter={(value) => [`${formatNumber(value)} votes`, 'Votes']}
//                               />
//                               <Legend />
//                               <Bar 
//                                 dataKey="votes" 
//                                 name="Votes par région"
//                                 fill="#667eea"
//                                 radius={[10, 10, 0, 0]}
//                               />
//                             </BarChart>
//                           </ResponsiveContainer>
//                         </div>
//                       ) : (
//                         <div className="festival-no-data">
//                           <FaGlobe className="festival-no-data-icon" />
//                           <h4>Aucune donnée régionale disponible</h4>
//                           <p className="festival-subtext">
//                             Les données de distribution géographique ne sont pas encore disponibles.
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* Chronologie */}
//                 {activeTab === 'timeline' && (
//                   <div className="festival-timeline-section">
//                     <div className="festival-chart-card">
//                       <h3 className="festival-chart-title">Évolution des votes dans le temps</h3>
//                       {voteTimeline.length > 0 ? (
//                         <div style={{ height: '500px', width: '100%' }}>
//                           <ResponsiveContainer width="100%" height="100%">
//                             <AreaChart data={voteTimeline}>
//                               <CartesianGrid strokeDasharray="3 3" stroke="#666" />
//                               <XAxis dataKey="date" stroke="#fff" />
//                               <YAxis stroke="#fff" />
//                               <Tooltip 
//                                 contentStyle={{ 
//                                   backgroundColor: 'rgba(0,0,0,0.8)',
//                                   borderColor: '#667eea',
//                                   color: '#fff'
//                                 }}
//                                 formatter={(value) => [`${formatNumber(value)} votes`, 'Votes']}
//                               />
//                               <Area 
//                                 type="monotone" 
//                                 dataKey="votes" 
//                                 stroke="#667eea" 
//                                 fill="url(#colorVotes)" 
//                                 fillOpacity={0.3}
//                               />
//                               <defs>
//                                 <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
//                                   <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
//                                   <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
//                                 </linearGradient>
//                               </defs>
//                             </AreaChart>
//                           </ResponsiveContainer>
//                         </div>
//                       ) : (
//                         <div className="festival-no-data">
//                           <FaChartLine className="festival-no-data-icon" />
//                           <h4>Aucune donnée de chronologie disponible</h4>
//                           <p className="festival-subtext">
//                             Les données d'évolution des votes dans le temps ne sont pas encore disponibles.
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* Démographie */}
//                 {activeTab === 'demographics' && demographics && (
//                   <div className="festival-demographics-section">
//                     <div className="festival-chart-card">
//                       <h3 className="festival-chart-title">Répartition démographique des votants</h3>
//                       <div className="festival-charts-grid">
//                         {demographics.ageGroups && (
//                           <div className="festival-chart-item">
//                             <h4>Par tranche d'âge</h4>
//                             <div style={{ height: '300px', width: '100%' }}>
//                               <ResponsiveContainer width="100%" height="100%">
//                                 <BarChart data={demographics.ageGroups}>
//                                   <CartesianGrid strokeDasharray="3 3" stroke="#666" />
//                                   <XAxis dataKey="ageGroup" stroke="#fff" />
//                                   <YAxis stroke="#fff" />
//                                   <Tooltip 
//                                     contentStyle={{ 
//                                       backgroundColor: 'rgba(0,0,0,0.8)',
//                                       borderColor: '#667eea',
//                                       color: '#fff'
//                                     }}
//                                     formatter={(value) => [`${formatNumber(value)} personnes`, 'Nombre']}
//                                   />
//                                   <Bar 
//                                     dataKey="count" 
//                                     name="Nombre de votants"
//                                     fill="#78e08f"
//                                     radius={[10, 10, 0, 0]}
//                                   />
//                                 </BarChart>
//                               </ResponsiveContainer>
//                             </div>
//                           </div>
//                         )}
                        
//                         {demographics.gender && (
//                           <div className="festival-chart-item">
//                             <h4>Par genre</h4>
//                             <div style={{ height: '300px', width: '100%' }}>
//                               <ResponsiveContainer width="100%" height="100%">
//                                 <PieChart>
//                                   <Pie
//                                     data={demographics.gender}
//                                     cx="50%"
//                                     cy="50%"
//                                     labelLine={false}
//                                     label={({ name, percentage }) => `${name}: ${percentage}%`}
//                                     outerRadius={80}
//                                     fill="#8884d8"
//                                     dataKey="percentage"
//                                   >
//                                     {demographics.gender.map((entry, index) => (
//                                       <Cell key={`cell-${index}`} fill={index === 0 ? '#4a69bd' : '#fad390'} />
//                                     ))}
//                                   </Pie>
//                                   <Tooltip 
//                                     formatter={(value) => [`${value}%`, 'Pourcentage']}
//                                     contentStyle={{ 
//                                       backgroundColor: 'rgba(0,0,0,0.8)',
//                                       borderColor: '#667eea',
//                                       color: '#fff'
//                                     }}
//                                   />
//                                 </PieChart>
//                               </ResponsiveContainer>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </>
//         )}

//         {/* Message si aucune sélection */}
//         {(!selectedCompetition || !selectedSection) && !loading && (
//           <div className="festival-no-selection">
//             <div className="container">
//               <div className="festival-no-selection-card">
//                 <FaChartBar className="festival-no-selection-icon" />
//                 <h3 className="festival-no-selection-title">Sélectionnez une compétition</h3>
//                 <p className="festival-no-selection-text">
//                   Veuillez choisir une compétition dans la liste pour voir les résultats détaillés.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Results;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import {
  FaArrowLeft, FaShareAlt, FaFilter, FaSearch, FaUsers,
  FaTrophy, FaMedal, FaCrown, FaDownload, FaPrint, FaChartBar,
  FaTable, FaMapMarkerAlt, FaCalendarAlt, FaPercentage,
  FaRegClock, FaSortAmountDown, FaEye, FaList, FaSpinner,
  FaExclamationTriangle, FaSync, FaCheckCircle, FaRegFilePdf,
  FaFileExcel, FaFileCsv, FaChartLine, FaUserFriends, FaGlobe,
  FaChevronDown, FaCalendar, FaTimes, FaVoteYea, FaFire,
  FaStar, FaAward, FaCalendarCheck, FaCalendarTimes, FaEllipsisH
} from 'react-icons/fa';
import './results.css';

// Composants de graphique avec Recharts
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

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

// Modal pour voir tous les événements
const AllEventsModal = ({ isOpen, events, selectedEventId, onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  if (!isOpen) return null;

  // Fonction pour déterminer le statut de l'événement
  const getEventStatus = (event) => {
    if (!event.startDate || !event.endDate) return 'ended';
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (now > end) return 'ended';
    if (now >= start && now <= end) return 'active';
    if (now < start) return 'upcoming';
    return 'ended';
  };

  // Obtenir les infos du statut
  const getStatusInfo = (event) => {
    const status = getEventStatus(event);
    switch (status) {
      case 'active':
        return {
          label: 'EN COURS',
          color: '#10B981',
          bgColor: 'rgba(16, 185, 129, 0.1)',
          icon: <FaFire className="me-1" size={12} />
        };
      case 'ended':
        return {
          label: 'TERMINÉ',
          color: '#6B7280',
          bgColor: 'rgba(107, 114, 128, 0.1)',
          icon: <FaCalendarTimes className="me-1" size={12} />
        };
      case 'upcoming':
        return {
          label: 'À VENIR',
          color: '#F59E0B',
          bgColor: 'rgba(245, 158, 11, 0.1)',
          icon: <FaCalendarCheck className="me-1" size={12} />
        };
      default:
        return {
          label: 'TERMINÉ',
          color: '#6B7280',
          bgColor: 'rgba(107, 114, 128, 0.1)',
          icon: <FaCalendarTimes className="me-1" size={12} />
        };
    }
  };

  // Filtrer les événements
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || getEventStatus(event) === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="modal-overlay">
      <div className="all-events-modal">
        <div className="all-events-modal-header">
          <h3 className="all-events-modal-title">
            <FaCalendar className="me-2" />
            Tous les événements
          </h3>
          <button 
            className="all-events-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="all-events-modal-body">
          {/* Barre de recherche et filtres */}
          <div className="all-events-filters">
            <div className="all-events-search">
              <FaSearch className="all-events-search-icon" />
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="all-events-search-input"
              />
            </div>
            <div className="all-events-status-filter">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="all-events-filter-select"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">En cours</option>
                <option value="ended">Terminés</option>
                <option value="upcoming">À venir</option>
              </select>
            </div>
          </div>

          {/* Liste des événements */}
          <div className="all-events-list">
            {filteredEvents.length === 0 ? (
              <div className="all-events-empty">
                <FaCalendar className="all-events-empty-icon" />
                <p>Aucun événement trouvé</p>
              </div>
            ) : (
              filteredEvents.map(event => {
                const statusInfo = getStatusInfo(event);
                return (
                  <div 
                    key={event.id}
                    className={`all-events-item ${selectedEventId === event.id ? 'all-events-item-selected' : ''}`}
                    onClick={() => onSelect(event)}
                  >
                    <div className="all-events-item-content">
                      <div className="all-events-item-header">
                        <h4 className="all-events-item-title">{event.title}</h4>
                        <span 
                          className="all-events-item-status"
                          style={{
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.color,
                            border: `1px solid ${statusInfo.color}40`
                          }}
                        >
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                      </div>
                      
                      <div className="all-events-item-details">
                        {event.description && (
                          <p className="all-events-item-description">{event.description}</p>
                        )}
                        
                        <div className="all-events-item-meta">
                          {event.startDate && (
                            <span className="all-events-item-date">
                              <FaCalendarAlt className="me-1" />
                              Début: {new Date(event.startDate).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                          {event.endDate && (
                            <span className="all-events-item-date">
                              <FaCalendarAlt className="me-1" />
                              Fin: {new Date(event.endDate).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="all-events-item-actions">
                      <button 
                        className="all-events-select-btn"
                        onClick={() => onSelect(event)}
                      >
                        Sélectionner
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Results = () => {
  const navigate = useNavigate();
  
  // États principaux
  const [loading, setLoading] = useState(true);
  const [competitions, setCompetitions] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);
  
  // Filtres et options
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('chart'); // 'chart' ou 'table'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'details', 'regional', 'timeline'
  const [statistics, setStatistics] = useState(null);
  
  // Données supplémentaires
  const [regionalResults, setRegionalResults] = useState([]);
  const [voteTimeline, setVoteTimeline] = useState([]);
  const [demographics, setDemographics] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  // États pour l'alerte
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // État pour la modal de tous les événements
  const [showAllEventsModal, setShowAllEventsModal] = useState(false);

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
  
  // Fonction pour obtenir le statut de l'événement avec style
  const getEventStatusInfo = (competition) => {
    const status = determineEventStatus(competition.startDate, competition.endDate);
    
    switch (status) {
      case 'active':
        return {
          label: 'EN COURS',
          icon: <FaFire className="event-status-icon" />,
          className: 'event-status-active',
          color: '#10B981',
          bgColor: 'rgba(16, 185, 129, 0.1)'
        };
      case 'ended':
        return {
          label: 'TERMINÉ',
          icon: <FaCalendarTimes className="event-status-icon" />,
          className: 'event-status-ended',
          color: '#6B7280',
          bgColor: 'rgba(107, 114, 128, 0.1)'
        };
      case 'upcoming':
        return {
          label: 'À VENIR',
          icon: <FaCalendarCheck className="event-status-icon" />,
          className: 'event-status-upcoming',
          color: '#F59E0B',
          bgColor: 'rgba(245, 158, 11, 0.1)'
        };
      default:
        return {
          label: 'TERMINÉ',
          icon: <FaCalendarTimes className="event-status-icon" />,
          className: 'event-status-ended',
          color: '#6B7280',
          bgColor: 'rgba(107, 114, 128, 0.1)'
        };
    }
  };

  // Vérifier si l'événement est actif
  const isEventActive = selectedCompetition ? 
    determineEventStatus(selectedCompetition.startDate, selectedCompetition.endDate) === 'active' : 
    false;

  // Fonction pour charger toutes les compétitions
  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/competitions`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      const competitionsData = await response.json();
      
      // Trier les compétitions par date de fin (la plus récente en premier)
      const sortedCompetitions = competitionsData.sort((a, b) => {
        const dateA = new Date(a.endDate || a.createdAt);
        const dateB = new Date(b.endDate || b.createdAt);
        return dateB - dateA;
      });
      
      setCompetitions(sortedCompetitions);
      
      // Sélectionner la première compétition (la plus récente) par défaut
      if (sortedCompetitions.length > 0) {
        const latestCompetition = sortedCompetitions[0];
        setSelectedCompetition(latestCompetition);
        await fetchSections(latestCompetition.id);
      }
      
    } catch (err) {
      console.error('Erreur détaillée:', err);
      setError('Impossible de charger la liste des compétitions');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour charger les sections d'une compétition
  const fetchSections = async (competitionId) => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/sections`);
      
      if (response.ok) {
        const sectionsData = await response.json();
        
        const normalizedSections = sectionsData.map((section, index) => ({
          id: section.id || `section-${index}`,
          title: section.title || `Section ${index + 1}`,
          description: section.description || '',
          displayOrder: section.displayOrder || index + 1,
        }));
        
        // Trier les sections par displayOrder
        normalizedSections.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        
        setSections(normalizedSections);
        
        // Sélectionner la première section par défaut
        if (normalizedSections.length > 0) {
          const firstSection = normalizedSections[0];
          setSelectedSection(firstSection);
          await fetchCandidates(competitionId, firstSection);
        } else {
          setSelectedSection(null);
          setCandidates([]);
        }
      }
      
    } catch (err) {
      console.error('Erreur chargement sections:', err);
      setError('Impossible de charger les sections de cette compétition');
    }
  };

  // Fonction pour charger les candidats
  const fetchCandidates = async (competitionId, section) => {
    try {
      setError(null);
      
      let candidatesData = [];
      
      // Charger tous les candidats de la compétition
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
        
        // Filtrer par section si spécifiée
        if (section.id && section.id !== 'default-section') {
          candidatesData = candidatesData.filter(candidate => 
            candidate.sectionId === section.id || 
            candidate.section?.id === section.id
          );
        }
        
        // Trier par votes décroissants et calculer les pourcentages
        const totalVotes = candidatesData.reduce((sum, candidate) => sum + (candidate.totalVotes || 0), 0);
        
        const sortedCandidates = candidatesData
          .sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0))
          .map((candidate, index) => {
            const votes = candidate.totalVotes || 0;
            const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
            
            return {
              ...candidate,
              position: index + 1,
              votes: votes,
              percentage: parseFloat(percentage.toFixed(2)),
              color: getColorForPosition(index + 1)
            };
          });
        
        setCandidates(sortedCandidates);
        
        // Charger les statistiques
        await fetchStatistics(competitionId);
        
        // Charger les données régionales si disponibles
        await fetchRegionalResults(competitionId);
        
        // Charger la timeline des votes
        await fetchVoteTimeline(competitionId);
        
        // Charger les données démographiques
        await fetchDemographics(competitionId);
      }
      
    } catch (err) {
      console.error('Erreur candidats:', err);
      setCandidates([]);
    }
  };

  // Fonction pour charger les statistiques
  const fetchStatistics = async (competitionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/public-statistics`);
      if (response.ok) {
        const data = await response.json();
        setStatistics(data.statistics || data);
      }
    } catch (err) {
      console.error('Erreur statistiques:', err);
    }
  };

  // Fonction pour charger les résultats régionaux
  const fetchRegionalResults = async (competitionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/regional-results`);
      if (response.ok) {
        const data = await response.json();
        setRegionalResults(data);
      }
    } catch (err) {
      console.error('Erreur résultats régionaux:', err);
      setRegionalResults([]);
    }
  };

  // Fonction pour charger la timeline des votes
  const fetchVoteTimeline = async (competitionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/vote-timeline`);
      if (response.ok) {
        const data = await response.json();
        // Transformer les données pour le graphique
        const timelineData = Array.isArray(data) ? data : [];
        setVoteTimeline(timelineData);
      }
    } catch (err) {
      console.error('Erreur timeline:', err);
      setVoteTimeline([]);
    }
  };

  // Fonction pour charger les données démographiques
  const fetchDemographics = async (competitionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/demographics`);
      if (response.ok) {
        const data = await response.json();
        setDemographics(data);
      }
    } catch (err) {
      console.error('Erreur données démographiques:', err);
      setDemographics(null);
    }
  };

  // Gestion du changement de compétition
  const handleCompetitionChange = (competitionId) => {
    const competition = competitions.find(c => c.id === competitionId);
    if (competition) {
      setSelectedCompetition(competition);
      setSelectedSection(null); // Réinitialiser la section
      setCandidates([]); // Réinitialiser les candidats
      fetchSections(competitionId);
      setShowAllEventsModal(false); // Fermer la modal si elle est ouverte
    }
  };

  // Gestion du changement de section
  const handleSectionChange = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (section && selectedCompetition) {
      setSelectedSection(section);
      fetchCandidates(selectedCompetition.id, section);
    }
  };

  // Fonction pour obtenir une couleur selon la position
  const getColorForPosition = (position) => {
    if (position === 1) return '#FFD700'; // Or
    if (position === 2) return '#C0C0C0'; // Argent
    if (position === 3) return '#CD7F32'; // Bronze
    const colors = ['#4a69bd', '#78e08f', '#fad390', '#e55039', '#8e44ad', '#3498db'];
    return colors[(position - 1) % colors.length];
  };

  // Formatage des nombres
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  // Formatage des pourcentages
  const formatPercentage = (num) => {
    if (num === undefined || num === null) return '0%';
    return `${num.toFixed(1)}%`;
  };

  // Formatage des dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return 'Date invalide';
    }
  };

  // Fonction de partage
  const handleShare = async () => {
    if (!selectedCompetition) return;
    
    const shareUrl = window.location.href;
    const shareText = `Découvrez les résultats de ${selectedCompetition.title}!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Résultats - ${selectedCompetition.title}`,
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

  // Filtrer les candidats par recherche
  const filteredCandidates = candidates.filter(candidate =>
    candidate.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchCompetitions();
  }, []);

  if (loading && !selectedCompetition) {
    return (
      <div className="festival-theme" style={{ minHeight: '100vh' }}>
        <Header />
        <div className="festival-loading text-center py-5" style={{ minHeight: '60vh' }}>
          <div className="festival-spinner mb-4"></div>
          <h3 className="festival-text mb-3">Chargement des résultats...</h3>
          <p className="festival-subtext">Préparation des données statistiques</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !selectedCompetition) {
    return (
      <div className="festival-theme" style={{ minHeight: '100vh' }}>
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
                onClick={fetchCompetitions}
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

  // Statistiques à afficher
  const stats = selectedCompetition ? [
    { 
      value: formatNumber(statistics?.totalVotes || 0), 
      label: "Votes totaux",
      color: '#4a69bd',
      icon: <FaTrophy />
    },
    { 
      value: formatNumber(statistics?.totalParticipants || 0), 
      label: "Participants",
      color: '#78e08f',
      icon: <FaUserFriends />
    },
    { 
      value: candidates.length > 0 ? candidates[0].name : 'N/A', 
      label: "Grand Gagnant",
      color: '#FFD700',
      icon: <FaCrown />
    },
    { 
      value: candidates.length > 0 ? formatPercentage(candidates[0].percentage || 0) : '0%', 
      label: "Score du gagnant",
      color: '#e55039',
      icon: <FaPercentage />
    },
  ] : [];

  // Limiter à 5 derniers événements
  const recentEvents = competitions.slice(0, 5);

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
      
      {/* Modal pour voir tous les événements */}
      <AllEventsModal
        isOpen={showAllEventsModal}
        events={competitions}
        selectedEventId={selectedCompetition?.id}
        onSelect={(event) => handleCompetitionChange(event.id)}
        onClose={() => setShowAllEventsModal(false)}
      />
      
      {/* Image de fond de la compétition sélectionnée */}
      {selectedCompetition?.coverImageUrl && (
        <div className="festival-background-image">
          <img 
            src={selectedCompetition.coverImageUrl} 
            alt={selectedCompetition.title}
            className="festival-bg-image"
          />
          <div className="festival-bg-overlay"></div>
        </div>
      )}
      
      {/* Contenu principal */}
      <div className="festival-container">
        {/* Section compacte des événements en haut */}
        <div className="events-compact-section">
          <div className="container">
            <div className="events-compact-header">
              <h3 className="events-compact-title">
                <FaCalendar className="me-2" />
                Événements récents
              </h3>
              <p className="events-compact-subtitle">
                Sélectionnez un événement pour voir les résultats
              </p>
            </div>
            
            <div className="events-compact-buttons">
              {/* Boutons des 5 derniers événements */}
              {recentEvents.map((competition) => {
                const statusInfo = getEventStatusInfo(competition);
                return (
                  <button
                    key={competition.id}
                    className={`event-compact-btn ${
                      selectedCompetition?.id === competition.id ? 'event-compact-btn-active' : ''
                    }`}
                    onClick={() => handleCompetitionChange(competition.id)}
                    title={competition.title}
                  >
                    <div className="event-compact-content">
                      <span className="event-compact-title">
                        {competition.title.length > 20 
                          ? `${competition.title.substring(0, 20)}...` 
                          : competition.title}
                      </span>
                      <span 
                        className={`event-compact-status ${statusInfo.className}`}
                        style={{
                          backgroundColor: statusInfo.bgColor,
                          color: statusInfo.color,
                          borderColor: statusInfo.color
                        }}
                      >
                        {statusInfo.icon}
                        <span className="event-status-label">{statusInfo.label}</span>
                      </span>
                    </div>
                  </button>
                );
              })}
              
              {/* Bouton "Voir tout" */}
              {competitions.length > 5 && (
                <button
                  className="event-compact-btn event-compact-btn-all"
                  onClick={() => setShowAllEventsModal(true)}
                  title="Voir tous les événements"
                >
                  <FaEllipsisH className="me-1" />
                  Voir tout ({competitions.length})
                </button>
              )}
            </div>
          </div>
        </div>
        
       

{/* Sections de la compétition sélectionnée */}
{selectedCompetition && sections.length > 0 && (
  <div className="festival-sections-tabs">
    <div className="container">
      <div className="festival-sections-header">
        <h4 className="festival-sections-title">
          <FaList className="me-2" />
          Sections de {selectedCompetition.title}
        </h4>
        {sections.length > 10 && (
          <div className="festival-sections-counter">
            {sections.length} sections
          </div>
        )}
      </div>
      
      <div className="festival-sections-grid">
        {sections.slice(0, 10).map((section) => (
          <button
            key={section.id}
            className={`festival-section-btn-compact ${
              selectedSection?.id === section.id ? 'festival-section-btn-compact-active' : ''
            }`}
            onClick={() => handleSectionChange(section.id)}
            title={section.description || section.title}
          >
            <div className="festival-section-btn-content">
              <span className="festival-section-btn-title">
                {section.title}
              </span>
              {section.description && (
                <span className="festival-section-btn-desc">
                  {section.description.length > 30 
                    ? `${section.description.substring(0, 30)}...` 
                    : section.description}
                </span>
              )}
            </div>
          </button>
        ))}
        
        {/* Bouton "Voir plus" si plus de 10 sections */}
        {sections.length > 10 && (
          <button
            className="festival-section-btn-compact festival-section-btn-more"
            onClick={() => {
              // Ici vous pouvez implémenter une modal pour voir toutes les sections
              // ou simplement afficher toutes les sections
              const event = new CustomEvent('showAllSections', { detail: sections });
              window.dispatchEvent(event);
            }}
          >
            <FaEllipsisH className="me-1" />
            Voir plus
          </button>
        )}
      </div>
      
      {/* Recherche */}
      <div className="festival-search-container">
        <div className="festival-search-wrapper">
          <FaSearch className="festival-search-icon" />
          <input
            type="text"
            className="festival-search-input"
            placeholder="Rechercher un candidat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={!selectedSection || candidates.length === 0}
          />
          {searchQuery && (
            <button 
              className="festival-search-clear"
              onClick={() => setSearchQuery('')}
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
)}
        {/* En-tête des résultats */}
        {selectedCompetition && selectedSection && (
          <>
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
                  
                  <div className="festival-status-badge festival-badge-success">
                    <FaCheckCircle className="me-2" />
                    RÉSULTATS {determineEventStatus(selectedCompetition.startDate, selectedCompetition.endDate) === 'active' ? 'EN DIRECT' : 'FINAUX'}
                  </div>
                </div>
                
                <h1 className="festival-title">
                  {selectedCompetition.title}
                </h1>
                
                <p className="festival-subtitle">
                  {selectedSection.title} - Découvrez les résultats officiels
                  {selectedCompetition.endDate && ` (clôturé le ${formatDate(selectedCompetition.endDate)})`}
                </p>
              </div>
            </header>

            {/* Statistiques principales */}
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
                {/* Onglets principaux */}
                <div className="festival-tabs">
                  <button 
                    className={`festival-tab ${activeTab === 'overview' ? 'festival-tab-active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Vue d'ensemble
                  </button>
                  <button 
                    className={`festival-tab ${activeTab === 'details' ? 'festival-tab-active' : ''}`}
                    onClick={() => setActiveTab('details')}
                  >
                    Détails par candidat
                  </button>
                  <button 
                    className={`festival-tab ${activeTab === 'regional' ? 'festival-tab-active' : ''}`}
                    onClick={() => setActiveTab('regional')}
                  >
                    Analyse régionale
                  </button>
                  <button 
                    className={`festival-tab ${activeTab === 'timeline' ? 'festival-tab-active' : ''}`}
                    onClick={() => setActiveTab('timeline')}
                  >
                    Chronologie
                  </button>
                  {demographics && (
                    <button 
                      className={`festival-tab ${activeTab === 'demographics' ? 'festival-tab-active' : ''}`}
                      onClick={() => setActiveTab('demographics')}
                    >
                      Démographie
                    </button>
                  )}
                </div>

                {/* Barre d'outils */}
                <div className="festival-tools-section">
                  <div className="festival-tools-grid">
                    <div className="festival-tools-left">
                      <div className="festival-view-toggle">
                        <button 
                          className={`festival-btn ${viewMode === 'chart' ? 'festival-btn-primary' : 'festival-btn-secondary'}`}
                          onClick={() => setViewMode('chart')}
                        >
                          <FaChartBar className="me-2" />
                          Graphiques
                        </button>
                        <button 
                          className={`festival-btn ${viewMode === 'table' ? 'festival-btn-primary' : 'festival-btn-secondary'}`}
                          onClick={() => setViewMode('table')}
                        >
                          <FaTable className="me-2" />
                          Tableau
                        </button>
                      </div>
                    </div>
                    
                    <div className="festival-tools-right">
                      <button 
                        className="festival-btn festival-btn-share"
                        onClick={handleShare}
                      >
                        <FaShareAlt className="me-2" />
                        Partager
                      </button>
                      <button 
                        className="festival-btn festival-btn-secondary"
                        onClick={() => window.print()}
                      >
                        <FaPrint className="me-2" />
                        Imprimer
                      </button>
                    </div>
                  </div>
                </div>

                {/* Vue d'ensemble */}
                {activeTab === 'overview' && (
                  <div className="festival-overview-section">
                    {/* Graphique des résultats */}
                    {viewMode === 'chart' ? (
                      <div className="festival-chart-card">
                        <h3 className="festival-chart-title">Top 10 des candidats - {selectedSection?.title}</h3>
                        <div style={{ height: '400px', width: '100%' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={filteredCandidates.slice(0, 10)}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                              <XAxis dataKey="name" stroke="#fff" />
                              <YAxis stroke="#fff" />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'rgba(0,0,0,0.8)',
                                  borderColor: '#667eea',
                                  color: '#fff'
                                }}
                                formatter={(value) => [`${formatNumber(value)} votes`, 'Votes']}
                              />
                              <Legend />
                              <Bar 
                                dataKey="votes" 
                                name="Nombre de votes"
                                radius={[10, 10, 0, 0]}
                              >
                                {filteredCandidates.slice(0, 10).map((candidate, index) => (
                                  <Cell key={candidate.id} fill={candidate.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ) : (
                      /* Tableau des résultats */
                      <div className="festival-table-card">
                        <h3 className="festival-chart-title">Classement complet - {selectedSection?.title}</h3>
                        <div className="festival-table-responsive">
                          <table className="festival-table">
                            <thead>
                              <tr>
                                <th>Position</th>
                                <th>Candidat</th>
                                <th>Section</th>
                                <th>Votes</th>
                                <th>Pourcentage</th>
                                <th>Statut</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredCandidates.map((candidate) => (
                                <tr key={candidate.id}>
                                  <td>
                                    <div className="festival-position">
                                      {candidate.position <= 3 ? (
                                        <span className={`festival-medal festival-medal-${candidate.position}`}>
                                          {candidate.position === 1 ? '🥇' : 
                                           candidate.position === 2 ? '🥈' : '🥉'}
                                        </span>
                                      ) : (
                                        <span className="festival-position-number">
                                          #{candidate.position}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="festival-candidate-info">
                                      {candidate.profileImageUrl ? (
                                        <img 
                                          src={candidate.profileImageUrl} 
                                          alt={candidate.name}
                                          className="festival-candidate-avatar"
                                        />
                                      ) : (
                                        <div className="festival-candidate-avatar-placeholder">
                                          {candidate.name?.[0] || 'C'}
                                        </div>
                                      )}
                                      <div>
                                        <div className="festival-candidate-name">{candidate.name}</div>
                                        {candidate.bio && (
                                          <div className="festival-candidate-bio">{candidate.bio.substring(0, 50)}...</div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td>{candidate.section?.title || selectedSection?.title || 'N/A'}</td>
                                  <td>
                                    <div className="festival-votes-count">
                                      {formatNumber(candidate.votes || 0)}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="festival-percentage-bar">
                                      <div 
                                        className="festival-percentage-fill"
                                        style={{ 
                                          width: `${candidate.percentage}%`,
                                          backgroundColor: candidate.color
                                        }}
                                      ></div>
                                      <span className="festival-percentage-text">
                                        {formatPercentage(candidate.percentage)}
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <span className={`festival-status-badge ${
                                      candidate.position === 1 ? 'festival-badge-gold' :
                                      candidate.position === 2 ? 'festival-badge-silver' :
                                      candidate.position === 3 ? 'festival-badge-bronze' :
                                      'festival-badge-secondary'
                                    }`}>
                                      {candidate.position === 1 ? 'GAGNANT' :
                                       candidate.position === 2 ? '2ÈME' :
                                       candidate.position === 3 ? '3ÈME' : 'FINALISTE'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Graphiques supplémentaires */}
                    <div className="festival-charts-grid">
                      <div className="festival-chart-card">
                        <h4 className="festival-chart-title">Répartition des votes (Top 5)</h4>
                        <div style={{ height: '300px', width: '100%' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={filteredCandidates.slice(0, 5)}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percentage }) => `${name}: ${percentage}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="percentage"
                              >
                                {filteredCandidates.slice(0, 5).map((candidate, index) => (
                                  <Cell key={`cell-${index}`} fill={candidate.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value) => [`${value}%`, 'Pourcentage']}
                                contentStyle={{ 
                                  backgroundColor: 'rgba(0,0,0,0.8)',
                                  borderColor: '#667eea',
                                  color: '#fff'
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="festival-chart-card">
                        <h4 className="festival-chart-title">Comparaison des 3 premiers</h4>
                        <div style={{ height: '300px', width: '100%' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={filteredCandidates.slice(0, 3)}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="name" stroke="#fff" />
                              <PolarRadiusAxis stroke="#fff" />
                              <Radar 
                                name="Votes" 
                                dataKey="votes" 
                                stroke="#667eea" 
                                fill="#667eea" 
                                fillOpacity={0.6} 
                              />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'rgba(0,0,0,0.8)',
                                  borderColor: '#667eea',
                                  color: '#fff'
                                }}
                                formatter={(value) => [`${formatNumber(value)} votes`, 'Votes']}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Détails par candidat */}
                {activeTab === 'details' && (
                  <div className="festival-candidates-section">
                    <div className="festival-candidates-header">
                      <h2>Détails des candidats - {selectedSection?.title}</h2>
                      <div className="festival-candidates-meta">
                        <span className="festival-candidates-count">
                          {filteredCandidates.length} candidat{filteredCandidates.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {filteredCandidates.length === 0 ? (
                      <div className="festival-no-candidates">
                        <FaUsers className="festival-no-candidates-icon" />
                        <h4>Aucun candidat trouvé</h4>
                        <p className="festival-subtext">
                          Aucun candidat ne correspond à vos critères de recherche.
                        </p>
                      </div>
                    ) : (
                      <div className="festival-results-grid">
                        {filteredCandidates.map((candidate) => (
                          <div key={candidate.id} className="festival-result-card">
                            {/* Médaille pour les 3 premiers */}
                            {candidate.position <= 3 && (
                              <div className={`festival-result-medal festival-medal-${candidate.position}`}>
                                {candidate.position === 1 ? "🥇" : 
                                 candidate.position === 2 ? "🥈" : "🥉"}
                              </div>
                            )}
                            
                            <div className="festival-result-header">
                              <div className="festival-result-avatar">
                                {candidate.profileImageUrl ? (
                                  <img 
                                    src={candidate.profileImageUrl} 
                                    alt={candidate.name}
                                    className="festival-result-img"
                                  />
                                ) : (
                                  <div className="festival-result-img-placeholder">
                                    {candidate.name?.[0] || 'C'}
                                  </div>
                                )}
                                <div className="festival-result-number">
                                  #{candidate.position}
                                </div>
                              </div>
                              
                              <div className="festival-result-title">
                                <h4>{candidate.name}</h4>
                                <p>{candidate.section?.title || selectedSection?.title || 'Candidat'}</p>
                              </div>
                            </div>
                            
                            <div className="festival-result-stats">
                              <div className="festival-result-stat">
                                <FaTrophy className="festival-result-stat-icon" />
                                <div>
                                  <div className="festival-result-stat-value">
                                    {formatNumber(candidate.votes || 0)}
                                  </div>
                                  <div className="festival-result-stat-label">Votes</div>
                                </div>
                              </div>
                              
                              <div className="festival-result-stat">
                                <FaPercentage className="festival-result-stat-icon" />
                                <div>
                                  <div className="festival-result-stat-value">
                                    {formatPercentage(candidate.percentage)}
                                  </div>
                                  <div className="festival-result-stat-label">Score</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="festival-result-progress">
                              <div 
                                className="festival-result-progress-bar"
                                style={{ 
                                  width: `${candidate.percentage}%`,
                                  backgroundColor: candidate.color
                                }}
                              ></div>
                            </div>
                            
                            {candidate.bio && (
                              <div className="festival-result-bio">
                                <p>{candidate.bio.substring(0, 150)}...</p>
                              </div>
                            )}
                            
                            <div className="festival-result-actions">
                              <button 
                                className="festival-btn festival-btn-vote"
                                disabled={!isEventActive}
                              >
                                <FaVoteYea className="me-2" />
                                {isEventActive ? "Voter" : "Événement terminé"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Analyse régionale */}
                {activeTab === 'regional' && (
                  <div className="festival-regional-section">
                    <div className="festival-chart-card">
                      <h3 className="festival-chart-title">Distribution géographique des votes</h3>
                      {regionalResults.length > 0 ? (
                        <div style={{ height: '500px', width: '100%' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={regionalResults}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                              <XAxis dataKey="region" stroke="#fff" />
                              <YAxis stroke="#fff" />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'rgba(0,0,0,0.8)',
                                  borderColor: '#667eea',
                                  color: '#fff'
                                }}
                                formatter={(value) => [`${formatNumber(value)} votes`, 'Votes']}
                              />
                              <Legend />
                              <Bar 
                                dataKey="votes" 
                                name="Votes par région"
                                fill="#667eea"
                                radius={[10, 10, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="festival-no-data">
                          <FaGlobe className="festival-no-data-icon" />
                          <h4>Aucune donnée régionale disponible</h4>
                          <p className="festival-subtext">
                            Les données de distribution géographique ne sont pas encore disponibles.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Chronologie */}
                {activeTab === 'timeline' && (
                  <div className="festival-timeline-section">
                    <div className="festival-chart-card">
                      <h3 className="festival-chart-title">Évolution des votes dans le temps</h3>
                      {voteTimeline.length > 0 ? (
                        <div style={{ height: '500px', width: '100%' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={voteTimeline}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                              <XAxis dataKey="date" stroke="#fff" />
                              <YAxis stroke="#fff" />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'rgba(0,0,0,0.8)',
                                  borderColor: '#667eea',
                                  color: '#fff'
                                }}
                                formatter={(value) => [`${formatNumber(value)} votes`, 'Votes']}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="votes" 
                                stroke="#667eea" 
                                fill="url(#colorVotes)" 
                                fillOpacity={0.3}
                              />
                              <defs>
                                <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="festival-no-data">
                          <FaChartLine className="festival-no-data-icon" />
                          <h4>Aucune donnée de chronologie disponible</h4>
                          <p className="festival-subtext">
                            Les données d'évolution des votes dans le temps ne sont pas encore disponibles.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Démographie */}
                {activeTab === 'demographics' && demographics && (
                  <div className="festival-demographics-section">
                    <div className="festival-chart-card">
                      <h3 className="festival-chart-title">Répartition démographique des votants</h3>
                      <div className="festival-charts-grid">
                        {demographics.ageGroups && (
                          <div className="festival-chart-item">
                            <h4>Par tranche d'âge</h4>
                            <div style={{ height: '300px', width: '100%' }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={demographics.ageGroups}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                                  <XAxis dataKey="ageGroup" stroke="#fff" />
                                  <YAxis stroke="#fff" />
                                  <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: 'rgba(0,0,0,0.8)',
                                      borderColor: '#667eea',
                                      color: '#fff'
                                    }}
                                    formatter={(value) => [`${formatNumber(value)} personnes`, 'Nombre']}
                                  />
                                  <Bar 
                                    dataKey="count" 
                                    name="Nombre de votants"
                                    fill="#78e08f"
                                    radius={[10, 10, 0, 0]}
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}
                        
                        {demographics.gender && (
                          <div className="festival-chart-item">
                            <h4>Par genre</h4>
                            <div style={{ height: '300px', width: '100%' }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={demographics.gender}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="percentage"
                                  >
                                    {demographics.gender.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={index === 0 ? '#4a69bd' : '#fad390'} />
                                    ))}
                                  </Pie>
                                  <Tooltip 
                                    formatter={(value) => [`${value}%`, 'Pourcentage']}
                                    contentStyle={{ 
                                      backgroundColor: 'rgba(0,0,0,0.8)',
                                      borderColor: '#667eea',
                                      color: '#fff'
                                    }}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Message si aucune compétition sélectionnée */}
        {!selectedCompetition && !loading && competitions.length > 0 && (
          <div className="festival-no-selection">
            <div className="container">
              <div className="festival-no-selection-card">
                <FaChartBar className="festival-no-selection-icon" />
                <h3 className="festival-no-selection-title">Sélectionnez un événement</h3>
                <p className="festival-no-selection-text">
                  Veuillez choisir un événement dans la liste pour voir les résultats détaillés.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Results;