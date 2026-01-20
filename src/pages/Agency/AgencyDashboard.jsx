import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './AgencyDashboard.css';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  LineChart, Line, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';

// Composant Modal pour les confirmations
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirmer", cancelText = "Annuler" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="confirmation-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn-secondary">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="btn-danger">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
const AgencyStatistics = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

  useEffect(() => {
    fetchAgencyStats();
  }, [user?.agency?.id]);

  const fetchAgencyStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      // 1. Récupérer les compétitions de l'agence
      const competitionsResponse = await fetch(
        `${API_BASE_URL}/competitions?organizerId=${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!competitionsResponse.ok) {
        throw new Error('Impossible de récupérer les compétitions');
      }
      
      const competitions = await competitionsResponse.json();
      
      // 2. Calculer les statistiques manuellement
      const calculatedStats = calculateAgencyStats(competitions, user.id);
      
      // 3. Si l'utilisateur a le rôle admin/organizer, on peut aussi récupérer les stats financières
      if (user.role === 'admin' || user.role === 'super_admin' || user.role === 'organizer') {
        try {
          const dashboardResponse = await fetch(
            `${API_BASE_URL}/admin/dashboard?period=all`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (dashboardResponse.ok) {
            const dashboardData = await dashboardResponse.json();
            // Fusionner les données du dashboard avec nos stats calculées
            if (dashboardData.statistics) {
              calculatedStats.totalRevenue = dashboardData.statistics.revenueTotal || 0;
              calculatedStats.totalVotes = dashboardData.statistics.totalVotes || 0;
            }
          }
        } catch (dashboardError) {
          console.warn('Dashboard stats non disponibles:', dashboardError);
        }
      }
      
      setStats(calculatedStats);
    } catch (err) {
      setError(err.message);
      console.error('Erreur statistiques agence:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAgencyStats = (competitions, userId) => {
    // Filtrer les compétitions de cet utilisateur (si l'API ne filtre pas déjà)
    const userCompetitions = competitions.filter(comp => 
      comp.organizer?.id === userId || comp.createdBy === userId
    );
    
    const stats = {
      totalCompetitions: userCompetitions.length,
      draftCompetitions: userCompetitions.filter(c => c.status === 'draft').length,
      activeCompetitions: userCompetitions.filter(c => c.status === 'active').length,
      pendingApprovalCompetitions: userCompetitions.filter(c => c.status === 'pending_approval').length,
      completedCompetitions: userCompetitions.filter(c => c.status === 'completed').length,
      rejectedCompetitions: userCompetitions.filter(c => c.status === 'rejected').length,
      pausedCompetitions: userCompetitions.filter(c => c.status === 'paused').length,
      cancelledCompetitions: userCompetitions.filter(c => c.status === 'cancelled').length,
      totalCandidates: userCompetitions.reduce((sum, comp) => sum + (comp.candidates?.length || 0), 0),
      totalVotes: userCompetitions.reduce((sum, comp) => sum + (comp.totalVotes || 0), 0),
      totalRevenue: userCompetitions.reduce((sum, comp) => sum + (comp.revenue || 0), 0),
      averageRevenuePerCompetition: 0,
      averageVotesPerCompetition: 0
    };
    
    // Calcul des moyennes
    if (stats.totalCompetitions > 0) {
      stats.averageRevenuePerCompetition = Math.round(stats.totalRevenue / stats.totalCompetitions);
      stats.averageVotesPerCompetition = Math.round(stats.totalVotes / stats.totalCompetitions);
    }
    
    // Distribution des statuts pour le graphique
    stats.statusDistribution = [
      { name: 'Actives', value: stats.activeCompetitions, color: '#10B981' },
      { name: 'Brouillons', value: stats.draftCompetitions, color: '#8B5CF6' },
      { name: 'En attente', value: stats.pendingApprovalCompetitions, color: '#3B82F6' },
      { name: 'Terminées', value: stats.completedCompetitions, color: '#F59E0B' },
      { name: 'Rejetées', value: stats.rejectedCompetitions, color: '#EF4444' },
      { name: 'En pause', value: stats.pausedCompetitions, color: '#F59E0B' },
      { name: 'Annulées', value: stats.cancelledCompetitions, color: '#6B7280' }
    ].filter(item => item.value > 0);
    
    return stats;
  };

  if (loading) {
    return (
      <div className="agency-stats-section">
        <h3>Statistiques de l'agence</h3>
        <div className="loading-stats">
          <div className="spinner"></div>
          <p>Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="agency-stats-section">
        <h3>Statistiques de l'agence</h3>
        <div className="error-stats">
          <p>Erreur: {error}</p>
          <button onClick={fetchAgencyStats} className="btn-secondary">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="agency-stats-section">
      <h3>Statistiques de l'agence</h3>
      
      <div className="agency-stats-grid">
        {/* Total des compétitions */}
        <div className="agency-stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <h4>Total des compétitions</h4>
            <p className="stat-number">{stats.totalCompetitions}</p>
          </div>
        </div>
        
        {/* Compétitions en brouillon */}
        <div className="agency-stat-card draft">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h4>Compétitions en brouillon</h4>
            <p className="stat-number">{stats.draftCompetitions}</p>
          </div>
        </div>
        
        {/* Compétitions actives */}
        <div className="agency-stat-card active">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <h4>Compétitions actives</h4>
            <p className="stat-number">{stats.activeCompetitions}</p>
          </div>
        </div>
        
        {/* Compétitions en attente */}
        <div className="agency-stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h4>En attente d'approbation</h4>
            <p className="stat-number">{stats.pendingApprovalCompetitions}</p>
          </div>
        </div>
        
        {/* Total des votes */}
        <div className="agency-stat-card">
          <div className="stat-icon">🗳️</div>
          <div className="stat-info">
            <h4>Total des votes</h4>
            <p className="stat-number">{stats.totalVotes.toLocaleString()}</p>
          </div>
        </div>
        
        {/* Revenus totaux */}
        <div className="agency-stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h4>Revenus totaux</h4>
            <p className="stat-number">
              {stats.totalRevenue ? `${stats.totalRevenue.toLocaleString()} XOF` : '0 XOF'}
            </p>
          </div>
        </div>
        
        {/* Candidats totaux */}
        <div className="agency-stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h4>Candidats totaux</h4>
            <p className="stat-number">{stats.totalCandidates}</p>
          </div>
        </div>
        
        {/* Taux de réussite */}
        <div className="agency-stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h4>Taux d'approbation</h4>
            <p className="stat-number">
              {stats.totalCompetitions > 0 
                ? `${Math.round(((stats.activeCompetitions + stats.completedCompetitions) / stats.totalCompetitions) * 100)}%`
                : '0%'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Section détaillée */}
      <div className="agency-detailed-stats">
        <h4>Répartition détaillée</h4>
        
        <div className="detailed-stats-grid">
          <div className="stat-item">
            <span className="stat-label">Compétitions terminées:</span>
            <span className="stat-value">{stats.completedCompetitions}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Compétitions rejetées:</span>
            <span className="stat-value">{stats.rejectedCompetitions}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Compétitions en pause:</span>
            <span className="stat-value">{stats.pausedCompetitions}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Compétitions annulées:</span>
            <span className="stat-value">{stats.cancelledCompetitions}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Revenus moyens par compétition:</span>
            <span className="stat-value">
              {stats.averageRevenuePerCompetition.toLocaleString()} XOF
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Votes moyens par compétition:</span>
            <span className="stat-value">
              {stats.averageVotesPerCompetition.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Graphique de répartition */}
      {stats.statusDistribution.length > 0 && (
        <div className="agency-chart-section">
          <h4>Répartition par statut</h4>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [
                  `${value} compétitions`, 
                  props.payload.name
                ]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
// Composant de détails de compétition
const CompetitionDetailsModal = ({ isOpen, competition, onClose, onEdit, onDelete, onSubmit }) => {
  if (!isOpen) return null;

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

  return (
    <div className="modal-overlay">
      <div className="details-modal">
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
                <span className="detail-label">Inscription :</span>
                <span className="detail-value">{formatDate(competition.registrationDeadline)}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Paramètres de vote</h3>
              <div className="detail-item">
                <span className="detail-label">Prix par vote :</span>
                <span className="detail-value">{competition.votePrice} XOF</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Votes min/transaction :</span>
                <span className="detail-value">{competition.minVotesPerTransaction || 1}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Votes max/transaction :</span>
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

          <div className="modal-actions">
            {competition.status === 'draft' && (
              <button onClick={() => onSubmit(competition.id)} className="btn-primary">
                Soumettre pour approbation
              </button>
            )}
            {competition.status === 'draft' && (
              <button onClick={() => onEdit(competition.id)} className="btn-secondary">
                ✏️ Modifier
              </button>
            )}
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
const OverviewPage = ({ user, stats, competitionStatus, recentCompetitions, leaderboard, balanceData, period, onPeriodChange, onViewCompetition }) => {
  const navigate = useNavigate();
  const revenueData = balanceData || [];

  return (
    <div className="overview-page">
      <section className="stats-section">
        <div className="section-header">
          <h1 className="section-title">Statistiques globales</h1>
          <div className="period-selector">
            <select value={period} onChange={(e) => onPeriodChange(e.target.value)}>
              <option value="daily">Aujourd'hui</option>
              <option value="weekly">Cette semaine</option>
              <option value="monthly">Ce mois</option>
              <option value="yearly">Cette année</option>
            </select>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <h3>Compétitions</h3>
              <p className="stat-value">{stats.competitions}</p>
              <span className="stat-change">Total</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Participants</h3>
              <p className="stat-value">{stats.participants}</p>
              <span className="stat-change">Total</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🗳️</div>
            <div className="stat-info">
              <h3>Votes</h3>
              <p className="stat-value">{stats.votes}</p>
              <span className="stat-change">Total</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Revenus</h3>
              <p className="stat-value">{stats.revenue.toLocaleString()} XOF</p>
              <span className="stat-change">Total</span>
            </div>
          </div>
        </div>
      </section>

      <div className="charts-section">
        <div className="chart-container revenue-chart">
          <div className="chart-header">
            <h2>Revenus hebdomadaires</h2>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} XOF`, 'Revenus']} />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container status-chart">
          <h2>Répartition des compétitions</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={competitionStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {competitionStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value}%`, props.payload.name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="legend">
            {competitionStatus.map((status, index) => (
              <div key={index} className="legend-item">
                <div className="legend-color" style={{ backgroundColor: status.color }}></div>
                <span>{status.name}: {status.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Compétitions récentes</h2>
          <div className="table-actions">
            <button className="view-all-btn" onClick={() => navigate('/competitions')}>
              Voir toutes
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="competitions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Candidats</th>
                <th>Votes</th>
                <th>Revenus</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentCompetitions.length > 0 ? (
                recentCompetitions.map((comp, index) => (
                  <tr key={comp.id || index}>
                    <td>{index + 1}</td>
                    <td className="competition-name">
                      <strong>{comp.name}</strong>
                      {comp.shortDescription && (
                        <p className="comp-description">{comp.shortDescription}</p>
                      )}
                    </td>
                    <td>{comp.candidates}</td>
                    <td>{comp.totalVotes || 0}</td>
                    <td className="revenue">{comp.revenue}</td>
                    <td>
                      <span className={`status-badge ${comp.status.toLowerCase().replace(' ', '-')}`}>
                        {comp.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="action-btn view-btn"
                        onClick={() => onViewCompetition(comp.id)}
                        title="Voir détails"
                      >
                        📋
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    <p>Aucune compétition trouvée</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CompetitionsPage = ({ user, onEditCompetition, onViewCompetition }) => {
  const [competitions, setCompetitions] = useState([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

  useEffect(() => {
    fetchCompetitions();
  }, [pagination.page]);

  useEffect(() => {
    filterCompetitions();
  }, [filters, competitions]);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      // Récupérer les compétitions avec pagination
      const response = await fetch(
        `${API_BASE_URL}/competitions?page=${pagination.page}&limit=${pagination.limit * 2}&sort=createdAt:desc`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        let userCompetitions = [];
        
        if (data.data) {
          // Format paginated response
          userCompetitions = data.data;
        } else {
          // Array response
          userCompetitions = data;
        }
        
        // Filtrer pour ne garder que les compétitions de l'utilisateur connecté
        const userId = user?.id;
        if (userId) {
          userCompetitions = userCompetitions.filter(comp => {
            return comp.organizer?.id === userId || 
                   comp.createdBy === userId ||
                   !comp.organizer;
          });
        }
        
        setCompetitions(userCompetitions);
        setFilteredCompetitions(userCompetitions);
        
        setPagination({
          page: data.page || 1,
          limit: data.limit || 10,
          total: userCompetitions.length,
          totalPages: Math.ceil(userCompetitions.length / (data.limit || 10))
        });
      }
    } catch (error) {
      console.error('Erreur compétitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCompetitions = () => {
    let filtered = [...competitions];
    
    // Filtre par statut
    if (filters.status !== 'all') {
      filtered = filtered.filter(comp => comp.status === filters.status);
    }
    
    // Filtre par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(comp => 
        comp.title?.toLowerCase().includes(searchLower) ||
        comp.shortDescription?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredCompetitions(filtered);
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
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const handleDelete = async (competitionId) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        fetchCompetitions();
        setShowDeleteModal(false);
        setSelectedCompetition(null);
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleSubmitForApproval = async (competitionId) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        fetchCompetitions();
        setShowSubmitModal(false);
        setSelectedCompetition(null);
      } else {
        alert(`Erreur: ${data.message || 'Impossible de soumettre'}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la soumission');
    }
  };

  const handleChangePage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const openDeleteModal = (competition) => {
    setSelectedCompetition(competition);
    setShowDeleteModal(true);
  };

  const openSubmitModal = (competition) => {
    setSelectedCompetition(competition);
    setShowSubmitModal(true);
  };

  return (
    <div className="competitions-page">
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
      />

      <ConfirmationModal
        isOpen={showSubmitModal}
        title="Soumettre pour approbation"
        message={`Voulez-vous soumettre "${selectedCompetition?.title}" pour approbation par l'administrateur ?`}
        onConfirm={() => handleSubmitForApproval(selectedCompetition?.id)}
        onCancel={() => {
          setShowSubmitModal(false);
          setSelectedCompetition(null);
        }}
        confirmText="Soumettre"
      />

      <div className="page-header">
        <div className="header-left">
          <h1>Mes compétitions</h1>
          <p className="page-subtitle">
            {competitions.length} compétition{competitions.length > 1 ? 's' : ''} créée{competitions.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher une compétition..."
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
            Toutes
          </button>
          <button 
            className={`filter-btn ${filters.status === 'draft' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, status: 'draft' }))}
          >
            Brouillons
          </button>
          <button 
            className={`filter-btn ${filters.status === 'pending_approval' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, status: 'pending_approval' }))}
          >
            En attente
          </button>
          <button 
            className={`filter-btn ${filters.status === 'active' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, status: 'active' }))}
          >
            Actives
          </button>
          <button 
            className={`filter-btn ${filters.status === 'completed' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, status: 'completed' }))}
          >
            Terminées
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des compétitions...</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <div className="table-responsive">
              <table className="competitions-detail-table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Date de début</th>
                    <th>Date de fin</th>
                    <th>Candidats</th>
                    <th>Votes</th>
                    <th>Revenus</th>
                    <th>Prix/vote</th>
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
                                className="competition-thumbnail"
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
                        <td>{formatDate(comp.startDate)}</td>
                        <td>{formatDate(comp.endDate)}</td>
                        <td className="text-center">{comp.candidates?.length || 0}</td>
                        <td className="text-center">{comp.totalVotes || 0}</td>
                        <td className="revenue-cell">
                          {comp.revenue ? `${comp.revenue.toLocaleString()} XOF` : '-'}
                        </td>
                        <td className="text-center">{comp.votePrice ? `${comp.votePrice} XOF` : '-'}</td>
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
                              onClick={() => onViewCompetition(comp)}
                              title="Voir détails"
                            >
                              📋
                            </button>
                            
                            {comp.status === 'draft' && (
                              <>
                                <button 
                                  className="action-btn edit-btn"
                                  onClick={() => onEditCompetition(comp.id)}
                                  title="Modifier"
                                >
                                  ✏️
                                </button>
                                <button 
                                  className="action-btn submit-btn"
                                  onClick={() => openSubmitModal(comp)}
                                  title="Soumettre pour approbation"
                                >
                                  📤
                                </button>
                              </>
                            )}
                            
                            {comp.status === 'pending_approval' && (
                              <button 
                                className="action-btn pending-btn"
                                title="En attente d'approbation"
                                disabled
                              >
                                ⏳
                              </button>
                            )}
                            
                            <button 
                              className="action-btn delete-btn"
                              onClick={() => openDeleteModal(comp)}
                              title="Supprimer"
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

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => handleChangePage(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                ← Précédent
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      className={`pagination-btn ${pagination.page === pageNum ? 'active' : ''}`}
                      onClick={() => handleChangePage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button 
                className="pagination-btn"
                onClick={() => handleChangePage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Suivant →
              </button>
            </div>
          )}

          {/* Stats résumées */}
          <div className="competitions-stats">
            <div className="stat-card">
              <h3>Total compétitions</h3>
              <p className="stat-number">{competitions.length}</p>
            </div>
            <div className="stat-card">
              <h3>Actives</h3>
              <p className="stat-number">
                {competitions.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="stat-card">
              <h3>En attente</h3>
              <p className="stat-number">
                {competitions.filter(c => c.status === 'pending_approval').length}
              </p>
            </div>
            <div className="stat-card">
              <h3>Revenus totaux</h3>
              <p className="stat-number">
                {competitions.reduce((sum, comp) => sum + (comp.revenue || 0), 0).toLocaleString()} XOF
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const EditCompetitionPage = ({ competitionId, user, onCancel, onSuccess }) => {
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    categoryId: '',
    coverImageUrl: '',
    votePrice: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    minVotesPerTransaction: 1,
    maxVotesPerTransaction: 100,
    allowMultipleVotesSameCandidate: true,
    enableLeaderboard: true
  });
  const [errors, setErrors] = useState({});
  const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

  useEffect(() => {
    fetchCompetition();
    fetchCategories();
  }, [competitionId]);

  const fetchCompetition = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCompetition(data);
        
        setFormData({
          title: data.title || '',
          description: data.description || '',
          shortDescription: data.shortDescription || '',
          categoryId: data.categoryId || data.category?.id || '',
          coverImageUrl: data.coverImageUrl || '',
          votePrice: data.votePrice || '',
          startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
          endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
          registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline).toISOString().split('T')[0] : '',
          minVotesPerTransaction: data.minVotesPerTransaction || 1,
          maxVotesPerTransaction: data.maxVotesPerTransaction || 100,
          allowMultipleVotesSameCandidate: data.allowMultipleVotesSameCandidate !== false,
          enableLeaderboard: data.enableLeaderboard !== false
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Erreur catégories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.categoryId) newErrors.categoryId = 'La catégorie est requise';
    if (!formData.coverImageUrl.trim()) newErrors.coverImageUrl = "L'image de couverture est requise";
    if (!formData.votePrice || formData.votePrice <= 0) newErrors.votePrice = 'Le prix du vote est requis';
    if (!formData.startDate) newErrors.startDate = 'La date de début est requise';
    if (!formData.endDate) newErrors.endDate = 'La date de fin est requise';
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'La date de fin doit être après la date de début';
    }
    if (formData.minVotesPerTransaction > formData.maxVotesPerTransaction) {
      newErrors.minVotesPerTransaction = 'Doit être inférieur au maximum';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      const token = localStorage.getItem('userToken');
      
      const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        alert(`Erreur: ${errorData.message || 'Impossible de mettre à jour'}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'competition');
      
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, coverImageUrl: data.url }));
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors du téléchargement de l\'image');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="error-container">
        <h2>Compétition non trouvée</h2>
        <button onClick={onCancel}>
          Retour aux compétitions
        </button>
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
        <button 
          className="btn-secondary"
          onClick={onCancel}
        >
          Annuler
        </button>
      </div>

      <form onSubmit={handleSubmit} className="competition-form">
        <div className="form-grid">
          <div className="form-section">
            <h3>Informations de base</h3>
            
            <div className="form-group">
              <label>Titre *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Miss Togo 2024"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
            
            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Description complète de la compétition..."
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
            
            <div className="form-group">
              <label>Description courte</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows="2"
                placeholder="Description courte pour les aperçus..."
              />
            </div>
            
            <div className="form-group">
              <label>Catégorie *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className={errors.categoryId ? 'error' : ''}
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <span className="error-message">{errors.categoryId}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3>Image de couverture</h3>
            
            <div className="form-group">
              <label>URL de l'image *</label>
              <input
                type="text"
                name="coverImageUrl"
                value={formData.coverImageUrl}
                onChange={handleChange}
                placeholder="https://..."
                className={errors.coverImageUrl ? 'error' : ''}
              />
              {errors.coverImageUrl && <span className="error-message">{errors.coverImageUrl}</span>}
            </div>
            
            <div className="image-preview">
              {formData.coverImageUrl ? (
                <>
                  <img src={formData.coverImageUrl} alt="Preview" />
                  <p>Image actuelle</p>
                </>
              ) : (
                <div className="no-image">
                  <span>📷</span>
                  <p>Aucune image</p>
                </div>
              )}
            </div>
            
            <div className="upload-section">
              <label className="upload-btn">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                📤 Uploader une nouvelle image
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Paramètres de vote</h3>
            
            <div className="form-group">
              <label>Prix par vote (XOF) *</label>
              <input
                type="number"
                name="votePrice"
                value={formData.votePrice}
                onChange={handleChange}
                min="1"
                step="1"
                placeholder="500"
                className={errors.votePrice ? 'error' : ''}
              />
              {errors.votePrice && <span className="error-message">{errors.votePrice}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Votes min par transaction</label>
                <input
                  type="number"
                  name="minVotesPerTransaction"
                  value={formData.minVotesPerTransaction}
                  onChange={handleChange}
                  min="1"
                  className={errors.minVotesPerTransaction ? 'error' : ''}
                />
              </div>
              
              <div className="form-group">
                <label>Votes max par transaction</label>
                <input
                  type="number"
                  name="maxVotesPerTransaction"
                  value={formData.maxVotesPerTransaction}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            </div>
            
            <div className="form-checkboxes">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="allowMultipleVotesSameCandidate"
                  checked={formData.allowMultipleVotesSameCandidate}
                  onChange={handleChange}
                />
                Permettre plusieurs votes pour le même candidat
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="enableLeaderboard"
                  checked={formData.enableLeaderboard}
                  onChange={handleChange}
                />
                Activer le classement en direct
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Dates importantes</h3>
            
            <div className="form-group">
              <label>Date de début *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={errors.startDate ? 'error' : ''}
              />
              {errors.startDate && <span className="error-message">{errors.startDate}</span>}
            </div>
            
            <div className="form-group">
              <label>Date de fin *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={errors.endDate ? 'error' : ''}
              />
              {errors.endDate && <span className="error-message">{errors.endDate}</span>}
            </div>
            
            <div className="form-group">
              <label>Date limite d'inscription</label>
              <input
                type="date"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
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

const AnalyticsPage = ({ user }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
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
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Erreur analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analytics-page">
      <h1>Analytics</h1>
      {loading ? (
        <div className="loading">Chargement...</div>
      ) : analyticsData ? (
        <div className="analytics-content">
          {/* Afficher les données analytics */}
        </div>
      ) : (
        <div className="no-data">Aucune donnée disponible</div>
      )}
    </div>
  );
};

const SettingsPage = ({ user }) => {
   const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || ''
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    competitionUpdates: true,
    paymentNotifications: true,
    weeklyReports: false
  });
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      
      if (response.ok) {
        alert('Mot de passe changé avec succès !');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const errorData = await response.json();
        alert(`Erreur: ${errorData.message || 'Impossible de changer le mot de passe'}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileForm)
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('userData', JSON.stringify({
          ...user,
          ...updatedUser
        }));
        alert('Profil mis à jour avec succès !');
      } else {
        alert('Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationsChange = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    localStorage.setItem('notificationSettings', JSON.stringify({
      ...notifications,
      [key]: value
    }));
  };

  const handleDeleteAccount = () => {
    // Implémenter la suppression du compte
    alert('Fonctionnalité de suppression à implémenter');
    setShowDeleteAccountModal(false);
  };

  return (
    <div className="settings-page">
      <ConfirmationModal
        isOpen={showDeleteAccountModal}
        title="Supprimer le compte"
        message="Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues."
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteAccountModal(false)}
        confirmText="Supprimer le compte"
      />

      <div className="page-header">
        <h1>Paramètres</h1>
        <p className="page-subtitle">Gérez vos préférences et vos informations de compte</p>
      </div>

      <div className="settings-container">
        <div className="settings-tabs">
          <button 
            className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            👤 Compte
          </button>
          <button 
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            🔔 Notifications
          </button>
          <button 
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔒 Sécurité
          </button>
          <button 
            className={`tab-btn ${activeTab === 'agency' ? 'active' : ''}`}
            onClick={() => setActiveTab('agency')}
          >
            🏢 Agence
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'account' && (
            <div className="settings-section">
              <h2>Informations du compte</h2>
              
              <form onSubmit={handleProfileUpdate} className="settings-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Prénom</label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Votre prénom"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Nom</label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Votre nom"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="votre@email.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input
                      type="tel"
                      value={profileForm.phoneNumber}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="+228 XX XX XX XX"
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Enregistrement...' : 'Mettre à jour le profil'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Préférences de notifications</h2>
              
              <div className="notifications-list">
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Notifications par email</h4>
                    <p>Recevoir les notifications importantes par email</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) => handleNotificationsChange('emailNotifications', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Notifications push</h4>
                    <p>Recevoir les notifications en temps réel</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.pushNotifications}
                      onChange={(e) => handleNotificationsChange('pushNotifications', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Mises à jour des compétitions</h4>
                    <p>Être notifié des changements dans vos compétitions</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.competitionUpdates}
                      onChange={(e) => handleNotificationsChange('competitionUpdates', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Notifications de paiement</h4>
                    <p>Recevoir les confirmations de paiement</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.paymentNotifications}
                      onChange={(e) => handleNotificationsChange('paymentNotifications', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Rapports hebdomadaires</h4>
                    <p>Recevoir un résumé hebdomadaire par email</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.weeklyReports}
                      onChange={(e) => handleNotificationsChange('weeklyReports', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Sécurité</h2>
              
              <form onSubmit={handlePasswordChange} className="settings-form">
                <div className="form-group">
                  <label>Mot de passe actuel</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="••••••••"
                    required
                  />
                  <small className="hint">
                    Minimum 8 caractères avec majuscule, minuscule, chiffre et caractère spécial
                  </small>
                </div>
                
                <div className="form-group">
                  <label>Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Changement...' : 'Changer le mot de passe'}
                  </button>
                </div>
              </form>
             
             
            </div>
          )}

         
{activeTab === 'agency' && (
  <div className="settings-section">
    <h2>Informations de l'agence</h2>
    
    <div className="agency-info">
      {user?.agency ? (
        <>
          <div className="agency-details">
            <div className="info-row">
              <span className="label">Nom de l'agence:</span>
              <span className="value">{user.agency.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Slug:</span>
              <span className="value">{user.agency.slug}</span>
            </div>
            <div className="info-row">
              <span className="label">Description:</span>
              <span className="value">{user.agency.description || 'Non définie'}</span>
            </div>
            <div className="info-row">
              <span className="label">Téléphone:</span>
              <span className="value">{user.agency.phone || 'Non défini'}</span>
            </div>
            <div className="info-row">
              <span className="label">Statut:</span>
              <span className={`status-badge ${user.agency.isVerified ? 'verified' : 'pending'}`}>
                {user.agency.isVerified ? 'Vérifiée' : 'En attente de vérification'}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Date de création:</span>
              <span className="value">
                {user.agency.createdAt ? new Date(user.agency.createdAt).toLocaleDateString('fr-FR') : 'Non disponible'}
              </span>
            </div>
          </div>
          
          {/* Section des statistiques de l'agence */}
          <AgencyStatistics user={user} />
        </>
      ) : (
        <div className="no-agency">
          <div className="no-agency-content">
            <div className="no-agency-icon">🏢</div>
            <h3>Aucune agence associée</h3>
            <p>Vous n'avez pas encore créé ou associé une agence à votre compte.</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/register-organizer')}
            >
              Créer une agence
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
)}







        </div>
      </div>
    </div>
  );
};

// Composant principal
const AgencyDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  
  const [activePage, setActivePage] = useState('overview');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    competitions: 0,
    participants: 0,
    votes: 0,
    revenue: 0
  });
  
  const [recentCompetitions, setRecentCompetitions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [competitionStatus, setCompetitionStatus] = useState([]);
  const [period, setPeriod] = useState('monthly');
  const [balanceData, setBalanceData] = useState([]);
  
  // États pour la gestion des compétitions
  const [editingCompetitionId, setEditingCompetitionId] = useState(null);
  const [viewingCompetition, setViewingCompetition] = useState(null);
  const [showCompetitionDetails, setShowCompetitionDetails] = useState(false);
  
  const navigate = useNavigate();
  const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';

  // ==================== GESTION DE L'AUTHENTIFICATION ====================
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Vérifier si c'est un super_admin qui doit changer son mot de passe
      const mustChangePassword = parsedUser.mustChangePassword || 
                               (parsedUser.role === 'super_admin' && parsedUser.email === 'admin@klumer.com');
      
      if (mustChangePassword) {
        navigate('/changepassword', { 
          state: { 
            userId: parsedUser.id,
            email: parsedUser.email,
            role: parsedUser.role,
            forced: true 
          } 
        });
        return;
      }

      // Charger les données initiales
      fetchDashboardData();
      fetchNotifications();
      fetchCompetitionsData();
      
    } catch (error) {
      console.error('Erreur lors du parsing des données utilisateur:', error);
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      navigate('/login');
    }
  }, [navigate]);

  // ==================== FONCTIONS API ====================
  const getAuthHeaders = () => {
    const token = localStorage.getItem('userToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/login');
        return;
      }

      // Récupérer les statistiques du dashboard
      const dashboardResponse = await fetch(
        `${API_BASE_URL}/admin/dashboard?period=${period}`,
        { method: 'GET', headers: getAuthHeaders() }
      );

      if (!dashboardResponse.ok) {
        if (dashboardResponse.status === 401) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
          navigate('/login');
          return;
        }
        throw new Error(`Erreur ${dashboardResponse.status}: ${dashboardResponse.statusText}`);
      }

      const dashboardData = await dashboardResponse.json();
      
      if (dashboardData.statistics) {
        const statsData = dashboardData.statistics;
        setStats({
          competitions: statsData.totalCompetitions || 0,
          participants: statsData.totalParticipants || statsData.regularUsers || 0,
          votes: statsData.totalVotes || 0,
          revenue: statsData.revenueTotal || 0
        });

        // Calculer le statut des compétitions
        const active = statsData.activeCompetitions || 0;
        const pending = statsData.pendingApprovalCompetitions || 0;
        const completed = statsData.completedCompetitions || 0;
        const draft = statsData.draftCompetitions || 0;
        
        const total = active + pending + completed + draft;
        
        setCompetitionStatus([
          { name: 'Actives', value: active, color: '#10B981', percentage: total > 0 ? Math.round((active / total) * 100) : 0 },
          { name: 'En attente', value: pending, color: '#3B82F6', percentage: total > 0 ? Math.round((pending / total) * 100) : 0 },
          { name: 'Terminées', value: completed, color: '#F59E0B', percentage: total > 0 ? Math.round((completed / total) * 100) : 0 },
          { name: 'Brouillon', value: draft, color: '#8B5CF6', percentage: total > 0 ? Math.round((draft / total) * 100) : 0 },
        ]);

        // Générer les données de revenus pour le graphique
        generateRevenueData(statsData.revenueTotal || 0);
      }

      // Mettre à jour le leaderboard
      if (dashboardData.topCompetitionsByVotes) {
        const leaderboardData = dashboardData.topCompetitionsByVotes.slice(0, 10).map((comp, index) => ({
          rank: index + 1,
          name: comp.competitionTitle || `Compétition ${index + 1}`,
          votes: comp.totalVotes || 0,
          revenue: comp.totalRevenue || 0
        }));
        setLeaderboard(leaderboardData);
      }

      setLoading(false);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      setLoading(false);
    }
  };

  const fetchCompetitionsData = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(
        `${API_BASE_URL}/competitions?limit=4&sort=createdAt:desc`,
        { method: 'GET', headers: getAuthHeaders() }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const formattedCompetitions = data.slice(0, 4).map(comp => ({
            id: comp.id,
            name: comp.title || 'Sans titre',
            shortDescription: comp.shortDescription || '',
            candidates: comp.candidates?.length || 0,
            totalVotes: comp.totalVotes || 0,
            revenue: `${(comp.revenue || 0).toLocaleString()} XOF`,
            status: getStatusText(comp.status)
          }));
          setRecentCompetitions(formattedCompetitions);
        }
      }
    } catch (error) {
      console.error('Erreur compétitions:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(
        `${API_BASE_URL}/notifications?unread=true&limit=5`,
        { method: 'GET', headers: getAuthHeaders() }
      );

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || data || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
    }
  };

  const generateRevenueData = (totalRevenue) => {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const data = days.map(day => ({
      day,
      revenue: Math.floor(Math.random() * totalRevenue / 7) + 1000
    }));
    setBalanceData(data);
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

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    fetchDashboardData();
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: getAuthHeaders()
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
    
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('agencyData');
    navigate('/login');
  };

  const handleEditCompetition = (competitionId) => {
    setEditingCompetitionId(competitionId);
    setActivePage('edit-competition');
  };

  const handleViewCompetition = (competition) => {
    setViewingCompetition(competition);
    setShowCompetitionDetails(true);
  };

  const handleEditFromDetails = (competitionId) => {
    setShowCompetitionDetails(false);
    handleEditCompetition(competitionId);
  };

  const handleDeleteFromDetails = async (competitionId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette compétition ?')) {
      try {
        const token = localStorage.getItem('userToken');
        const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          fetchCompetitionsData();
          setShowCompetitionDetails(false);
        } else {
          alert('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleSubmitFromDetails = async (competitionId) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        fetchCompetitionsData();
        setShowCompetitionDetails(false);
      } else {
        alert(`Erreur: ${data.message || 'Impossible de soumettre'}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la soumission');
    }
  };

  // ==================== GESTION DU THÈME ====================
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // ==================== RENDU DES PAGES ====================
  const renderActivePage = () => {
    switch (activePage) {
      case 'overview':
        return (
          <OverviewPage 
            user={user}
            stats={stats}
            competitionStatus={competitionStatus}
            recentCompetitions={recentCompetitions}
            leaderboard={leaderboard}
            balanceData={balanceData}
            period={period}
            onPeriodChange={handlePeriodChange}
            onViewCompetition={(compId) => {
              const comp = recentCompetitions.find(c => c.id === compId);
              if (comp) handleViewCompetition(comp);
            }}
          />
        );
      case 'competitions':
        return (
          <CompetitionsPage 
            user={user} 
            onEditCompetition={handleEditCompetition}
            onViewCompetition={handleViewCompetition}
          />
        );
      case 'edit-competition':
        return (
          <EditCompetitionPage 
            competitionId={editingCompetitionId}
            user={user}
            onCancel={() => setActivePage('competitions')}
            onSuccess={() => {
              setActivePage('competitions');
              fetchCompetitionsData();
            }}
          />
        );
      case 'analytics':
        return <AnalyticsPage user={user} />;
      case 'settings':
        return <SettingsPage user={user} />;
      default:
        return (
          <OverviewPage 
            user={user}
            stats={stats}
            competitionStatus={competitionStatus}
            recentCompetitions={recentCompetitions}
            leaderboard={leaderboard}
            balanceData={balanceData}
            period={period}
            onPeriodChange={handlePeriodChange}
            onViewCompetition={(compId) => {
              const comp = recentCompetitions.find(c => c.id === compId);
              if (comp) handleViewCompetition(comp);
            }}
          />
        );
    }
  };

  if (loading && activePage === 'overview') {
    return (  
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Chargement du dashboard...</p>
      </div>
    );
  }

return (
  <div className={`agency-dashboard ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
    {/* Modals */}
    <CompetitionDetailsModal
      isOpen={showCompetitionDetails}
      competition={viewingCompetition}
      onClose={() => setShowCompetitionDetails(false)}
      onEdit={handleEditFromDetails}
      onDelete={handleDeleteFromDetails}
      onSubmit={handleSubmitFromDetails}
    />
 <div className="template-color-1">
      <Header />
    
        </div>
    {/* Titre du dashboard */}
    <div className="dashboard-header-section">
      <h1 className="dashboard-title">
        Dashboard Organisateur
        <span className="welcome-text">Bienvenue, {user?.firstName || 'TESTAGENCE2'}</span>
      </h1>
    </div>

    {/* Contenu principal */}
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <ul>
            <li className={`nav-item ${activePage === 'overview' ? 'active' : ''}`}>
              <button onClick={() => setActivePage('overview')} className="nav-link">
                <span className="nav-icon">📊</span>
                <span className="nav-text">Vue d'ensemble</span>
              </button>
            </li>
            <li className={`nav-item ${activePage === 'competitions' ? 'active' : ''}`}>
              <button onClick={() => setActivePage('competitions')} className="nav-link">
                <span className="nav-icon">🏆</span>
                <span className="nav-text">Mes compétitions</span>
              </button>
            </li>
            <li className={`nav-item ${activePage === 'analytics' ? 'active' : ''}`}>
              <button onClick={() => setActivePage('analytics')} className="nav-link">
                <span className="nav-icon">📈</span>
                <span className="nav-text">Analytics</span>
              </button>
            </li>
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
               <button 
          className="theme-toggle-btn"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? "Mode clair" : "Mode sombre"}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
            </li>
          </ul>
        </nav>

        <div className="sidebar-balance">
          <div className="balance-label">Solde disponible</div>
          <div className="balance-amount">{stats.revenue.toLocaleString()} XOF</div>
          <div className="balance-info">Mis à jour à l'instant</div>
          <button 
            className="refresh-balance-btn"
            onClick={fetchDashboardData}
            title="Actualiser les données"
          >
            🔄 Actualiser
          </button>
        </div>
      </aside>
      

      {/* Contenu de la page */}
      <main className="main-content">
        {renderActivePage()}
      </main>
      
    </div>
    <div className="template-color-1">
      <Footer />
    
        </div>
  </div>
  
);
};

export default AgencyDashboard;