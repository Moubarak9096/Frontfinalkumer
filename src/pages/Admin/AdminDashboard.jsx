// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, 
//   LineChart, Line, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, AreaChart, Area
// } from 'recharts';
// import './Admin.css';

// // Composants modaux
// const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirmer", cancelText = "Annuler" }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="confirmation-modal">
//         <h3>{title}</h3>
//         <p>{message}</p>
//         <div className="modal-actions">
//           <button onClick={onCancel} className="btn-secondary">
//             {cancelText}
//           </button>
//           <button onClick={onConfirm} className="btn-danger">
//             {confirmText}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const CompetitionDetailsModal = ({ isOpen, competition, onClose, onApprove, onReject, onEdit, onDelete }) => {
//   const [rejectReason, setRejectReason] = useState('');
//   const [showRejectForm, setShowRejectForm] = useState(false);

//   if (!isOpen || !competition) return null;

//   const getStatusColor = (status) => {
//     const statusColors = {
//       'draft': '#8B5CF6',
//       'pending_approval': '#3B82F6',
//       'active': '#10B981',
//       'completed': '#F59E0B',
//       'cancelled': '#EF4444',
//       'rejected': '#6B7280',
//       'paused': '#F59E0B'
//     };
//     return statusColors[status] || '#6B7280';
//   };

//   const getStatusText = (status) => {
//     const statusMap = {
//       'draft': 'Brouillon',
//       'pending_approval': 'En attente',
//       'active': 'Actif',
//       'completed': 'Terminé',
//       'cancelled': 'Annulé',
//       'rejected': 'Rejeté',
//       'paused': 'En pause'
//     };
//     return statusMap[status] || status;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Non définie';
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const handleReject = () => {
//     if (!rejectReason.trim()) {
//       alert('Veuillez fournir une raison pour le rejet');
//       return;
//     }
//     onReject(competition.id, rejectReason);
//     setRejectReason('');
//     setShowRejectForm(false);
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="details-modal admin-modal">
//         <div className="modal-header">
//           <h2>Détails de la compétition</h2>
//           <button onClick={onClose} className="close-btn">×</button>
//         </div>
        
//         <div className="modal-content">
//           {competition.coverImageUrl && (
//             <div className="competition-cover">
//               <img src={competition.coverImageUrl} alt={competition.title} />
//             </div>
//           )}
          
//           <div className="details-grid">
//             <div className="detail-section">
//               <h3>Informations générales</h3>
//               <div className="detail-item">
//                 <span className="detail-label">Titre :</span>
//                 <span className="detail-value">{competition.title}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Organisateur :</span>
//                 <span className="detail-value">{competition.organizer?.firstName} {competition.organizer?.lastName}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Email :</span>
//                 <span className="detail-value">{competition.organizer?.email}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Description :</span>
//                 <span className="detail-value">{competition.description}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Statut :</span>
//                 <span 
//                   className="status-badge" 
//                   style={{ backgroundColor: getStatusColor(competition.status) }}
//                 >
//                   {getStatusText(competition.status)}
//                 </span>
//               </div>
//             </div>

//             <div className="detail-section">
//               <h3>Dates importantes</h3>
//               <div className="detail-item">
//                 <span className="detail-label">Début :</span>
//                 <span className="detail-value">{formatDate(competition.startDate)}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Fin :</span>
//                 <span className="detail-value">{formatDate(competition.endDate)}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Date création :</span>
//                 <span className="detail-value">{formatDate(competition.createdAt)}</span>
//               </div>
//             </div>

//             <div className="detail-section">
//               <h3>Paramètres</h3>
//               <div className="detail-item">
//                 <span className="detail-label">Prix par vote :</span>
//                 <span className="detail-value">{competition.votePrice} XOF</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Votes min :</span>
//                 <span className="detail-value">{competition.minVotesPerTransaction || 1}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Votes max :</span>
//                 <span className="detail-value">{competition.maxVotesPerTransaction || 100}</span>
//               </div>
//             </div>

//             <div className="detail-section">
//               <h3>Statistiques</h3>
//               <div className="detail-item">
//                 <span className="detail-label">Candidats :</span>
//                 <span className="detail-value">{competition.candidates?.length || 0}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Total votes :</span>
//                 <span className="detail-value">{competition.totalVotes || 0}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Revenus :</span>
//                 <span className="detail-value">{competition.revenue ? `${competition.revenue.toLocaleString()} XOF` : '0 XOF'}</span>
//               </div>
//             </div>
//           </div>

//           {showRejectForm && (
//             <div className="reject-form">
//               <h4>Raison du rejet</h4>
//               <textarea
//                 value={rejectReason}
//                 onChange={(e) => setRejectReason(e.target.value)}
//                 placeholder="Veuillez indiquer la raison du rejet..."
//                 rows={3}
//               />
//               <div className="form-actions">
//                 <button onClick={() => setShowRejectForm(false)} className="btn-secondary">
//                   Annuler
//                 </button>
//                 <button onClick={handleReject} className="btn-danger">
//                   Confirmer le rejet
//                 </button>
//               </div>
//             </div>
//           )}

//           <div className="modal-actions admin-actions">
//             {competition.status === 'pending_approval' && (
//               <>
//                 <button onClick={() => onApprove(competition.id)} className="btn-success">
//                   ✅ Approuver
//                 </button>
//                 <button 
//                   onClick={() => setShowRejectForm(true)} 
//                   className="btn-warning"
//                 >
//                   ❌ Rejeter
//                 </button>
//               </>
//             )}
            
//             {competition.status === 'active' && (
//               <button 
//                 onClick={() => {/* Fonction pour suspendre */}} 
//                 className="btn-warning"
//               >
//                 ⏸️ Suspendre
//               </button>
//             )}
  
// <button 
//   onClick={() => {
//     // Stocker la compétition
//     localStorage.setItem('editingCompetition', JSON.stringify(competition));
//     // Fermer la modale
//     onClose();
//     // Mettre à jour l'URL et la page active
//     window.history.pushState({}, '', `/admin/competitions/${competition.id}/edit`);
//     window.dispatchEvent(new PopStateEvent('popstate'));
//   }} 
//   className="btn-secondary"
// >
//   ✏️ Modifier
// </button>
//             <button onClick={() => onDelete(competition.id)} className="btn-danger">
//               🗑️ Supprimer
//             </button>
//             <button onClick={onClose} className="btn-secondary">
//               Fermer
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Composants de pages internes
// const OverviewPage = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [revenueData, setRevenueData] = useState([]);
//   const [userGrowthData, setUserGrowthData] = useState([]);
//   const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('userToken');
      
//       // Récupérer les statistiques du dashboard
//       const response = await fetch(`${API_BASE_URL}/admin/dashboard?period=monthly`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
        
//         if (data.statistics) {
//           setStats(data.statistics);
          
//           // Générer des données pour les graphiques
//           generateChartData(data.statistics);
//         }
//       }
//     } catch (error) {
//       console.error('Erreur dashboard:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateChartData = (statistics) => {
//     // Générer des données de revenus pour les 6 derniers mois
//     const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
//     const revenueData = months.map((month, index) => ({
//       month,
//       revenue: Math.floor(statistics.revenueTotal / 6 * (index + 1) * 0.6 + Math.random() * 100000)
//     }));
//     setRevenueData(revenueData);

//     // Générer des données de croissance d'utilisateurs
//     const userGrowth = [];
//     let cumulativeUsers = 0;
//     for (let i = 0; i < 30; i++) {
//       cumulativeUsers += Math.floor(Math.random() * 5) + 1;
//       userGrowth.push({
//         date: `${i + 1}/06`,
//         users: cumulativeUsers
//       });
//     }
//     setUserGrowthData(userGrowth.slice(-7)); // Derniers 7 jours
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Chargement des données...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="overview-page">
//       <section className="stats-section">
//         <div className="section-header">
//           <h1 className="section-title">Tableau de bord Administrateur</h1>
//           <div className="period-selector">
//             <select>
//               <option value="monthly">Ce mois</option>
//               <option value="weekly">Cette semaine</option>
//               <option value="daily">Aujourd'hui</option>
//             </select>
//           </div>
//         </div>
        
//         <div className="stats-grid">
//           <div className="stat-card primary">
//             <div className="stat-icon">👥</div>
//             <div className="stat-info">
//               <h3>Utilisateurs totaux</h3>
//               <p className="stat-value">{stats?.totalUsers?.toLocaleString() || 0}</p>
//               <span className="stat-change">{stats?.regularUsers || 0} utilisateurs réguliers</span>
//             </div>
//           </div>
          
//           <div className="stat-card success">
//             <div className="stat-icon">🏆</div>
//             <div className="stat-info">
//               <h3>Compétitions actives</h3>
//               <p className="stat-value">{stats?.activeCompetitions || 0}</p>
//               <span className="stat-change">{stats?.pendingApprovalCompetitions || 0} en attente</span>
//             </div>
//           </div>
          
//           <div className="stat-card warning">
//             <div className="stat-icon">💰</div>
//             <div className="stat-info">
//               <h3>Revenus totaux</h3>
//               <p className="stat-value">{(stats?.revenueTotal || 0).toLocaleString()} XOF</p>
//               <span className="stat-change">{stats?.totalVotes || 0} votes totaux</span>
//             </div>
//           </div>
          
//           <div className="stat-card danger">
//             <div className="stat-icon">📊</div>
//             <div className="stat-info">
//               <h3>Compétitions</h3>
//               <p className="stat-value">{stats?.totalCompetitions || 0}</p>
//               <span className="stat-change">{stats?.completedCompetitions || 0} terminées</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       <div className="charts-section">
//         <div className="chart-container">
//           <div className="chart-header">
//             <h2>Revenus mensuels</h2>
//           </div>
//           <div className="chart-wrapper">
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={revenueData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="month" stroke="#9CA3AF" />
//                 <YAxis stroke="#9CA3AF" />
//                 <Tooltip 
//                   formatter={(value) => [`${value.toLocaleString()} XOF`, 'Revenus']}
//                   contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
//                 />
//                 <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="chart-container">
//           <div className="chart-header">
//             <h2>Croissance des utilisateurs (7 derniers jours)</h2>
//           </div>
//           <div className="chart-wrapper">
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={userGrowthData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="date" stroke="#9CA3AF" />
//                 <YAxis stroke="#9CA3AF" />
//                 <Tooltip 
//                   contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
//                 />
//                 <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const CompetitionsManagementPage = () => {
//   const [competitions, setCompetitions] = useState([]);
//   const [filteredCompetitions, setFilteredCompetitions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     status: 'all',
//     search: ''
//   });
//   const [selectedCompetition, setSelectedCompetition] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);
//   const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

//   useEffect(() => {
//     fetchCompetitions();
//   }, []);

//   useEffect(() => {
//     filterCompetitions();
//   }, [filters, competitions]);

//   const fetchCompetitions = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('userToken');
      
//       const response = await fetch(`${API_BASE_URL}/competitions?limit=100&sort=createdAt:desc`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setCompetitions(data.data || data || []);
//         setFilteredCompetitions(data.data || data || []);
//       }
//     } catch (error) {
//       console.error('Erreur compétitions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterCompetitions = () => {
//     let filtered = [...competitions];
    
//     if (filters.status !== 'all') {
//       filtered = filtered.filter(comp => comp.status === filters.status);
//     }
    
//     if (filters.search) {
//       const searchLower = filters.search.toLowerCase();
//       filtered = filtered.filter(comp => 
//         comp.title?.toLowerCase().includes(searchLower) ||
//         comp.organizer?.firstName?.toLowerCase().includes(searchLower) ||
//         comp.organizer?.lastName?.toLowerCase().includes(searchLower) ||
//         comp.organizer?.email?.toLowerCase().includes(searchLower)
//       );
//     }
    
//     setFilteredCompetitions(filtered);
//   };

//   const handleApprove = async (competitionId) => {
//     try {
//       setActionLoading(true);
//       const token = localStorage.getItem('userToken');
//       const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/approve`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.ok) {
//         alert('Compétition approuvée avec succès !');
//         fetchCompetitions();
//         setShowDetailsModal(false);
//       } else {
//         const errorData = await response.json();
//         alert(`Erreur: ${errorData.message || 'Impossible d\'approuver la compétition'}`);
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//       alert('Erreur lors de l\'approbation');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleReject = async (competitionId, reason) => {
//     try {
//       setActionLoading(true);
//       const token = localStorage.getItem('userToken');
//       const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/reject`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ reason })
//       });
      
//       if (response.ok) {
//         alert('Compétition rejetée avec succès !');
//         fetchCompetitions();
//         setShowDetailsModal(false);
//       } else {
//         const errorData = await response.json();
//         alert(`Erreur: ${errorData.message || 'Impossible de rejeter la compétition'}`);
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//       alert('Erreur lors du rejet');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDelete = async (competitionId) => {
//     try {
//       setActionLoading(true);
//       const token = localStorage.getItem('userToken');
//       const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.ok) {
//         alert('Compétition supprimée avec succès !');
//         fetchCompetitions();
//         setShowDeleteModal(false);
//         setShowDetailsModal(false);
//       } else {
//         const errorData = await response.json();
//         alert(`Erreur: ${errorData.message || 'Impossible de supprimer la compétition'}`);
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//       alert('Erreur lors de la suppression');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleEdit = (competitionId) => {
//     // Redirection vers la page d'édition
//     window.location.href = `/competitions/${competitionId}/edit`;
//   };

//   const handleSuspend = async (competitionId) => {
//     try {
//       setActionLoading(true);
//       const token = localStorage.getItem('userToken');
      
//       // Mettre à jour le statut de la compétition
//       const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ status: 'paused' })
//       });
      
//       if (response.ok) {
//         alert('Compétition suspendue avec succès !');
//         fetchCompetitions();
//         setShowDetailsModal(false);
//       } else {
//         alert('Erreur lors de la suspension');
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//       alert('Erreur lors de la suspension');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     const statusColors = {
//       'draft': '#8B5CF6',
//       'pending_approval': '#3B82F6',
//       'active': '#10B981',
//       'completed': '#F59E0B',
//       'cancelled': '#EF4444',
//       'rejected': '#6B7280',
//       'paused': '#F59E0B'
//     };
//     return statusColors[status] || '#6B7280';
//   };

//   const getStatusText = (status) => {
//     const statusMap = {
//       'draft': 'Brouillon',
//       'pending_approval': 'En attente',
//       'active': 'Actif',
//       'completed': 'Terminé',
//       'cancelled': 'Annulé',
//       'rejected': 'Rejeté',
//       'paused': 'En pause'
//     };
//     return statusMap[status] || status;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleDateString('fr-FR');
//   };

//   return (
//     <div className="competitions-management-page">
//       <CompetitionDetailsModal
//         isOpen={showDetailsModal}
//         competition={selectedCompetition}
//         onClose={() => setShowDetailsModal(false)}
//         onApprove={handleApprove}
//         onReject={handleReject}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//       />

//       <ConfirmationModal
//         isOpen={showDeleteModal}
//         title="Supprimer la compétition"
//         message={`Êtes-vous sûr de vouloir supprimer "${selectedCompetition?.title}" ? Cette action est irréversible.`}
//         onConfirm={() => handleDelete(selectedCompetition?.id)}
//         onCancel={() => {
//           setShowDeleteModal(false);
//           setSelectedCompetition(null);
//         }}
//         confirmText="Supprimer"
//       />

//       <div className="page-header">
//         <div className="header-left">
//           <h1>Gestion des compétitions</h1>
//           <p className="page-subtitle">
//             {competitions.length} compétition{competitions.length > 1 ? 's' : ''} au total
//           </p>
//         </div>
//         <div className="header-right">
//           <button 
//             className="btn-primary"
//             onClick={fetchCompetitions}
//             disabled={loading}
//           >
//             {loading ? 'Chargement...' : '🔄 Actualiser'}
//           </button>
//         </div>
//       </div>

//       <div className="filters-section">
//         <div className="search-box">
//           <input
//             type="text"
//             placeholder="Rechercher une compétition ou organisateur..."
//             value={filters.search}
//             onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
//           />
//           <span className="search-icon">🔍</span>
//         </div>
        
//         <div className="status-filters">
//           <button 
//             className={`filter-btn ${filters.status === 'all' ? 'active' : ''}`}
//             onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))}
//           >
//             Toutes ({competitions.length})
//           </button>
//           <button 
//             className={`filter-btn ${filters.status === 'pending_approval' ? 'active' : ''}`}
//             onClick={() => setFilters(prev => ({ ...prev, status: 'pending_approval' }))}
//           >
//             En attente ({competitions.filter(c => c.status === 'pending_approval').length})
//           </button>
//           <button 
//             className={`filter-btn ${filters.status === 'active' ? 'active' : ''}`}
//             onClick={() => setFilters(prev => ({ ...prev, status: 'active' }))}
//           >
//             Actives ({competitions.filter(c => c.status === 'active').length})
//           </button>
//           <button 
//             className={`filter-btn ${filters.status === 'completed' ? 'active' : ''}`}
//             onClick={() => setFilters(prev => ({ ...prev, status: 'completed' }))}
//           >
//             Terminées ({competitions.filter(c => c.status === 'completed').length})
//           </button>
//           <button 
//             className={`filter-btn ${filters.status === 'draft' ? 'active' : ''}`}
//             onClick={() => setFilters(prev => ({ ...prev, status: 'draft' }))}
//           >
//             Brouillons ({competitions.filter(c => c.status === 'draft').length})
//           </button>
//         </div>
//       </div>
      
//       {loading ? (
//         <div className="loading-container">
//           <div className="spinner"></div>
//           <p>Chargement des compétitions...</p>
//         </div>
//       ) : (
//         <div className="table-container">
//           <div className="table-responsive">
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Titre</th>
//                   <th>Organisateur</th>
//                   <th>Date début</th>
//                   <th>Date fin</th>
//                   <th>Candidats</th>
//                   <th>Votes</th>
//                   <th>Revenus</th>
//                   <th>Statut</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredCompetitions.length > 0 ? (
//                   filteredCompetitions.map((comp) => (
//                     <tr key={comp.id}>
//                       <td className="competition-title-cell">
//                         <div className="title-wrapper">
//                           {comp.coverImageUrl && (
//                             <img 
//                               src={comp.coverImageUrl} 
//                               alt={comp.title} 
//                               className="table-thumbnail"
//                               onError={(e) => {
//                                 e.target.src = 'https://via.placeholder.com/40x40?text=No+Image';
//                               }}
//                             />
//                           )}
//                           <div>
//                             <strong>{comp.title}</strong>
//                             {comp.shortDescription && (
//                               <p className="competition-desc">{comp.shortDescription}</p>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td>
//                         {comp.organizer && (
//                           <div className="organizer-info">
//                             <strong>{comp.organizer.firstName} {comp.organizer.lastName}</strong>
//                             <small>{comp.organizer.email}</small>
//                           </div>
//                         )}
//                       </td>
//                       <td>{formatDate(comp.startDate)}</td>
//                       <td>{formatDate(comp.endDate)}</td>
//                       <td>{comp.candidates?.length || 0}</td>
//                       <td>{comp.totalVotes || 0}</td>
//                       <td className="revenue-cell">
//                         {comp.revenue ? `${comp.revenue.toLocaleString()} XOF` : '-'}
//                       </td>
//                       <td>
//                         <span 
//                           className="status-badge" 
//                           style={{ backgroundColor: getStatusColor(comp.status) }}
//                         >
//                           {getStatusText(comp.status)}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="action-buttons">
//                           <button 
//                             className="action-btn view-btn"
//                             onClick={() => {
//                               setSelectedCompetition(comp);
//                               setShowDetailsModal(true);
//                             }}
//                             title="Voir détails"
//                           >
//                             📋
//                           </button>
                          
//                           {comp.status === 'pending_approval' && (
//                             <>
//                               <button 
//                                 className="action-btn success-btn"
//                                 onClick={() => handleApprove(comp.id)}
//                                 title="Approuver"
//                                 disabled={actionLoading}
//                               >
//                                 ✅
//                               </button>
//                             </>
//                           )}
                          
//                           {comp.status === 'active' && (
//                             <button 
//                               className="action-btn warning-btn"
//                               onClick={() => handleSuspend(comp.id)}
//                               title="Suspendre"
//                               disabled={actionLoading}
//                             >
//                               ⏸️
//                             </button>
//                           )}
                          
//                           <button 
//                             className="action-btn delete-btn"
//                             onClick={() => {
//                               setSelectedCompetition(comp);
//                               setShowDeleteModal(true);
//                             }}
//                             title="Supprimer"
//                             disabled={actionLoading}
//                           >
//                             🗑️
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="9" className="no-data">
//                       <p>Aucune compétition trouvée</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const OrganizersManagementPage = () => {
//   const [organizers, setOrganizers] = useState([]);
//   const [filteredOrganizers, setFilteredOrganizers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     status: 'all',
//     search: ''
//   });
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedOrganizer, setSelectedOrganizer] = useState(null);
//   const [actionLoading, setActionLoading] = useState(false);
//   const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

//   useEffect(() => {
//     fetchOrganizers();
//   }, []);

//   useEffect(() => {
//     filterOrganizers();
//   }, [filters, organizers]);

//   const fetchOrganizers = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('userToken');
      
//       // Récupérer tous les utilisateurs
//       const response = await fetch(`${API_BASE_URL}/users?limit=100&sort=createdAt:desc`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         const allUsers = data.data || data || [];
        
//         // Filtrer pour ne garder que les organisateurs
//         const organizersOnly = allUsers.filter(user => user.role === 'organizer');
//         setOrganizers(organizersOnly);
//         setFilteredOrganizers(organizersOnly);
//       }
//     } catch (error) {
//       console.error('Erreur organisateurs:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterOrganizers = () => {
//     let filtered = [...organizers];
    
//     if (filters.status !== 'all') {
//       filtered = filtered.filter(org => 
//         filters.status === 'active' ? org.isActive : !org.isActive
//       );
//     }
    
//     if (filters.search) {
//       const searchLower = filters.search.toLowerCase();
//       filtered = filtered.filter(org => 
//         org.firstName?.toLowerCase().includes(searchLower) ||
//         org.lastName?.toLowerCase().includes(searchLower) ||
//         org.email?.toLowerCase().includes(searchLower) ||
//         org.agency?.name?.toLowerCase().includes(searchLower)
//       );
//     }
    
//     setFilteredOrganizers(filtered);
//   };

//   const handleStatusChange = async (organizerId, isActive) => {
//     try {
//       setActionLoading(true);
//       const token = localStorage.getItem('userToken');
//       const response = await fetch(`${API_BASE_URL}/admin/users/${organizerId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ isActive })
//       });
      
//       if (response.ok) {
//         alert(`Organisateur ${isActive ? 'activé' : 'désactivé'} avec succès !`);
//         fetchOrganizers();
//       } else {
//         alert('Erreur lors du changement de statut');
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//       alert('Erreur lors du changement de statut');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleVerifyAgency = async (organizerId, isVerified) => {
//     try {
//       setActionLoading(true);
//       const token = localStorage.getItem('userToken');
      
//       // D'abord récupérer l'agence de l'organisateur
//       const org = organizers.find(o => o.id === organizerId);
//       if (!org?.agency?.id) {
//         alert('Aucune agence trouvée pour cet organisateur');
//         return;
//       }
      
//       const response = await fetch(`${API_BASE_URL}/admin/agencies/${org.agency.id}/verify`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ isVerified })
//       });
      
//       if (response.ok) {
//         alert(`Agence ${isVerified ? 'vérifiée' : 'désactivée'} avec succès !`);
//         fetchOrganizers();
//       } else {
//         alert('Erreur lors de la vérification de l\'agence');
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//       alert('Erreur lors de la vérification de l\'agence');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDelete = async (organizerId) => {
//     try {
//       setActionLoading(true);
//       const token = localStorage.getItem('userToken');
//       const response = await fetch(`${API_BASE_URL}/users/${organizerId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.ok) {
//         alert('Organisateur supprimé avec succès !');
//         fetchOrganizers();
//         setShowDeleteModal(false);
//       } else {
//         alert('Erreur lors de la suppression');
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//       alert('Erreur lors de la suppression');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleDateString('fr-FR');
//   };

//   return (
//     <div className="organizers-management-page">
//       <ConfirmationModal
//         isOpen={showDeleteModal}
//         title="Supprimer l'organisateur"
//         message={`Êtes-vous sûr de vouloir supprimer l'organisateur ${selectedOrganizer?.firstName} ${selectedOrganizer?.lastName} ? Cette action supprimera également son agence et toutes ses compétitions.`}
//         onConfirm={() => handleDelete(selectedOrganizer?.id)}
//         onCancel={() => {
//           setShowDeleteModal(false);
//           setSelectedOrganizer(null);
//         }}
//         confirmText="Supprimer"
//       />

//       <div className="page-header">
//         <div className="header-left">
//           <h1>Gestion des organisateurs</h1>
//           <p className="page-subtitle">
//             {organizers.length} organisateur{organizers.length > 1 ? 's' : ''} au total
//           </p>
//         </div>
//         <div className="header-right">
//           <button 
//             className="btn-primary"
//             onClick={fetchOrganizers}
//             disabled={loading}
//           >
//             {loading ? 'Chargement...' : '🔄 Actualiser'}
//           </button>
//         </div>
//       </div>

//       <div className="filters-section">
//         <div className="search-box">
//           <input
//             type="text"
//             placeholder="Rechercher un organisateur..."
//             value={filters.search}
//             onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
//           />
//           <span className="search-icon">🔍</span>
//         </div>
        
//         <div className="status-filters">
//           <button 
//             className={`filter-btn ${filters.status === 'all' ? 'active' : ''}`}
//             onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))}
//           >
//             Tous ({organizers.length})
//           </button>
//           <button 
//             className={`filter-btn ${filters.status === 'active' ? 'active' : ''}`}
//             onClick={() => setFilters(prev => ({ ...prev, status: 'active' }))}
//           >
//             Actifs ({organizers.filter(o => o.isActive).length})
//           </button>
//           <button 
//             className={`filter-btn ${filters.status === 'inactive' ? 'active' : ''}`}
//             onClick={() => setFilters(prev => ({ ...prev, status: 'inactive' }))}
//           >
//             Inactifs ({organizers.filter(o => !o.isActive).length})
//           </button>
//           <button 
//             className={`filter-btn ${filters.status === 'verified' ? 'active' : ''}`}
//             onClick={() => setFilters(prev => ({ ...prev, status: 'verified' }))}
//           >
//             Vérifiés ({organizers.filter(o => o.agency?.isVerified).length})
//           </button>
//         </div>
//       </div>
      
//       {loading ? (
//         <div className="loading-container">
//           <div className="spinner"></div>
//           <p>Chargement des organisateurs...</p>
//         </div>
//       ) : (
//         <div className="table-container">
//           <div className="table-responsive">
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Organisateur</th>
//                   <th>Email</th>
//                   <th>Agence</th>
//                   <th>Date d'inscription</th>
//                   <th>Compétitions</th>
//                   <th>Statut Compte</th>
//                   <th>Statut Agence</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredOrganizers.length > 0 ? (
//                   filteredOrganizers.map((org) => (
//                     <tr key={org.id}>
//                       <td className="user-info-cell">
//                         <div className="user-avatar-small">
//                           <span>{org.firstName?.charAt(0)}{org.lastName?.charAt(0)}</span>
//                         </div>
//                         <div className="user-details">
//                           <strong>{org.firstName} {org.lastName}</strong>
//                           <small>{org.phoneNumber || 'Téléphone non défini'}</small>
//                         </div>
//                       </td>
//                       <td>{org.email}</td>
//                       <td>
//                         {org.agency ? (
//                           <div className="agency-info">
//                             <strong>{org.agency.name}</strong>
//                             <small>{org.agency.slug}</small>
//                           </div>
//                         ) : (
//                           <span className="text-muted">Aucune agence</span>
//                         )}
//                       </td>
//                       <td>{formatDate(org.createdAt)}</td>
//                       <td>{org.stats?.competitions || 0}</td>
//                       <td>
//                         <span className={`status-badge ${org.isActive ? 'active' : 'inactive'}`}>
//                           {org.isActive ? 'Actif' : 'Inactif'}
//                         </span>
//                       </td>
//                       <td>
//                         {org.agency ? (
//                           <span className={`status-badge ${org.agency.isVerified ? 'verified' : 'pending'}`}>
//                             {org.agency.isVerified ? 'Vérifiée' : 'En attente'}
//                           </span>
//                         ) : (
//                           <span className="text-muted">-</span>
//                         )}
//                       </td>
//                       <td>
//                         <div className="action-buttons">
//                           <button 
//                             className={`action-btn ${org.isActive ? 'warning-btn' : 'success-btn'}`}
//                             onClick={() => handleStatusChange(org.id, !org.isActive)}
//                             title={org.isActive ? 'Désactiver le compte' : 'Activer le compte'}
//                             disabled={actionLoading}
//                           >
//                             {org.isActive ? '⏸️' : '▶️'}
//                           </button>
                          
//                           {org.agency && !org.agency.isVerified && (
//                             <button 
//                               className="action-btn success-btn"
//                               onClick={() => handleVerifyAgency(org.id, true)}
//                               title="Vérifier l'agence"
//                               disabled={actionLoading}
//                             >
//                               ✅
//                             </button>
//                           )}
                          
//                           {org.agency && org.agency.isVerified && (
//                             <button 
//                               className="action-btn warning-btn"
//                               onClick={() => handleVerifyAgency(org.id, false)}
//                               title="Retirer la vérification"
//                               disabled={actionLoading}
//                             >
//                               ❌
//                             </button>
//                           )}
                          
//                           <button 
//                             className="action-btn delete-btn"
//                             onClick={() => {
//                               setSelectedOrganizer(org);
//                               setShowDeleteModal(true);
//                             }}
//                             title="Supprimer l'organisateur"
//                             disabled={actionLoading}
//                           >
//                             🗑️
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="no-data">
//                       <p>Aucun organisateur trouvé</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const UsersManagementPage = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     role: 'all',
//     status: 'all',
//     search: ''
//   });
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [actionLoading, setActionLoading] = useState(false);
//   const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     filterUsers();
//   }, [filters, users]);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('userToken');
      
//       const response = await fetch(`${API_BASE_URL}/users?limit=100&sort=createdAt:desc`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         const allUsers = data.data || data || [];
//         setUsers(allUsers);
//         setFilteredUsers(allUsers);
//       }
//     } catch (error) {
//       console.error('Erreur utilisateurs:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterUsers = () => {
//     let filtered = [...users];
    
//     if (filters.role !== 'all') {
//       filtered = filtered.filter(user => user.role === filters.role);
//     }
    
//     if (filters.status !== 'all') {
//       filtered = filtered.filter(user => 
//         filters.status === 'active' ? user.isActive : !user.isActive
//       );
//     }
    
//     if (filters.search) {
//       const searchLower = filters.search.toLowerCase();
//       filtered = filtered.filter(user => 
//         user.firstName?.toLowerCase().includes(searchLower) ||
//         user.lastName?.toLowerCase().includes(searchLower) ||
//         user.email?.toLowerCase().includes(searchLower)
//       );
//     }
    
//     setFilteredUsers(filtered);
//   };

//   const handleRoleChange = async (userId, newRole) => {
//     if (!window.confirm(`Êtes-vous sûr de vouloir changer le rôle de cet utilisateur ?`)) {
//       return;
//     }

//     try {
//       setActionLoading(true);
//       const token = localStorage.getItem('userToken');
//       const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ role: newRole })
//       });
      
//       if (response.ok) {
//         alert('Rôle modifié avec succès !');
//         fetchUsers();
//       } else {
//         alert('Erreur lors du changement de rôle');
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//       alert('Erreur lors du changement de rôle');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleStatusChange = async (userId, isActive) => {
//     try {
//       setActionLoading(true);
//       const token = localStorage.getItem('userToken');
//       const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ isActive })
//       });
      
//       if (response.ok) {
//         alert(`Utilisateur ${isActive ? 'activé' : 'désactivé'} avec succès !`);
//         fetchUsers();
//       } else {
//         alert('Erreur lors du changement de statut');
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//       alert('Erreur lors du changement de statut');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDelete = async (userId) => {
//     try {
//       setActionLoading(true);
//       const token = localStorage.getItem('userToken');
//       const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.ok) {
//         alert('Utilisateur supprimé avec succès !');
//         fetchUsers();
//         setShowDeleteModal(false);
//       } else {
//         alert('Erreur lors de la suppression');
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//       alert('Erreur lors de la suppression');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const getRoleText = (role) => {
//     const roleMap = {
//       'user': 'Utilisateur',
//       'organizer': 'Organisateur',
//       'admin': 'Administrateur',
//       'super_admin': 'Super Admin'
//     };
//     return roleMap[role] || role;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleDateString('fr-FR');
//   };

//   return (
//     <div className="users-management-page">
//       <ConfirmationModal
//         isOpen={showDeleteModal}
//         title="Supprimer l'utilisateur"
//         message={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${selectedUser?.firstName} ${selectedUser?.lastName} ? Cette action est irréversible.`}
//         onConfirm={() => handleDelete(selectedUser?.id)}
//         onCancel={() => {
//           setShowDeleteModal(false);
//           setSelectedUser(null);
//         }}
//         confirmText="Supprimer"
//       />

//       <div className="page-header">
//         <div className="header-left">
//           <h1>Gestion des utilisateurs</h1>
//           <p className="page-subtitle">
//             {users.length} utilisateur{users.length > 1 ? 's' : ''} au total
//           </p>
//         </div>
//         <div className="header-right">
//           <button 
//             className="btn-primary"
//             onClick={fetchUsers}
//             disabled={loading}
//           >
//             {loading ? 'Chargement...' : '🔄 Actualiser'}
//           </button>
//         </div>
//       </div>

//       <div className="filters-section">
//         <div className="search-box">
//           <input
//             type="text"
//             placeholder="Rechercher un utilisateur..."
//             value={filters.search}
//             onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
//           />
//           <span className="search-icon">🔍</span>
//         </div>
        
//         <div className="filter-group">
//           <select 
//             value={filters.role}
//             onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
//             className="filter-select"
//           >
//             <option value="all">Tous les rôles</option>
//             <option value="user">Utilisateurs</option>
//             <option value="organizer">Organisateurs</option>
//             <option value="admin">Administrateurs</option>
//           </select>
          
//           <select 
//             value={filters.status}
//             onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
//             className="filter-select"
//           >
//             <option value="all">Tous les statuts</option>
//             <option value="active">Actifs</option>
//             <option value="inactive">Inactifs</option>
//           </select>
//         </div>
//       </div>
      
//       {loading ? (
//         <div className="loading-container">
//           <div className="spinner"></div>
//           <p>Chargement des utilisateurs...</p>
//         </div>
//       ) : (
//         <div className="table-container">
//           <div className="table-responsive">
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Utilisateur</th>
//                   <th>Email</th>
//                   <th>Rôle</th>
//                   <th>Date inscription</th>
//                   <th>Dernière connexion</th>
//                   <th>Statut</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.length > 0 ? (
//                   filteredUsers.map((user) => (
//                     <tr key={user.id}>
//                       <td className="user-info-cell">
//                         <div className="user-avatar-small">
//                           <span>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</span>
//                         </div>
//                         <div className="user-details">
//                           <strong>{user.firstName} {user.lastName}</strong>
//                           <small>{user.phoneNumber || 'Non défini'}</small>
//                         </div>
//                       </td>
//                       <td>{user.email}</td>
//                       <td>
//                         <span className={`role-badge ${user.role}`}>
//                           {getRoleText(user.role)}
//                         </span>
//                       </td>
//                       <td>{formatDate(user.createdAt)}</td>
//                       <td>{formatDate(user.lastLogin)}</td>
//                       <td>
//                         <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
//                           {user.isActive ? 'Actif' : 'Inactif'}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="action-buttons">
//                           {user.role === 'user' && (
//                             <button 
//                               className="action-btn success-btn"
//                               onClick={() => handleRoleChange(user.id, 'organizer')}
//                               title="Promouvoir en organisateur"
//                               disabled={actionLoading}
//                             >
//                               ⬆️
//                             </button>
//                           )}
                          
//                           {user.role === 'organizer' && (
//                             <button 
//                               className="action-btn warning-btn"
//                               onClick={() => handleRoleChange(user.id, 'user')}
//                               title="Rétrograder en utilisateur"
//                               disabled={actionLoading}
//                             >
//                               ⬇️
//                             </button>
//                           )}
                          
//                           <button 
//                             className={`action-btn ${user.isActive ? 'warning-btn' : 'success-btn'}`}
//                             onClick={() => handleStatusChange(user.id, !user.isActive)}
//                             title={user.isActive ? 'Désactiver' : 'Activer'}
//                             disabled={actionLoading}
//                           >
//                             {user.isActive ? '⏸️' : '▶️'}
//                           </button>
                          
//                           <button 
//                             className="action-btn delete-btn"
//                             onClick={() => {
//                               setSelectedUser(user);
//                               setShowDeleteModal(true);
//                             }}
//                             title="Supprimer"
//                             disabled={actionLoading}
//                           >
//                             🗑️
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="no-data">
//                       <p>Aucun utilisateur trouvé</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const TransactionsManagementPage = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState(null);
//   const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

//   useEffect(() => {
//     fetchTransactions();
//     fetchTransactionStats();
//   }, []);

//   const fetchTransactions = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('userToken');
      
//       const response = await fetch(`${API_BASE_URL}/admin/transactions?limit=50&sort=createdAt:desc`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setTransactions(data.data || data || []);
//       }
//     } catch (error) {
//       console.error('Erreur transactions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTransactionStats = async () => {
//     try {
//       const token = localStorage.getItem('userToken');
//       const response = await fetch(`${API_BASE_URL}/admin/transactions/statistics?period=month`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setStats(data);
//       }
//     } catch (error) {
//       console.error('Erreur statistiques:', error);
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       'success': '#10B981',
//       'pending': '#F59E0B',
//       'failed': '#EF4444',
//       'cancelled': '#6B7280',
//       'refunded': '#8B5CF6'
//     };
//     return colors[status] || '#6B7280';
//   };

//   const getStatusText = (status) => {
//     const map = {
//       'success': 'Réussi',
//       'pending': 'En attente',
//       'failed': 'Échoué',
//       'cancelled': 'Annulé',
//       'refunded': 'Remboursé'
//     };
//     return map[status] || status;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleString('fr-FR');
//   };

//   return (
//     <div className="transactions-management-page">
//       <div className="page-header">
//         <div className="header-left">
//           <h1>Gestion des transactions</h1>
//           <p className="page-subtitle">
//             Surveillance des paiements et remboursements
//           </p>
//         </div>
//         <div className="header-right">
//           <button 
//             className="btn-primary"
//             onClick={() => {
//               fetchTransactions();
//               fetchTransactionStats();
//             }}
//             disabled={loading}
//           >
//             {loading ? 'Chargement...' : '🔄 Actualiser'}
//           </button>
//         </div>
//       </div>

//       {stats && (
//         <div className="stats-section">
//           <div className="stats-grid">
//             <div className="stat-card">
//               <div className="stat-icon">💰</div>
//               <div className="stat-info">
//                 <h3>Chiffre d'affaires</h3>
//                 <p className="stat-value">{(stats.totalAmount || 0).toLocaleString()} XOF</p>
//                 <span className="stat-change">Ce mois</span>
//               </div>
//             </div>
            
//             <div className="stat-card">
//               <div className="stat-icon">📊</div>
//               <div className="stat-info">
//                 <h3>Transactions</h3>
//                 <p className="stat-value">{stats.totalTransactions || 0}</p>
//                 <span className="stat-change">{stats.successRate || 0}% de réussite</span>
//               </div>
//             </div>
            
//             <div className="stat-card">
//               <div className="stat-icon">✅</div>
//               <div className="stat-info">
//                 <h3>Réussies</h3>
//                 <p className="stat-value">{stats.successfulTransactions || 0}</p>
//                 <span className="stat-change">+{stats.successChange || 0}%</span>
//               </div>
//             </div>
            
//             <div className="stat-card">
//               <div className="stat-icon">❌</div>
//               <div className="stat-info">
//                 <h3>Échouées</h3>
//                 <p className="stat-value">{stats.failedTransactions || 0}</p>
//                 <span className="stat-change">-{stats.failedChange || 0}%</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {loading ? (
//         <div className="loading-container">
//           <div className="spinner"></div>
//           <p>Chargement des transactions...</p>
//         </div>
//       ) : (
//         <div className="table-container">
//           <div className="table-responsive">
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>ID Transaction</th>
//                   <th>Utilisateur</th>
//                   <th>Compétition</th>
//                   <th>Montant</th>
//                   <th>Méthode</th>
//                   <th>Statut</th>
//                   <th>Date</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {transactions.length > 0 ? (
//                   transactions.map((transaction) => (
//                     <tr key={transaction.id}>
//                       <td className="transaction-id">#{transaction.transactionId?.substring(0, 8) || transaction.id?.substring(0, 8)}</td>
//                       <td>
//                         <div className="user-info-small">
//                           <strong>{transaction.user?.firstName} {transaction.user?.lastName}</strong>
//                           <small>{transaction.user?.email}</small>
//                         </div>
//                       </td>
//                       <td>{transaction.competition?.title || 'N/A'}</td>
//                       <td className="amount">{transaction.amount?.toLocaleString()} XOF</td>
//                       <td>
//                         <span className="payment-method">{transaction.paymentMethod || 'Inconnue'}</span>
//                       </td>
//                       <td>
//                         <span 
//                           className="status-badge" 
//                           style={{ backgroundColor: getStatusColor(transaction.status) }}
//                         >
//                           {getStatusText(transaction.status)}
//                         </span>
//                       </td>
//                       <td>{formatDate(transaction.createdAt)}</td>
//                       <td>
//                         <div className="action-buttons">
//                           <button className="action-btn view-btn" title="Voir détails">
//                             👁️
//                           </button>
//                           {transaction.status === 'pending' && (
//                             <button className="action-btn success-btn" title="Valider">
//                               ✅
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="no-data">
//                       <p>Aucune transaction trouvée</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Ajouter ce composant à la suite des autres pages (après TransactionsManagementPage par exemple)
// const EditCompetitionPage = () => {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [competition, setCompetition] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     shortDescription: '',
//     startDate: '',
//     endDate: '',
//     votePrice: 100,
//     minVotesPerTransaction: 1,
//     maxVotesPerTransaction: 100,
//     coverImageUrl: '',
//     sections: []
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

//   useEffect(() => {
//     const fetchCompetition = async () => {
//       try {
//         setLoading(true);
//         setError('');
        
//         // Récupérer l'ID depuis l'URL ou le localStorage
//         const pathParts = window.location.pathname.split('/');
//         const competitionId = pathParts[pathParts.length - 2] === 'edit' 
//           ? pathParts[pathParts.length - 1] 
//           : pathParts[pathParts.length - 1].replace('/edit', '');
        
//         // Vérifier d'abord le localStorage
//         const storedCompetition = localStorage.getItem('editingCompetition');
//         if (storedCompetition) {
//           const parsedCompetition = JSON.parse(storedCompetition);
//           if (parsedCompetition.id === competitionId) {
//             setCompetition(parsedCompetition);
//             setFormData({
//               title: parsedCompetition.title || '',
//               description: parsedCompetition.description || '',
//               shortDescription: parsedCompetition.shortDescription || '',
//               startDate: parsedCompetition.startDate ? new Date(parsedCompetition.startDate).toISOString().split('T')[0] : '',
//               endDate: parsedCompetition.endDate ? new Date(parsedCompetition.endDate).toISOString().split('T')[0] : '',
//               votePrice: parsedCompetition.votePrice || 100,
//               minVotesPerTransaction: parsedCompetition.minVotesPerTransaction || 1,
//               maxVotesPerTransaction: parsedCompetition.maxVotesPerTransaction || 100,
//               coverImageUrl: parsedCompetition.coverImageUrl || '',
//               sections: parsedCompetition.sections || []
//             });
//             setLoading(false);
//             return;
//           }
//         }
        
//         // Si pas dans localStorage, récupérer depuis l'API
//         const token = localStorage.getItem('userToken');
//         const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error('Impossible de charger la compétition');
//         }
        
//         const data = await response.json();
//         setCompetition(data);
//         setFormData({
//           title: data.title || '',
//           description: data.description || '',
//           shortDescription: data.shortDescription || '',
//           startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
//           endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
//           votePrice: data.votePrice || 100,
//           minVotesPerTransaction: data.minVotesPerTransaction || 1,
//           maxVotesPerTransaction: data.maxVotesPerTransaction || 100,
//           coverImageUrl: data.coverImageUrl || '',
//           sections: data.sections || []
//         });
        
//       } catch (err) {
//         setError(err.message);
//         console.error('Erreur:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchCompetition();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSectionChange = (index, field, value) => {
//     const updatedSections = [...formData.sections];
//     updatedSections[index] = {
//       ...updatedSections[index],
//       [field]: value
//     };
//     setFormData(prev => ({
//       ...prev,
//       sections: updatedSections
//     }));
//   };

//   const addSection = () => {
//     setFormData(prev => ({
//       ...prev,
//       sections: [
//         ...prev.sections,
//         {
//           title: '',
//           description: '',
//           displayOrder: prev.sections.length + 1
//         }
//       ]
//     }));
//   };

//   const removeSection = (index) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette section ?')) {
//       const updatedSections = formData.sections.filter((_, i) => i !== index);
//       setFormData(prev => ({
//         ...prev,
//         sections: updatedSections
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       setSaving(true);
//       setError('');
//       setSuccess('');
      
//       // Validation
//       if (!formData.title.trim()) {
//         throw new Error('Le titre est requis');
//       }
//       if (!formData.startDate || !formData.endDate) {
//         throw new Error('Les dates de début et de fin sont requises');
//       }
//       if (new Date(formData.endDate) <= new Date(formData.startDate)) {
//         throw new Error('La date de fin doit être après la date de début');
//       }
//       if (formData.votePrice <= 0) {
//         throw new Error('Le prix par vote doit être positif');
//       }
      
//       const token = localStorage.getItem('userToken');
//       const response = await fetch(`${API_BASE_URL}/competitions/${competition.id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Erreur lors de la mise à jour');
//       }
      
//       const updatedData = await response.json();
//       setSuccess('Compétition mise à jour avec succès !');
      
//       // Mettre à jour le localStorage
//       localStorage.setItem('editingCompetition', JSON.stringify(updatedData));
      
//       // Rediriger après un délai
//       setTimeout(() => {
//         window.location.href = '/admin?page=competitions';
//       }, 2000);
      
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     if (window.confirm('Voulez-vous annuler les modifications ?')) {
//       localStorage.removeItem('editingCompetition');
//       window.location.href = '/admin?page=competitions';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="edit-competition-page">
//         <div className="loading-container">
//           <div className="spinner"></div>
//           <p>Chargement de la compétition...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!competition) {
//     return (
//       <div className="edit-competition-page">
//         <div className="error-container">
//           <h2>Compétition non trouvée</h2>
//           <p>La compétition que vous essayez de modifier n'existe pas ou vous n'y avez pas accès.</p>
//           <button 
//             onClick={() => window.location.href = '/admin?page=competitions'}
//             className="btn-secondary"
//           >
//             Retour à la liste
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="edit-competition-page">
//       <div className="page-header">
//         <div className="header-left">
//           <h1>Modifier la compétition</h1>
//           <p className="page-subtitle">{competition.title}</p>
//         </div>
//         <div className="header-right">
//           <button 
//             onClick={handleCancel}
//             className="btn-secondary"
//             disabled={saving}
//           >
//             Annuler
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="alert alert-error">
//           <span className="alert-icon">⚠️</span>
//           <span className="alert-message">{error}</span>
//         </div>
//       )}

//       {success && (
//         <div className="alert alert-success">
//           <span className="alert-icon">✅</span>
//           <span className="alert-message">{success}</span>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="edit-competition-form">
//         <div className="form-grid">
//           {/* Informations de base */}
//           <div className="form-section">
//             <h3>Informations de base</h3>
            
//             <div className="form-group">
//               <label htmlFor="title">Titre de la compétition *</label>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 placeholder="Ex: Festival de musique 2024"
//                 required
//                 disabled={saving}
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="shortDescription">Description courte</label>
//               <input
//                 type="text"
//                 id="shortDescription"
//                 name="shortDescription"
//                 value={formData.shortDescription}
//                 onChange={handleInputChange}
//                 placeholder="Description brève pour les listes"
//                 disabled={saving}
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="description">Description complète</label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 placeholder="Description détaillée de la compétition..."
//                 rows={4}
//                 disabled={saving}
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="coverImageUrl">URL de l'image de couverture</label>
//               <input
//                 type="url"
//                 id="coverImageUrl"
//                 name="coverImageUrl"
//                 value={formData.coverImageUrl}
//                 onChange={handleInputChange}
//                 placeholder="https://exemple.com/image.jpg"
//                 disabled={saving}
//               />
//               {formData.coverImageUrl && (
//                 <div className="image-preview">
//                   <img 
//                     src={formData.coverImageUrl} 
//                     alt="Aperçu" 
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                       e.target.nextElementSibling.style.display = 'block';
//                     }}
//                   />
//                   <div className="image-error" style={{ display: 'none' }}>
//                     Image non disponible
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Dates et prix */}
//           <div className="form-section">
//             <h3>Dates et prix</h3>
            
//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="startDate">Date de début *</label>
//                 <input
//                   type="date"
//                   id="startDate"
//                   name="startDate"
//                   value={formData.startDate}
//                   onChange={handleInputChange}
//                   required
//                   disabled={saving}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="endDate">Date de fin *</label>
//                 <input
//                   type="date"
//                   id="endDate"
//                   name="endDate"
//                   value={formData.endDate}
//                   onChange={handleInputChange}
//                   required
//                   disabled={saving}
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label htmlFor="votePrice">Prix par vote (XOF) *</label>
//               <input
//                 type="number"
//                 id="votePrice"
//                 name="votePrice"
//                 value={formData.votePrice}
//                 onChange={handleInputChange}
//                 min="1"
//                 step="1"
//                 required
//                 disabled={saving}
//               />
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="minVotesPerTransaction">Votes minimum par transaction</label>
//                 <input
//                   type="number"
//                   id="minVotesPerTransaction"
//                   name="minVotesPerTransaction"
//                   value={formData.minVotesPerTransaction}
//                   onChange={handleInputChange}
//                   min="1"
//                   disabled={saving}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="maxVotesPerTransaction">Votes maximum par transaction</label>
//                 <input
//                   type="number"
//                   id="maxVotesPerTransaction"
//                   name="maxVotesPerTransaction"
//                   value={formData.maxVotesPerTransaction}
//                   onChange={handleInputChange}
//                   min="1"
//                   max="1000"
//                   disabled={saving}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Sections */}
//           <div className="form-section">
//             <div className="section-header">
//               <h3>Sections</h3>
//               <button 
//                 type="button"
//                 onClick={addSection}
//                 className="btn-secondary btn-sm"
//                 disabled={saving}
//               >
//                 + Ajouter une section
//               </button>
//             </div>
            
//             {formData.sections.length === 0 ? (
//               <div className="no-sections">
//                 <p>Aucune section définie. Ajoutez des sections pour organiser les candidats.</p>
//               </div>
//             ) : (
//               formData.sections.map((section, index) => (
//                 <div key={index} className="section-item">
//                   <div className="section-header">
//                     <h4>Section {index + 1}</h4>
//                     <button
//                       type="button"
//                       onClick={() => removeSection(index)}
//                       className="btn-danger btn-sm"
//                       disabled={saving}
//                     >
//                       Supprimer
//                     </button>
//                   </div>
                  
//                   <div className="form-group">
//                     <label htmlFor={`section-title-${index}`}>Titre de la section *</label>
//                     <input
//                       type="text"
//                       id={`section-title-${index}`}
//                       value={section.title}
//                       onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
//                       placeholder="Ex: Catégorie chant"
//                       required
//                       disabled={saving}
//                     />
//                   </div>
                  
//                   <div className="form-group">
//                     <label htmlFor={`section-description-${index}`}>Description</label>
//                     <textarea
//                       id={`section-description-${index}`}
//                       value={section.description}
//                       onChange={(e) => handleSectionChange(index, 'description', e.target.value)}
//                       placeholder="Description de la section..."
//                       rows={2}
//                       disabled={saving}
//                     />
//                   </div>
                  
//                   <div className="form-group">
//                     <label htmlFor={`section-order-${index}`}>Ordre d'affichage</label>
//                     <input
//                       type="number"
//                       id={`section-order-${index}`}
//                       value={section.displayOrder || index + 1}
//                       onChange={(e) => handleSectionChange(index, 'displayOrder', parseInt(e.target.value))}
//                       min="1"
//                       disabled={saving}
//                     />
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         <div className="form-actions">
//           <button 
//             type="button"
//             onClick={handleCancel}
//             className="btn-secondary"
//             disabled={saving}
//           >
//             Annuler
//           </button>
//           <button 
//             type="submit" 
//             className="btn-primary"
//             disabled={saving}
//           >
//             {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };
// // Composant principal
// const AdminDashboard = () => {
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme === 'dark';
//   });
  
//   const [activePage, setActivePage] = useState('overview');
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

// useEffect(() => {
//   const token = localStorage.getItem('userToken');
//   const userData = localStorage.getItem('userData');
  
//   if (!token || !userData) {
//     navigate('/login');
//     return;
//   }

//   try {
//     const parsedUser = JSON.parse(userData);
    
//     if (parsedUser.role !== 'admin' && parsedUser.role !== 'super_admin') {
//       navigate('/dashboard');
//       return;
//     }
    
//     setUser(parsedUser);
    
//     // Vérifier l'URL pour déterminer la page active
//     const path = window.location.pathname;
    
//     if (path.includes('/competitions/') && path.includes('/edit')) {
//       // Si c'est une URL d'édition
//       setActivePage('edit-competition');
//     } else if (path.includes('competitions')) {
//       setActivePage('competitions');
//     } else if (path.includes('organizers')) {
//       setActivePage('organizers');
//     } else if (path.includes('users')) {
//       setActivePage('users');
//     } else if (path.includes('transactions')) {
//       setActivePage('transactions');
//     } else if (path.includes('settings')) {
//       setActivePage('settings');
//     } else {
//       setActivePage('overview');
//     }
    
//     setLoading(false);
    
//   } catch (error) {
//     console.error('Erreur:', error);
//     navigate('/login');
//   }
// }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem('userToken');
//       if (token) {
//         await fetch(`${API_BASE_URL}/auth/logout`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//       }
//     } catch (error) {
//       console.error('Erreur déconnexion:', error);
//     }
    
//     localStorage.removeItem('userToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('userData');
//     navigate('/login');
//   };

//   const renderActivePage = () => {
//     switch (activePage) {
//       case 'overview':
//         return <OverviewPage />;
//       case 'competitions':
//         return <CompetitionsManagementPage />;
//       case 'organizers':
//         return <OrganizersManagementPage />;
//       case 'users':
//         return <UsersManagementPage />;
//       case 'transactions':
//         return <TransactionsManagementPage />;
//         case 'edit-competition':
//       return <EditCompetitionPage />;
//       case 'settings':
//         return <div className="settings-page">
//           <h2>Paramètres Administrateur</h2>
//           <p>Gestion des paramètres système (à implémenter)</p>
//         </div>;
//       default:
//         return <OverviewPage />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading-screen">
//         <div className="spinner"></div>
//         <p>Chargement du tableau de bord...</p>
//       </div>
//     );
//   }

//   return (
//     <div className={`admin-dashboard ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
//       {/* Header */}
//       <header className="admin-header">




//         <div className="header-top">
//           <div className="logo" onClick={() => navigate('/')}>
//             <span className="logo-text"></span>
//           </div>




//              <div className="logo" onClick={() => navigate('/')}>
//   <img 
//      src="/assets/images/logo/Klumer_Logo_Orginal.png"  
//     alt="Logo Klumer"        
//     className="logo-img"     
//   />
//   <span className="logo-text"></span>
// </div>
          


          
//           <div className="header-content">
//             <div className="quick-stats">
//               <div className="stat-item">
//                 <span className="stat-label">Rôle:</span>
//                 <span className="stat-value">{user?.role === 'super_admin' ? 'Super Admin' : 'Administrateur'}</span>
//               </div>
//               <div className="stat-item">
//                 <span className="stat-label">Connecté:</span>
//                 <span className="stat-value">{user?.firstName} {user?.lastName}</span>
//               </div>
//             </div>

//             <div className="header-right">
//               <button 
//                 className="theme-toggle-btn"
//                 onClick={() => setIsDarkMode(!isDarkMode)}
//                 title={isDarkMode ? "Mode clair" : "Mode sombre"}
//               >
//                 {isDarkMode ? '☀️' : '🌙'}
//               </button>
              
//               <div className="user-profile">
//                 <div className="user-avatar">
//                   <span>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
//                 </div>
//                 <div className="user-info">
//                   <span className="user-name">{user?.firstName} {user?.lastName}</span>
//                   <span className="user-role">{user?.role === 'super_admin' ? 'Super Admin' : 'Administrateur'}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="header-bottom">
//           <h1 className="dashboard-title">
//             Administration Klumer
//             <span className="welcome-text">Bienvenue, {user?.firstName || 'Administrateur'}</span>
//           </h1>
//           <div className="header-actions">
//             <button className="btn-secondary" onClick={() => navigate('/')}>
//               Accueil public
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Contenu principal */}
//       <div className="dashboard-container">
//         {/* Sidebar */}
//         <aside className="sidebar">
//           <nav className="sidebar-nav">
//             <ul>
//               <li className={`nav-item ${activePage === 'overview' ? 'active' : ''}`}>
//                 <button onClick={() => setActivePage('overview')} className="nav-link">
//                   <span className="nav-icon">📊</span>
//                   <span className="nav-text">Vue d'ensemble</span>
//                 </button>
//               </li>
              
//               <li className="nav-section">GESTION</li>
              
//               <li className={`nav-item ${activePage === 'competitions' ? 'active' : ''}`}>
//                 <button onClick={() => setActivePage('competitions')} className="nav-link">
//                   <span className="nav-icon">🏆</span>
//                   <span className="nav-text">Compétitions</span>
//                 </button>
//               </li>
              
//               <li className={`nav-item ${activePage === 'organizers' ? 'active' : ''}`}>
//                 <button onClick={() => setActivePage('organizers')} className="nav-link">
//                   <span className="nav-icon">🏢</span>
//                   <span className="nav-text">Organisateurs</span>
//                 </button>
//               </li>
              
//               <li className={`nav-item ${activePage === 'users' ? 'active' : ''}`}>
//                 <button onClick={() => setActivePage('users')} className="nav-link">
//                   <span className="nav-icon">👥</span>
//                   <span className="nav-text">Utilisateurs</span>
//                 </button>
//               </li>
              
//               <li className={`nav-item ${activePage === 'transactions' ? 'active' : ''}`}>
//                 <button onClick={() => setActivePage('transactions')} className="nav-link">
//                   <span className="nav-icon">💰</span>
//                   <span className="nav-text">Transactions</span>
//                 </button>
//               </li>
              
//               <li className="nav-section">SYSTÈME</li>
              
//               <li className={`nav-item ${activePage === 'settings' ? 'active' : ''}`}>
//                 <button onClick={() => setActivePage('settings')} className="nav-link">
//                   <span className="nav-icon">⚙️</span>
//                   <span className="nav-text">Paramètres</span>
//                 </button>
//               </li>
              
//               <li className="nav-item logout-item">
//                 <button onClick={handleLogout} className="nav-link logout">
//                   <span className="nav-icon">🚪</span>
//                   <span className="nav-text">Déconnexion</span>
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </aside>

//         {/* Contenu de la page */}
//         <main className="main-content">
//           {renderActivePage()}
//         </main>
//       </div>

//       {/* Footer */}
//       <footer className="admin-footer">
//         <div className="footer-content">
//           <div className="footer-left">
//             <span>© 2024 Klumer Administration. Tous droits réservés.</span>
//           </div>
//           <div className="footer-right">
//             <span>Version: 2.1.0</span>
//             <span>Connecté en tant que: {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</span>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default AdminDashboard;




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  LineChart, Line, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import './Admin.css';

// Composants modaux
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirmer", cancelText = "Annuler", type = "default" }) => {
  if (!isOpen) return null;

  const getButtonClass = () => {
    switch (type) {
      case 'danger': return 'btn-danger';
      case 'success': return 'btn-success';
      case 'warning': return 'btn-warning';
      default: return 'btn-primary';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="confirmation-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn-secondary">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={getButtonClass()}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const StatusModal = ({ isOpen, title, message, type = "success", onClose }) => {
  useEffect(() => {
    if (!isOpen || !onClose) return;
    
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '✅';
    }
  };

  return (
    <div className="modal-overlay">
      <div className={`status-modal ${type}`}>
        <div className="status-icon">{getIcon()}</div>
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
    </div>
  );
};

const CompetitionDetailsModal = ({ isOpen, competition, onClose, onApprove, onReject, onEdit, onDelete, onTogglePause }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!isOpen || !competition) return null;

  const getStatusColor = (status) => {
    const statusColors = {
      'draft': '#8B5CF6',
      'pending_approval': '#3B82F6',
      'active': '#10B981',
      'completed': '#F59E0B',
      'cancelled': '#EF4444',
      'rejected': '#6B7280',
      'paused': '#F59E0B'
    };
    return statusColors[status] || '#6B7280';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'draft': 'Brouillon',
      'pending_approval': 'En attente',
      'active': 'Actif',
      'completed': 'Terminé',
      'cancelled': 'Annulé',
      'rejected': 'Rejeté',
      'paused': 'En pause'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Veuillez fournir une raison pour le rejet');
      return;
    }
    onReject(competition.id, rejectReason);
    setRejectReason('');
    setShowRejectForm(false);
  };

  return (
    <div className="modal-overlay">
      <div className="details-modal admin-modal">
        <div className="modal-header">
          <h2>Détails de la compétition</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="modal-content">
          {competition.coverImageUrl && (
            <div className="competition-cover">
              <img src={competition.coverImageUrl} alt={competition.title} />
            </div>
          )}
          
          <div className="details-grid">
            <div className="detail-section">
              <h3>Informations générales</h3>
              <div className="detail-item">
                <span className="detail-label">Titre :</span>
                <span className="detail-value">{competition.title}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Organisateur :</span>
                <span className="detail-value">{competition.organizer?.firstName} {competition.organizer?.lastName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email :</span>
                <span className="detail-value">{competition.organizer?.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Description :</span>
                <span className="detail-value">{competition.description}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Statut :</span>
                <span 
                  className="status-badge" 
                  style={{ backgroundColor: getStatusColor(competition.status) }}
                >
                  {getStatusText(competition.status)}
                </span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Dates importantes</h3>
              <div className="detail-item">
                <span className="detail-label">Début :</span>
                <span className="detail-value">{formatDate(competition.startDate)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fin :</span>
                <span className="detail-value">{formatDate(competition.endDate)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date création :</span>
                <span className="detail-value">{formatDate(competition.createdAt)}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Paramètres</h3>
              <div className="detail-item">
                <span className="detail-label">Prix par vote :</span>
                <span className="detail-value">{competition.votePrice} XOF</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Votes min :</span>
                <span className="detail-value">{competition.minVotesPerTransaction || 1}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Votes max :</span>
                <span className="detail-value">{competition.maxVotesPerTransaction || 100}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Statistiques</h3>
              <div className="detail-item">
                <span className="detail-label">Candidats :</span>
                <span className="detail-value">{competition.candidates?.length || 0}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Total votes :</span>
                <span className="detail-value">{competition.totalVotes || 0}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Revenus :</span>
                <span className="detail-value">{competition.revenue ? `${competition.revenue.toLocaleString()} XOF` : '0 XOF'}</span>
              </div>
            </div>
          </div>

          {showRejectForm && (
            <div className="reject-form">
              <h4>Raison du rejet</h4>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Veuillez indiquer la raison du rejet..."
                rows={3}
              />
              <div className="form-actions">
                <button onClick={() => setShowRejectForm(false)} className="btn-secondary">
                  Annuler
                </button>
                <button onClick={handleReject} className="btn-danger">
                  Confirmer le rejet
                </button>
              </div>
            </div>
          )}

          <div className="modal-actions admin-actions">
            {competition.status === 'pending_approval' && (
              <>
                <button onClick={() => onApprove(competition.id)} className="btn-success">
                  ✅ Approuver
                </button>
                <button 
                  onClick={() => setShowRejectForm(true)} 
                  className="btn-warning"
                >
                  ❌ Rejeter
                </button>
              </>
            )}
            
            {competition.status === 'active' && (
              <button 
                onClick={() => onTogglePause(competition.id, true)} 
                className="btn-warning"
              >
                ⏸️ Mettre en pause
              </button>
            )}

            {competition.status === 'paused' && (
              <button 
                onClick={() => onTogglePause(competition.id, false)} 
                className="btn-success"
              >
                ▶️ Activer
              </button>
            )}

            <button 
              onClick={() => {
                localStorage.setItem('editingCompetition', JSON.stringify(competition));
                onClose();
                window.history.pushState({}, '', `/admin/competitions/${competition.id}/edit`);
                window.dispatchEvent(new PopStateEvent('popstate'));
              }} 
              className="btn-secondary"
            >
              ✏️ Modifier
            </button>
            <button onClick={() => onDelete(competition.id)} className="btn-danger">
              🗑️ Supprimer
            </button>
            <button onClick={onClose} className="btn-secondary">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composants de pages internes
const OverviewPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      const response = await fetch(`${API_BASE_URL}/admin/dashboard?period=monthly`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.statistics) {
          setStats(data.statistics);
          generateChartData(data.statistics);
        }
      }
    } catch (error) {
      console.error('Erreur dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (statistics) => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
    const revenueData = months.map((month, index) => ({
      month,
      revenue: Math.floor(statistics.revenueTotal / 6 * (index + 1) * 0.6 + Math.random() * 100000)
    }));
    setRevenueData(revenueData);

    const userGrowth = [];
    let cumulativeUsers = 0;
    for (let i = 0; i < 30; i++) {
      cumulativeUsers += Math.floor(Math.random() * 5) + 1;
      userGrowth.push({
        date: `${i + 1}/06`,
        users: cumulativeUsers
      });
    }
    setUserGrowthData(userGrowth.slice(-7));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="overview-page">
      <section className="stats-section">
        <div className="section-header">
          <h1 className="section-title">Tableau de bord Administrateur</h1>
          <div className="period-selector">
            <select>
              <option value="monthly">Ce mois</option>
              <option value="weekly">Cette semaine</option>
              <option value="daily">Aujourd'hui</option>
            </select>
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Utilisateurs totaux</h3>
              <p className="stat-value">{stats?.totalUsers?.toLocaleString() || 0}</p>
              <span className="stat-change">{stats?.regularUsers || 0} utilisateurs réguliers</span>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <h3>Compétitions actives</h3>
              <p className="stat-value">{stats?.activeCompetitions || 0}</p>
              <span className="stat-change">{stats?.pendingApprovalCompetitions || 0} en attente</span>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Revenus totaux</h3>
              <p className="stat-value">{(stats?.revenueTotal || 0).toLocaleString()} XOF</p>
              <span className="stat-change">{stats?.totalVotes || 0} votes totaux</span>
            </div>
          </div>
          
          <div className="stat-card danger">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Compétitions</h3>
              <p className="stat-value">{stats?.totalCompetitions || 0}</p>
              <span className="stat-change">{stats?.completedCompetitions || 0} terminées</span>
            </div>
          </div>
        </div>
      </section>

      <div className="charts-section">
        <div className="chart-container">
          <div className="chart-header">
            <h2>Revenus mensuels</h2>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  formatter={(value) => [`${value.toLocaleString()} XOF`, 'Revenus']}
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h2>Croissance des utilisateurs (7 derniers jours)</h2>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                />
                <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const CompetitionsManagementPage = () => {
  const [competitions, setCompetitions] = useState([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusModalData, setStatusModalData] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

  useEffect(() => {
    fetchCompetitions();
  }, []);

  useEffect(() => {
    filterCompetitions();
  }, [filters, competitions]);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      const response = await fetch(`${API_BASE_URL}/competitions?limit=100&sort=createdAt:desc`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCompetitions(data.data || data || []);
        setFilteredCompetitions(data.data || data || []);
      }
    } catch (error) {
      console.error('Erreur compétitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCompetitions = () => {
    let filtered = [...competitions];
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(comp => comp.status === filters.status);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(comp => 
        comp.title?.toLowerCase().includes(searchLower) ||
        comp.organizer?.firstName?.toLowerCase().includes(searchLower) ||
        comp.organizer?.lastName?.toLowerCase().includes(searchLower) ||
        comp.organizer?.email?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredCompetitions(filtered);
  };

  const handleApprove = async (competitionId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setStatusModalData({
          title: 'Validation réussie',
          message: 'La compétition a été validée avec succès. Les votes peuvent maintenant commencer.',
          type: 'success'
        });
        setShowStatusModal(true);
        fetchCompetitions();
        setShowDetailsModal(false);
        setShowApproveModal(false);
      } else {
        const errorData = await response.json();
        setStatusModalData({
          title: 'Erreur',
          message: errorData.message || 'Impossible de valider la compétition',
          type: 'error'
        });
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatusModalData({
        title: 'Erreur',
        message: 'Erreur lors de la validation',
        type: 'error'
      });
      setShowStatusModal(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePause = async (competitionId, pause) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('userToken');
      
      const endpoint = pause 
        ? `${API_BASE_URL}/competitions/${competitionId}/pause`
        : `${API_BASE_URL}/competitions/${competitionId}/activate`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setStatusModalData({
          title: pause ? 'Mise en pause réussie' : 'Activation réussie',
          message: pause 
            ? 'La compétition a été mise en pause avec succès.'
            : 'La compétition a été activée avec succès.',
          type: 'success'
        });
        setShowStatusModal(true);
        fetchCompetitions();
        setShowDetailsModal(false);
        setShowPauseModal(false);
      } else {
        const errorData = await response.json();
        setStatusModalData({
          title: 'Erreur',
          message: errorData.message || pause ? 'Impossible de mettre en pause' : 'Impossible d\'activer',
          type: 'error'
        });
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatusModalData({
        title: 'Erreur',
        message: 'Erreur lors de l\'opération',
        type: 'error'
      });
      setShowStatusModal(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (competitionId, reason) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      
      if (response.ok) {
        setStatusModalData({
          title: 'Rejet réussi',
          message: 'La compétition a été rejetée avec succès.',
          type: 'success'
        });
        setShowStatusModal(true);
        fetchCompetitions();
        setShowDetailsModal(false);
      } else {
        const errorData = await response.json();
        setStatusModalData({
          title: 'Erreur',
          message: errorData.message || 'Impossible de rejeter la compétition',
          type: 'error'
        });
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatusModalData({
        title: 'Erreur',
        message: 'Erreur lors du rejet',
        type: 'error'
      });
      setShowStatusModal(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (competitionId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setStatusModalData({
          title: 'Suppression réussie',
          message: 'La compétition a été supprimée avec succès.',
          type: 'success'
        });
        setShowStatusModal(true);
        fetchCompetitions();
        setShowDeleteModal(false);
        setShowDetailsModal(false);
      } else {
        const errorData = await response.json();
        setStatusModalData({
          title: 'Erreur',
          message: errorData.message || 'Impossible de supprimer la compétition',
          type: 'error'
        });
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatusModalData({
        title: 'Erreur',
        message: 'Erreur lors de la suppression',
        type: 'error'
      });
      setShowStatusModal(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (competitionId) => {
    window.location.href = `/competitions/${competitionId}/edit`;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'draft': '#8B5CF6',
      'pending_approval': '#3B82F6',
      'active': '#10B981',
      'completed': '#F59E0B',
      'cancelled': '#EF4444',
      'rejected': '#6B7280',
      'paused': '#F59E0B'
    };
    return statusColors[status] || '#6B7280';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'draft': 'Brouillon',
      'pending_approval': 'En attente',
      'active': 'Actif',
      'completed': 'Terminé',
      'cancelled': 'Annulé',
      'rejected': 'Rejeté',
      'paused': 'En pause'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="competitions-management-page">
      <CompetitionDetailsModal
        isOpen={showDetailsModal}
        competition={selectedCompetition}
        onClose={() => setShowDetailsModal(false)}
        onApprove={(id) => setShowApproveModal(true)}
        onReject={handleReject}
        onEdit={handleEdit}
        onDelete={(id) => {
          setSelectedCompetition(competitions.find(c => c.id === id));
          setShowDeleteModal(true);
        }}
        onTogglePause={(id, pause) => {
          setSelectedCompetition(competitions.find(c => c.id === id));
          setShowPauseModal(true);
        }}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Supprimer la compétition"
        message={`Êtes-vous sûr de vouloir supprimer "${selectedCompetition?.title}" ? Cette action est irréversible.`}
        onConfirm={() => handleDelete(selectedCompetition?.id)}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedCompetition(null);
        }}
        confirmText="Supprimer"
        type="danger"
      />

      <ConfirmationModal
        isOpen={showApproveModal}
        title="Valider la compétition"
        message={`Voulez-vous vraiment valider "${selectedCompetition?.title}" ? Après validation, les votes pourront commencer. Assurez-vous d'avoir vérifié tous les détails de la compétition.`}
        onConfirm={() => handleApprove(selectedCompetition?.id)}
        onCancel={() => {
          setShowApproveModal(false);
          setSelectedCompetition(null);
        }}
        confirmText="Valider et démarrer les votes"
        type="success"
      />

      <ConfirmationModal
        isOpen={showPauseModal}
        title={selectedCompetition?.status === 'active' ? "Mettre en pause" : "Activer"}
        message={
          selectedCompetition?.status === 'active' 
            ? `Voulez-vous vraiment mettre en pause "${selectedCompetition?.title}" ? Les votes seront suspendus jusqu'à nouvel ordre.`
            : `Voulez-vous vraiment activer "${selectedCompetition?.title}" ? Les votes pourront reprendre.`
        }
        onConfirm={() => handleTogglePause(
          selectedCompetition?.id, 
          selectedCompetition?.status === 'active'
        )}
        onCancel={() => {
          setShowPauseModal(false);
          setSelectedCompetition(null);
        }}
        confirmText={selectedCompetition?.status === 'active' ? "Mettre en pause" : "Activer"}
        type={selectedCompetition?.status === 'active' ? "warning" : "success"}
      />

      <StatusModal
        isOpen={showStatusModal}
        title={statusModalData.title}
        message={statusModalData.message}
        type={statusModalData.type}
        onClose={() => setShowStatusModal(false)}
      />

      <div className="page-header">
        <div className="header-left">
          <h1>Gestion des compétitions</h1>
          <p className="page-subtitle">
            {competitions.length} compétition{competitions.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <div className="header-right">
          <button 
            className="btn-primary"
            onClick={fetchCompetitions}
            disabled={loading}
          >
            {loading ? 'Chargement...' : '🔄 Actualiser'}
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher une compétition ou organisateur..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="status-filters">
          <button 
            className={`filter-btn ${filters.status === 'all' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))}
          >
            Toutes ({competitions.length})
          </button>
          <button 
            className={`filter-btn ${filters.status === 'pending_approval' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, status: 'pending_approval' }))}
          >
            En attente ({competitions.filter(c => c.status === 'pending_approval').length})
          </button>
          <button 
            className={`filter-btn ${filters.status === 'active' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, status: 'active' }))}
          >
            Actives ({competitions.filter(c => c.status === 'active').length})
          </button>
          <button 
            className={`filter-btn ${filters.status === 'completed' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, status: 'completed' }))}
          >
            Terminées ({competitions.filter(c => c.status === 'completed').length})
          </button>
          <button 
            className={`filter-btn ${filters.status === 'paused' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, status: 'paused' }))}
          >
            En pause ({competitions.filter(c => c.status === 'paused').length})
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des compétitions...</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Organisateur</th>
                  <th>Date début</th>
                  <th>Date fin</th>
                  <th>Candidats</th>
                  <th>Votes</th>
                  <th>Revenus</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompetitions.length > 0 ? (
                  filteredCompetitions.map((comp) => (
                    <tr key={comp.id}>
                      <td className="competition-title-cell">
                        <div className="title-wrapper">
                          {comp.coverImageUrl && (
                            <img 
                              src={comp.coverImageUrl} 
                              alt={comp.title} 
                              className="table-thumbnail"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/40x40?text=No+Image';
                              }}
                            />
                          )}
                          <div>
                            <strong>{comp.title}</strong>
                            {comp.shortDescription && (
                              <p className="competition-desc">{comp.shortDescription}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        {comp.organizer && (
                          <div className="organizer-info">
                            <strong>{comp.organizer.firstName} {comp.organizer.lastName}</strong>
                            <small>{comp.organizer.email}</small>
                          </div>
                        )}
                      </td>
                      <td>{formatDate(comp.startDate)}</td>
                      <td>{formatDate(comp.endDate)}</td>
                      <td>{comp.candidates?.length || 0}</td>
                      <td>{comp.totalVotes || 0}</td>
                      <td className="revenue-cell">
                        {comp.revenue ? `${comp.revenue.toLocaleString()} XOF` : '-'}
                      </td>
                      <td>
                        <span 
                          className="status-badge" 
                          style={{ backgroundColor: getStatusColor(comp.status) }}
                        >
                          {getStatusText(comp.status)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn view-btn"
                            onClick={() => {
                              setSelectedCompetition(comp);
                              setShowDetailsModal(true);
                            }}
                            title="Voir détails"
                          >
                            📋
                          </button>
                          
                          {comp.status === 'pending_approval' && (
                            <button 
                              className="action-btn success-btn"
                              onClick={() => {
                                setSelectedCompetition(comp);
                                setShowApproveModal(true);
                              }}
                              title="Valider"
                              disabled={actionLoading}
                            >
                              ✅
                            </button>
                          )}
                          
                          {comp.status === 'active' && (
                            <button 
                              className="action-btn warning-btn"
                              onClick={() => {
                                setSelectedCompetition(comp);
                                setShowPauseModal(true);
                              }}
                              title="Mettre en pause"
                              disabled={actionLoading}
                            >
                              ⏸️
                            </button>
                          )}

                          {comp.status === 'paused' && (
                            <button 
                              className="action-btn success-btn"
                              onClick={() => {
                                setSelectedCompetition(comp);
                                setShowPauseModal(true);
                              }}
                              title="Activer"
                              disabled={actionLoading}
                            >
                              ▶️
                            </button>
                          )}
                          
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => {
                              setSelectedCompetition(comp);
                              setShowDeleteModal(true);
                            }}
                            title="Supprimer"
                            disabled={actionLoading}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-data">
                      <p>Aucune compétition trouvée</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const OrganizersManagementPage = () => {
  const [organizers, setOrganizers] = useState([]);
  const [filteredOrganizers, setFilteredOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusModalData, setStatusModalData] = useState({});
  const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

  useEffect(() => {
    fetchOrganizers();
  }, []);

  useEffect(() => {
    filterOrganizers();
  }, [filters, organizers]);

  const fetchOrganizers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      const response = await fetch(`${API_BASE_URL}/users?limit=100&sort=createdAt:desc`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const allUsers = data.data || data || [];
        const organizersOnly = allUsers.filter(user => user.role === 'organizer');
        setOrganizers(organizersOnly);
        setFilteredOrganizers(organizersOnly);
      }
    } catch (error) {
      console.error('Erreur organisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrganizers = () => {
    let filtered = [...organizers];
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(org => 
        filters.status === 'active' ? org.isActive : !org.isActive
      );
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(org => 
        org.firstName?.toLowerCase().includes(searchLower) ||
        org.lastName?.toLowerCase().includes(searchLower) ||
        org.email?.toLowerCase().includes(searchLower) ||
        org.agency?.name?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredOrganizers(filtered);
  };

  const handleStatusChange = async (organizerId, isActive) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/admin/users/${organizerId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      });
      
      if (response.ok) {
        setStatusModalData({
          title: isActive ? 'Compte activé' : 'Compte désactivé',
          message: isActive 
            ? 'Le compte organisateur a été activé avec succès.'
            : 'Le compte organisateur a été désactivé avec succès.',
          type: 'success'
        });
        setShowStatusModal(true);
        setShowDeactivateModal(false);
        fetchOrganizers();
      } else {
        setStatusModalData({
          title: 'Erreur',
          message: 'Erreur lors du changement de statut',
          type: 'error'
        });
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatusModalData({
        title: 'Erreur',
        message: 'Erreur lors du changement de statut',
        type: 'error'
      });
      setShowStatusModal(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendAccount = async (organizerId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/admin/users/${organizerId}/suspend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'Suspension administrative' })
      });
      
      if (response.ok) {
        setStatusModalData({
          title: 'Compte suspendu',
          message: 'Le compte organisateur a été suspendu avec succès.',
          type: 'success'
        });
        setShowStatusModal(true);
        setShowSuspendModal(false);
        fetchOrganizers();
      } else {
        setStatusModalData({
          title: 'Erreur',
          message: 'Erreur lors de la suspension',
          type: 'error'
        });
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatusModalData({
        title: 'Erreur',
        message: 'Erreur lors de la suspension',
        type: 'error'
      });
      setShowStatusModal(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyAgency = async (organizerId, isVerified) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('userToken');
      
      const org = organizers.find(o => o.id === organizerId);
      if (!org?.agency?.id) {
        setStatusModalData({
          title: 'Erreur',
          message: 'Aucune agence trouvée pour cet organisateur',
          type: 'error'
        });
        setShowStatusModal(true);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/admin/agencies/${org.agency.id}/verify`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isVerified })
      });
      
      if (response.ok) {
        setStatusModalData({
          title: isVerified ? 'Agence vérifiée' : 'Vérification retirée',
          message: isVerified 
            ? 'L\'agence a été vérifiée avec succès.'
            : 'La vérification de l\'agence a été retirée.',
          type: 'success'
        });
        setShowStatusModal(true);
        fetchOrganizers();
      } else {
        setStatusModalData({
          title: 'Erreur',
          message: 'Erreur lors de la vérification de l\'agence',
          type: 'error'
        });
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatusModalData({
        title: 'Erreur',
        message: 'Erreur lors de la vérification de l\'agence',
        type: 'error'
      });
      setShowStatusModal(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (organizerId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/users/${organizerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setStatusModalData({
          title: 'Suppression réussie',
          message: 'L\'organisateur a été supprimé avec succès.',
          type: 'success'
        });
        setShowStatusModal(true);
        fetchOrganizers();
        setShowDeleteModal(false);
      } else {
        setStatusModalData({
          title: 'Erreur',
          message: 'Erreur lors de la suppression',
          type: 'error'
        });
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatusModalData({
        title: 'Erreur',
        message: 'Erreur lors de la suppression',
        type: 'error'
      });
      setShowStatusModal(true);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="organizers-management-page">
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Supprimer l'organisateur"
        message={`Êtes-vous sûr de vouloir supprimer l'organisateur ${selectedOrganizer?.firstName} ${selectedOrganizer?.lastName} ? Cette action supprimera également son agence et toutes ses compétitions.`}
        onConfirm={() => handleDelete(selectedOrganizer?.id)}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedOrganizer(null);
        }}
        confirmText="Supprimer"
        type="danger"
      />

      <ConfirmationModal
        isOpen={showSuspendModal}
        title="Suspendre le compte"
        message={`Voulez-vous vraiment suspendre le compte de ${selectedOrganizer?.firstName} ${selectedOrganizer?.lastName} ? L'organisateur ne pourra plus accéder à son compte pendant la suspension.`}
        onConfirm={() => handleSuspendAccount(selectedOrganizer?.id)}
        onCancel={() => {
          setShowSuspendModal(false);
          setSelectedOrganizer(null);
        }}
        confirmText="Suspendre"
        type="warning"
      />

      <ConfirmationModal
        isOpen={showDeactivateModal}
        title={selectedOrganizer?.isActive ? "Désactiver le compte" : "Activer le compte"}
        message={
          selectedOrganizer?.isActive 
            ? `Voulez-vous vraiment désactiver le compte de ${selectedOrganizer?.firstName} ${selectedOrganizer?.lastName} ? L'organisateur ne pourra plus se connecter.`
            : `Voulez-vous vraiment activer le compte de ${selectedOrganizer?.firstName} ${selectedOrganizer?.lastName} ?`
        }
        onConfirm={() => handleStatusChange(selectedOrganizer?.id, !selectedOrganizer?.isActive)}
        onCancel={() => {
          setShowDeactivateModal(false);
          setSelectedOrganizer(null);
        }}
        confirmText={selectedOrganizer?.isActive ? "Désactiver" : "Activer"}
        type={selectedOrganizer?.isActive ? "warning" : "success"}
      />

      <StatusModal
        isOpen={showStatusModal}
        title={statusModalData.title}
        message={statusModalData.message}
        type={statusModalData.type}
        onClose={() => setShowStatusModal(false)}
      />

      <div className="page-header">
        <div className="header-left">
          <h1>Gestion des organisateurs</h1>
          <p className="page-subtitle">
            {organizers.length} organisateur{organizers.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <div className="header-right">
          <button 
            className="btn-primary"
            onClick={fetchOrganizers}
            disabled={loading}
          >
            {loading ? 'Chargement...' : '🔄 Actualiser'}
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher un organisateur..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="status-filters">
          <button 
            className={`filter-btn ${filters.status === 'all' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))}
          >
            Tous ({organizers.length})
          </button>
          <button 
            className={`filter-btn ${filters.status === 'active' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, status: 'active' }))}
          >
            Actifs ({organizers.filter(o => o.isActive).length})
          </button>
          <button 
            className={`filter-btn ${filters.status === 'inactive' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, status: 'inactive' }))}
          >
            Inactifs ({organizers.filter(o => !o.isActive).length})
          </button>
          <button 
            className={`filter-btn ${filters.status === 'verified' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, status: 'verified' }))}
          >
            Vérifiés ({organizers.filter(o => o.agency?.isVerified).length})
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des organisateurs...</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Organisateur</th>
                  <th>Email</th>
                  <th>Agence</th>
                  <th>Date d'inscription</th>
                  <th>Compétitions</th>
                  <th>Statut Compte</th>
                  <th>Statut Agence</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrganizers.length > 0 ? (
                  filteredOrganizers.map((org) => (
                    <tr key={org.id}>
                      <td className="user-info-cell">
                        <div className="user-avatar-small">
                          <span>{org.firstName?.charAt(0)}{org.lastName?.charAt(0)}</span>
                        </div>
                        <div className="user-details">
                          <strong>{org.firstName} {org.lastName}</strong>
                          <small>{org.phoneNumber || 'Téléphone non défini'}</small>
                        </div>
                      </td>
                      <td>{org.email}</td>
                      <td>
                        {org.agency ? (
                          <div className="agency-info">
                            <strong>{org.agency.name}</strong>
                            <small>{org.agency.slug}</small>
                          </div>
                        ) : (
                          <span className="text-muted">Aucune agence</span>
                        )}
                      </td>
                      <td>{formatDate(org.createdAt)}</td>
                      <td>{org.stats?.competitions || 0}</td>
                      <td>
                        <span className={`status-badge ${org.isActive ? 'active' : 'inactive'}`}>
                          {org.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>
                        {org.agency ? (
                          <span className={`status-badge ${org.agency.isVerified ? 'verified' : 'pending'}`}>
                            {org.agency.isVerified ? 'Vérifiée' : 'En attente'}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className={`action-btn ${org.isActive ? 'warning-btn' : 'success-btn'}`}
                            onClick={() => {
                              setSelectedOrganizer(org);
                              setShowDeactivateModal(true);
                            }}
                            title={org.isActive ? 'Désactiver le compte' : 'Activer le compte'}
                            disabled={actionLoading}
                          >
                            {org.isActive ? '⏸️' : '▶️'}
                          </button>
                          
                          <button 
                            className="action-btn warning-btn"
                            onClick={() => {
                              setSelectedOrganizer(org);
                              setShowSuspendModal(true);
                            }}
                            title="Suspendre le compte"
                            disabled={actionLoading}
                          >
                            ⚠️
                          </button>
                          
                          {org.agency && !org.agency.isVerified && (
                            <button 
                              className="action-btn success-btn"
                              onClick={() => handleVerifyAgency(org.id, true)}
                              title="Vérifier l'agence"
                              disabled={actionLoading}
                            >
                              ✅
                            </button>
                          )}
                          
                          {org.agency && org.agency.isVerified && (
                            <button 
                              className="action-btn warning-btn"
                              onClick={() => handleVerifyAgency(org.id, false)}
                              title="Retirer la vérification"
                              disabled={actionLoading}
                            >
                              ❌
                            </button>
                          )}
                          
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => {
                              setSelectedOrganizer(org);
                              setShowDeleteModal(true);
                            }}
                            title="Supprimer l'organisateur"
                            disabled={actionLoading}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">
                      <p>Aucun organisateur trouvé</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const UsersManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    search: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusModalData, setStatusModalData] = useState({});
  const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [filters, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      const response = await fetch(`${API_BASE_URL}/users?limit=100&sort=createdAt:desc`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const allUsers = data.data || data || [];
        setUsers(allUsers);
        setFilteredUsers(allUsers);
      }
    } catch (error) {
      console.error('Erreur utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    
    if (filters.role !== 'all') {
      filtered = filtered.filter(user => user.role === filters.role);
    }
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(user => 
        filters.status === 'active' ? user.isActive : !user.isActive
      );
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredUsers(filtered);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (response.ok) {
        setStatusModalData({
          title: 'Rôle modifié',
          message: `Le rôle de l'utilisateur a été changé en ${newRole === 'organizer' ? 'Organisateur' : 'Utilisateur'}.`,
          type: 'success'
        });
        setShowStatusModal(true);
        fetchUsers();
      } else {
        setStatusModalData({
          title: 'Erreur',
          message: 'Erreur lors du changement de rôle',
          type: 'error'
        });
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatusModalData({
        title: 'Erreur',
        message: 'Erreur lors du changement de rôle',
        type: 'error'
      });
      setShowStatusModal(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (userId, isActive) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      });
      
      if (response.ok) {
        setStatusModalData({
          title: isActive ? 'Compte activé' : 'Compte désactivé',
          message: isActive 
            ? 'Le compte utilisateur a été activé avec succès.'
            : 'Le compte utilisateur a été désactivé avec succès.',
          type: 'success'
        });
        setShowStatusModal(true);
        setShowDeactivateModal(false);
        fetchUsers();
      } else {
        setStatusModalData({
          title: 'Erreur',
          message: 'Erreur lors du changement de statut',
          type: 'error'
        });
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatusModalData({
        title: 'Erreur',
        message: 'Erreur lors du changement de statut',
        type: 'error'
      });
      setShowStatusModal(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendAccount = async (userId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'Suspension administrative', durationDays: 30 })
      });
      
      if (response.ok) {
        setStatusModalData({
          title: 'Compte suspendu',
          message: 'Le compte utilisateur a été suspendu pour 30 jours.',
          type: 'success'
        });
        setShowStatusModal(true);
        setShowSuspendModal(false);
        fetchUsers();
      } else {
        setStatusModalData({
          title: 'Erreur',
          message: 'Erreur lors de la suspension',
          type: 'error'
        });
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatusModalData({
        title: 'Erreur',
        message: 'Erreur lors de la suspension',
        type: 'error'
      });
      setShowStatusModal(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setStatusModalData({
          title: 'Suppression réussie',
          message: 'L\'utilisateur a été supprimé avec succès.',
          type: 'success'
        });
        setShowStatusModal(true);
        fetchUsers();
        setShowDeleteModal(false);
      } else {
        setStatusModalData({
          title: 'Erreur',
          message: 'Erreur lors de la suppression',
          type: 'error'
        });
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatusModalData({
        title: 'Erreur',
        message: 'Erreur lors de la suppression',
        type: 'error'
      });
      setShowStatusModal(true);
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleText = (role) => {
    const roleMap = {
      'user': 'Utilisateur',
      'organizer': 'Organisateur',
      'admin': 'Administrateur',
      'super_admin': 'Super Admin'
    };
    return roleMap[role] || role;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="users-management-page">
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Supprimer l'utilisateur"
        message={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${selectedUser?.firstName} ${selectedUser?.lastName} ? Cette action est irréversible.`}
        onConfirm={() => handleDelete(selectedUser?.id)}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        confirmText="Supprimer"
        type="danger"
      />

      <ConfirmationModal
        isOpen={showSuspendModal}
        title="Suspendre le compte"
        message={`Voulez-vous vraiment suspendre le compte de ${selectedUser?.firstName} ${selectedUser?.lastName} pour 30 jours ? L'utilisateur ne pourra plus accéder à son compte pendant cette période.`}
        onConfirm={() => handleSuspendAccount(selectedUser?.id)}
        onCancel={() => {
          setShowSuspendModal(false);
          setSelectedUser(null);
        }}
        confirmText="Suspendre"
        type="warning"
      />

      <ConfirmationModal
        isOpen={showDeactivateModal}
        title={selectedUser?.isActive ? "Désactiver le compte" : "Activer le compte"}
        message={
          selectedUser?.isActive 
            ? `Voulez-vous vraiment désactiver le compte de ${selectedUser?.firstName} ${selectedUser?.lastName} ? L'utilisateur ne pourra plus se connecter.`
            : `Voulez-vous vraiment activer le compte de ${selectedUser?.firstName} ${selectedUser?.lastName} ?`
        }
        onConfirm={() => handleStatusChange(selectedUser?.id, !selectedUser?.isActive)}
        onCancel={() => {
          setShowDeactivateModal(false);
          setSelectedUser(null);
        }}
        confirmText={selectedUser?.isActive ? "Désactiver" : "Activer"}
        type={selectedUser?.isActive ? "warning" : "success"}
      />

      <StatusModal
        isOpen={showStatusModal}
        title={statusModalData.title}
        message={statusModalData.message}
        type={statusModalData.type}
        onClose={() => setShowStatusModal(false)}
      />

      <div className="page-header">
        <div className="header-left">
          <h1>Gestion des utilisateurs</h1>
          <p className="page-subtitle">
            {users.length} utilisateur{users.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <div className="header-right">
          <button 
            className="btn-primary"
            onClick={fetchUsers}
            disabled={loading}
          >
            {loading ? 'Chargement...' : '🔄 Actualiser'}
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="filter-group">
          <select 
            value={filters.role}
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            className="filter-select"
          >
            <option value="all">Tous les rôles</option>
            <option value="user">Utilisateurs</option>
            <option value="organizer">Organisateurs</option>
            <option value="admin">Administrateurs</option>
          </select>
          
          <select 
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="filter-select"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des utilisateurs...</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Date inscription</th>
                  <th>Dernière connexion</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="user-info-cell">
                        <div className="user-avatar-small">
                          <span>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</span>
                        </div>
                        <div className="user-details">
                          <strong>{user.firstName} {user.lastName}</strong>
                          <small>{user.phoneNumber || 'Non défini'}</small>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {getRoleText(user.role)}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>{formatDate(user.lastLogin)}</td>
                      <td>
                        <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                          {user.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {user.role === 'user' && (
                            <button 
                              className="action-btn success-btn"
                              onClick={() => {
                                setSelectedUser(user);
                                if (window.confirm(`Promouvoir ${user.firstName} ${user.lastName} en organisateur ?`)) {
                                  handleRoleChange(user.id, 'organizer');
                                }
                              }}
                              title="Promouvoir en organisateur"
                              disabled={actionLoading}
                            >
                              ⬆️
                            </button>
                          )}
                          
                          {user.role === 'organizer' && (
                            <button 
                              className="action-btn warning-btn"
                              onClick={() => {
                                setSelectedUser(user);
                                if (window.confirm(`Rétrograder ${user.firstName} ${user.lastName} en utilisateur ?`)) {
                                  handleRoleChange(user.id, 'user');
                                }
                              }}
                              title="Rétrograder en utilisateur"
                              disabled={actionLoading}
                            >
                              ⬇️
                            </button>
                          )}
                          
                          <button 
                            className={`action-btn ${user.isActive ? 'warning-btn' : 'success-btn'}`}
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeactivateModal(true);
                            }}
                            title={user.isActive ? 'Désactiver' : 'Activer'}
                            disabled={actionLoading}
                          >
                            {user.isActive ? '⏸️' : '▶️'}
                          </button>
                          
                          <button 
                            className="action-btn warning-btn"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowSuspendModal(true);
                            }}
                            title="Suspendre 30 jours"
                            disabled={actionLoading}
                          >
                            ⚠️
                          </button>
                          
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                            title="Supprimer"
                            disabled={actionLoading}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      <p>Aucun utilisateur trouvé</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const TransactionsManagementPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

  useEffect(() => {
    fetchTransactions();
    fetchTransactionStats();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      const response = await fetch(`${API_BASE_URL}/admin/transactions?limit=50&sort=createdAt:desc`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.data || data || []);
      }
    } catch (error) {
      console.error('Erreur transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionStats = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/admin/transactions/statistics?period=month`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erreur statistiques:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'success': '#10B981',
      'pending': '#F59E0B',
      'failed': '#EF4444',
      'cancelled': '#6B7280',
      'refunded': '#8B5CF6'
    };
    return colors[status] || '#6B7280';
  };

  const getStatusText = (status) => {
    const map = {
      'success': 'Réussi',
      'pending': 'En attente',
      'failed': 'Échoué',
      'cancelled': 'Annulé',
      'refunded': 'Remboursé'
    };
    return map[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR');
  };

  return (
    <div className="transactions-management-page">
      <div className="page-header">
        <div className="header-left">
          <h1>Gestion des transactions</h1>
          <p className="page-subtitle">
            Surveillance des paiements et remboursements
          </p>
        </div>
        <div className="header-right">
          <button 
            className="btn-primary"
            onClick={() => {
              fetchTransactions();
              fetchTransactionStats();
            }}
            disabled={loading}
          >
            {loading ? 'Chargement...' : '🔄 Actualiser'}
          </button>
        </div>
      </div>

      {stats && (
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>Chiffre d'affaires</h3>
                <p className="stat-value">{(stats.totalAmount || 0).toLocaleString()} XOF</p>
                <span className="stat-change">Ce mois</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>Transactions</h3>
                <p className="stat-value">{stats.totalTransactions || 0}</p>
                <span className="stat-change">{stats.successRate || 0}% de réussite</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>Réussies</h3>
                <p className="stat-value">{stats.successfulTransactions || 0}</p>
                <span className="stat-change">+{stats.successChange || 0}%</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">❌</div>
              <div className="stat-info">
                <h3>Échouées</h3>
                <p className="stat-value">{stats.failedTransactions || 0}</p>
                <span className="stat-change">-{stats.failedChange || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des transactions...</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Transaction</th>
                  <th>Utilisateur</th>
                  <th>Compétition</th>
                  <th>Montant</th>
                  <th>Méthode</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="transaction-id">#{transaction.transactionId?.substring(0, 8) || transaction.id?.substring(0, 8)}</td>
                      <td>
                        <div className="user-info-small">
                          <strong>{transaction.user?.firstName} {transaction.user?.lastName}</strong>
                          <small>{transaction.user?.email}</small>
                        </div>
                      </td>
                      <td>{transaction.competition?.title || 'N/A'}</td>
                      <td className="amount">{transaction.amount?.toLocaleString()} XOF</td>
                      <td>
                        <span className="payment-method">{transaction.paymentMethod || 'Inconnue'}</span>
                      </td>
                      <td>
                        <span 
                          className="status-badge" 
                          style={{ backgroundColor: getStatusColor(transaction.status) }}
                        >
                          {getStatusText(transaction.status)}
                        </span>
                      </td>
                      <td>{formatDate(transaction.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn view-btn" title="Voir détails">
                            👁️
                          </button>
                          {transaction.status === 'pending' && (
                            <button className="action-btn success-btn" title="Valider">
                              ✅
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">
                      <p>Aucune transaction trouvée</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const EditCompetitionPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [competition, setCompetition] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    startDate: '',
    endDate: '',
    votePrice: 100,
    minVotesPerTransaction: 1,
    maxVotesPerTransaction: 100,
    coverImageUrl: '',
    sections: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        setLoading(true);
        setError('');
        
        const pathParts = window.location.pathname.split('/');
        const competitionId = pathParts[pathParts.length - 2] === 'edit' 
          ? pathParts[pathParts.length - 1] 
          : pathParts[pathParts.length - 1].replace('/edit', '');
        
        const storedCompetition = localStorage.getItem('editingCompetition');
        if (storedCompetition) {
          const parsedCompetition = JSON.parse(storedCompetition);
          if (parsedCompetition.id === competitionId) {
            setCompetition(parsedCompetition);
            setFormData({
              title: parsedCompetition.title || '',
              description: parsedCompetition.description || '',
              shortDescription: parsedCompetition.shortDescription || '',
              startDate: parsedCompetition.startDate ? new Date(parsedCompetition.startDate).toISOString().split('T')[0] : '',
              endDate: parsedCompetition.endDate ? new Date(parsedCompetition.endDate).toISOString().split('T')[0] : '',
              votePrice: parsedCompetition.votePrice || 100,
              minVotesPerTransaction: parsedCompetition.minVotesPerTransaction || 1,
              maxVotesPerTransaction: parsedCompetition.maxVotesPerTransaction || 100,
              coverImageUrl: parsedCompetition.coverImageUrl || '',
              sections: parsedCompetition.sections || []
            });
            setLoading(false);
            return;
          }
        }
        
        const token = localStorage.getItem('userToken');
        const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Impossible de charger la compétition');
        }
        
        const data = await response.json();
        setCompetition(data);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          shortDescription: data.shortDescription || '',
          startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
          endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
          votePrice: data.votePrice || 100,
          minVotesPerTransaction: data.minVotesPerTransaction || 1,
          maxVotesPerTransaction: data.maxVotesPerTransaction || 100,
          coverImageUrl: data.coverImageUrl || '',
          sections: data.sections || []
        });
        
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompetition();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: '',
          description: '',
          displayOrder: prev.sections.length + 1
        }
      ]
    }));
  };

  const removeSection = (index) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette section ?')) {
      const updatedSections = formData.sections.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        sections: updatedSections
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      if (!formData.title.trim()) {
        throw new Error('Le titre est requis');
      }
      if (!formData.startDate || !formData.endDate) {
        throw new Error('Les dates de début et de fin sont requises');
      }
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        throw new Error('La date de fin doit être après la date de début');
      }
      if (formData.votePrice <= 0) {
        throw new Error('Le prix par vote doit être positif');
      }
      
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/competitions/${competition.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour');
      }
      
      const updatedData = await response.json();
      setSuccess('Compétition mise à jour avec succès !');
      
      localStorage.setItem('editingCompetition', JSON.stringify(updatedData));
      
      setTimeout(() => {
        window.location.href = '/admin?page=competitions';
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Voulez-vous annuler les modifications ?')) {
      localStorage.removeItem('editingCompetition');
      window.location.href = '/admin?page=competitions';
    }
  };

  if (loading) {
    return (
      <div className="edit-competition-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement de la compétition...</p>
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="edit-competition-page">
        <div className="error-container">
          <h2>Compétition non trouvée</h2>
          <p>La compétition que vous essayez de modifier n'existe pas ou vous n'y avez pas accès.</p>
          <button 
            onClick={() => window.location.href = '/admin?page=competitions'}
            className="btn-secondary"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-competition-page">
      <div className="page-header">
        <div className="header-left">
          <h1>Modifier la compétition</h1>
          <p className="page-subtitle">{competition.title}</p>
        </div>
        <div className="header-right">
          <button 
            onClick={handleCancel}
            className="btn-secondary"
            disabled={saving}
          >
            Annuler
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span className="alert-message">{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          <span className="alert-message">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-competition-form">
        <div className="form-grid">
          <div className="form-section">
            <h3>Informations de base</h3>
            
            <div className="form-group">
              <label htmlFor="title">Titre de la compétition *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Festival de musique 2024"
                required
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="shortDescription">Description courte</label>
              <input
                type="text"
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder="Description brève pour les listes"
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description complète</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description détaillée de la compétition..."
                rows={4}
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="coverImageUrl">URL de l'image de couverture</label>
              <input
                type="url"
                id="coverImageUrl"
                name="coverImageUrl"
                value={formData.coverImageUrl}
                onChange={handleInputChange}
                placeholder="https://exemple.com/image.jpg"
                disabled={saving}
              />
              {formData.coverImageUrl && (
                <div className="image-preview">
                  <img 
                    src={formData.coverImageUrl} 
                    alt="Aperçu" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <div className="image-error" style={{ display: 'none' }}>
                    Image non disponible
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Dates et prix</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Date de début *</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">Date de fin *</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="votePrice">Prix par vote (XOF) *</label>
              <input
                type="number"
                id="votePrice"
                name="votePrice"
                value={formData.votePrice}
                onChange={handleInputChange}
                min="1"
                step="1"
                required
                disabled={saving}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="minVotesPerTransaction">Votes minimum par transaction</label>
                <input
                  type="number"
                  id="minVotesPerTransaction"
                  name="minVotesPerTransaction"
                  value={formData.minVotesPerTransaction}
                  onChange={handleInputChange}
                  min="1"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxVotesPerTransaction">Votes maximum par transaction</label>
                <input
                  type="number"
                  id="maxVotesPerTransaction"
                  name="maxVotesPerTransaction"
                  value={formData.maxVotesPerTransaction}
                  onChange={handleInputChange}
                  min="1"
                  max="1000"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>Sections</h3>
              <button 
                type="button"
                onClick={addSection}
                className="btn-secondary btn-sm"
                disabled={saving}
              >
                + Ajouter une section
              </button>
            </div>
            
            {formData.sections.length === 0 ? (
              <div className="no-sections">
                <p>Aucune section définie. Ajoutez des sections pour organiser les candidats.</p>
              </div>
            ) : (
              formData.sections.map((section, index) => (
                <div key={index} className="section-item">
                  <div className="section-header">
                    <h4>Section {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="btn-danger btn-sm"
                      disabled={saving}
                    >
                      Supprimer
                    </button>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`section-title-${index}`}>Titre de la section *</label>
                    <input
                      type="text"
                      id={`section-title-${index}`}
                      value={section.title}
                      onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                      placeholder="Ex: Catégorie chant"
                      required
                      disabled={saving}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`section-description-${index}`}>Description</label>
                    <textarea
                      id={`section-description-${index}`}
                      value={section.description}
                      onChange={(e) => handleSectionChange(index, 'description', e.target.value)}
                      placeholder="Description de la section..."
                      rows={2}
                      disabled={saving}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`section-order-${index}`}>Ordre d'affichage</label>
                    <input
                      type="number"
                      id={`section-order-${index}`}
                      value={section.displayOrder || index + 1}
                      onChange={(e) => handleSectionChange(index, 'displayOrder', parseInt(e.target.value))}
                      min="1"
                      disabled={saving}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button"
            onClick={handleCancel}
            className="btn-secondary"
            disabled={saving}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={saving}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Composant principal
const AdminDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  
  const [activePage, setActivePage] = useState('overview');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      
      if (parsedUser.role !== 'admin' && parsedUser.role !== 'super_admin') {
        navigate('/dashboard');
        return;
      }
      
      setUser(parsedUser);
      
      const path = window.location.pathname;
      
      if (path.includes('/competitions/') && path.includes('/edit')) {
        setActivePage('edit-competition');
      } else if (path.includes('competitions')) {
        setActivePage('competitions');
      } else if (path.includes('organizers')) {
        setActivePage('organizers');
      } else if (path.includes('users')) {
        setActivePage('users');
      } else if (path.includes('transactions')) {
        setActivePage('transactions');
      } else if (path.includes('settings')) {
        setActivePage('settings');
      } else {
        setActivePage('overview');
      }
      
      setLoading(false);
      
    } catch (error) {
      console.error('Erreur:', error);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
    
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewPage />;
      case 'competitions':
        return <CompetitionsManagementPage />;
      case 'organizers':
        return <OrganizersManagementPage />;
      case 'users':
        return <UsersManagementPage />;
      case 'transactions':
        return <TransactionsManagementPage />;
      case 'edit-competition':
        return <EditCompetitionPage />;
      case 'settings':
        return <div className="settings-page">
          <h2>Paramètres Administrateur</h2>
          <p>Gestion des paramètres système (à implémenter)</p>
        </div>;
      default:
        return <OverviewPage />;
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className={`admin-dashboard ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="admin-header">
        <div className="header-top">
          <div className="logo" onClick={() => navigate('/')}>
            <img 
              src="/assets/images/logo/Klumer_Logo_Orginal.png"  
              alt="Logo Klumer"        
              className="logo-img"     
            />
            <span className="logo-text"></span>
          </div>
          
          <div className="header-content">
            <div className="quick-stats">
              <div className="stat-item">
                <span className="stat-label">Rôle:</span>
                <span className="stat-value">{user?.role === 'super_admin' ? 'Super Admin' : 'Administrateur'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Connecté:</span>
                <span className="stat-value">{user?.firstName} {user?.lastName}</span>
              </div>
            </div>

            <div className="header-right">
              <button 
                className="theme-toggle-btn"
                onClick={() => setIsDarkMode(!isDarkMode)}
                title={isDarkMode ? "Mode clair" : "Mode sombre"}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              
              <div className="user-profile">
                <div className="user-avatar">
                  <span>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
                </div>
                <div className="user-info">
                  <span className="user-name">{user?.firstName} {user?.lastName}</span>
                  <span className="user-role">{user?.role === 'super_admin' ? 'Super Admin' : 'Administrateur'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="header-bottom">
          <h1 className="dashboard-title">
            Administration Klumer
            <span className="welcome-text">Bienvenue, {user?.firstName || 'Administrateur'}</span>
          </h1>
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => navigate('/')}>
              Accueil public
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <ul>
              <li className={`nav-item ${activePage === 'overview' ? 'active' : ''}`}>
                <button onClick={() => setActivePage('overview')} className="nav-link">
                  <span className="nav-icon">📊</span>
                  <span className="nav-text">Vue d'ensemble</span>
                </button>
              </li>
              
              <li className="nav-section">GESTION</li>
              
              <li className={`nav-item ${activePage === 'competitions' ? 'active' : ''}`}>
                <button onClick={() => setActivePage('competitions')} className="nav-link">
                  <span className="nav-icon">🏆</span>
                  <span className="nav-text">Compétitions</span>
                </button>
              </li>
              
              <li className={`nav-item ${activePage === 'organizers' ? 'active' : ''}`}>
                <button onClick={() => setActivePage('organizers')} className="nav-link">
                  <span className="nav-icon">🏢</span>
                  <span className="nav-text">Organisateurs</span>
                </button>
              </li>
              
              <li className={`nav-item ${activePage === 'users' ? 'active' : ''}`}>
                <button onClick={() => setActivePage('users')} className="nav-link">
                  <span className="nav-icon">👥</span>
                  <span className="nav-text">Utilisateurs</span>
                </button>
              </li>
              
              <li className={`nav-item ${activePage === 'transactions' ? 'active' : ''}`}>
                <button onClick={() => setActivePage('transactions')} className="nav-link">
                  <span className="nav-icon">💰</span>
                  <span className="nav-text">Transactions</span>
                </button>
              </li>
              
              <li className="nav-section">SYSTÈME</li>
              
              <li className={`nav-item ${activePage === 'settings' ? 'active' : ''}`}>
                <button onClick={() => setActivePage('settings')} className="nav-link">
                  <span className="nav-icon">⚙️</span>
                  <span className="nav-text">Paramètres</span>
                </button>
              </li>
              
              <li className="nav-item logout-item">
                <button onClick={handleLogout} className="nav-link logout">
                  <span className="nav-icon">🚪</span>
                  <span className="nav-text">Déconnexion</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          {renderActivePage()}
        </main>
      </div>

      <footer className="admin-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span>© 2024 Klumer Administration. Tous droits réservés.</span>
          </div>
          <div className="footer-right">
            <span>Version: 1.0.0</span>
            <span>Connecté en tant que: {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;