// UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Award, TrendingUp, Wallet, Bell, Settings, 
  LogOut, Home, Calendar, History, CreditCard,
  Star, Vote, ChevronRight, Moon, Sun, BarChart3,
  Heart, HelpCircle, Shield, FileText, Users,
  ChevronLeft, ChevronDown, Filter, Search,
  CheckCircle, AlertCircle, RefreshCw
} from 'lucide-react';
import axios from 'axios';
import './UserProfile.css';

const UserProfilePage = () => {
  const navigate = useNavigate();
  
  // États
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalVotes: 0,
    totalTransactions: 0,
    totalCompetitions: 0,
    totalSpent: 0,
    ranking: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [votes, setVotes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notificationToast, setNotificationToast] = useState({
    show: false,
    type: 'success',
    message: '',
    title: ''
  });

  // Configuration API
  const API_BASE_URL = 'https://api-klumer-node-votings-dev.onrender.com';
  const token = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });

  // Intercepteur pour rafraîchir le token
  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      if (error.response?.status === 401 && refreshToken) {
        try {
          const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            token: refreshToken
          });
          
          const newToken = refreshResponse.data.token;
          localStorage.setItem('access_token', newToken);
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(error.config);
        } catch (refreshError) {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  // Charger les données
  useEffect(() => {
    fetchUserData();
    fetchUserStats();
    fetchTransactions();
    fetchNotifications();
    fetchCompetitions();
    
    // Vérifier le thème sauvegardé
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  // Appliquer le thème au document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // 1. Récupérer les données utilisateur
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Erreur utilisateur:', error);
      showNotification('error', 'Erreur', 'Impossible de charger les données utilisateur');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Récupérer les statistiques utilisateur
  const fetchUserStats = async () => {
    try {
      // Essayer d'abord avec l'endpoint diagnostic
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenData.id || tokenData.userId;
      
      const diagnosticResponse = await axiosInstance.get(`/diagnostic/user/${userId}`);
      
      if (diagnosticResponse.data) {
        const userData = diagnosticResponse.data;
        
        const stats = {
          totalVotes: userData.votes?.length || 0,
          totalTransactions: userData.transactions?.length || 0,
          totalCompetitions: [...new Set(userData.votes?.map(v => v.competitionId))].length || 0,
          totalSpent: userData.transactions
            ?.filter(t => t.status === 'success')
            .reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
          ranking: Math.floor(Math.random() * 100) + 1
        };
        
        setStats(stats);
        setVotes(userData.votes || []);
      }
    } catch (error) {
      console.error('Erreur stats:', error);
      // Utiliser les transactions comme fallback
      try {
        const transResponse = await axiosInstance.get('/admin/transactions', {
          params: { limit: 100 }
        });
        
        if (transResponse.data.transactions) {
          const userTrans = transResponse.data.transactions;
          const voteCount = userTrans.filter(t => t.type === 'vote').length;
          const totalAmount = userTrans
            .filter(t => t.status === 'success')
            .reduce((sum, t) => sum + (t.amount || 0), 0);
          
          setStats({
            totalVotes: voteCount,
            totalTransactions: userTrans.length,
            totalCompetitions: [...new Set(userTrans.map(t => t.competitionId))].length,
            totalSpent: totalAmount,
            ranking: Math.floor(Math.random() * 100) + 1
          });
        }
      } catch (transError) {
        console.error('Erreur transactions:', transError);
      }
    }
  };

  // 3. Récupérer les transactions
  const fetchTransactions = async () => {
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenData.id || tokenData.userId;
      
      const response = await axiosInstance.get('/admin/transactions', {
        params: {
          userId: userId,
          limit: 10,
          page: 1,
          sort: 'createdAt:desc'
        }
      });
      
      if (response.data.transactions) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error('Erreur transactions:', error);
    }
  };

  // 4. Récupérer les notifications
  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/notifications', {
        params: { limit: 5 }
      });
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Erreur notifications:', error);
    }
  };

  // 5. Récupérer les compétitions
  const fetchCompetitions = async () => {
    try {
      const response = await axiosInstance.get('/competitions', {
        params: {
          limit: 5,
          status: 'active'
        }
      });
      setCompetitions(response.data || []);
    } catch (error) {
      console.error('Erreur compétitions:', error);
    }
  };

  // 6. Changer le mot de passe
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification('error', 'Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%^?&#])[A-Za-z\d@$!%^?&#]{8,}$/;
    if (!passwordRegex.test(passwordForm.newPassword)) {
      showNotification(
        'error',
        'Format incorrect',
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%^?&#)'
      );
      return;
    }
    
    try {
      const response = await axiosInstance.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (response.data.message) {
        showNotification('success', 'Succès', 'Mot de passe changé avec succès');
        setShowChangePassword(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      showNotification('error', 'Erreur', 'Impossible de changer le mot de passe');
    }
  };

  // 7. Déconnexion
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout', { token: refreshToken });
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
  };

  // 8. Formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 9. Formater les montants
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // 10. Notification toast
  const showNotification = (type, title, message) => {
    setNotificationToast({ show: true, type, title, message });
    setTimeout(() => {
      setNotificationToast(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // 11. Rafraîchir les données
  const refreshData = () => {
    setIsLoading(true);
    Promise.all([
      fetchUserData(),
      fetchUserStats(),
      fetchTransactions(),
      fetchNotifications(),
      fetchCompetitions()
    ]).finally(() => {
      setIsLoading(false);
      showNotification('success', 'Actualisé', 'Données mises à jour');
    });
  };

  // Composants de page
  const OverviewPage = () => (
    <div className="page-content">
      <div className="page-header">
        <h1>Vue d'ensemble</h1>
        <p className="subtitle">Bienvenue sur votre tableau de bord</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Award />
          </div>
          <div className="stat-content">
            <h3>Compétitions</h3>
            <p className="stat-value">{stats.totalCompetitions}</p>
            <span className="stat-label">Participations</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp />
          </div>
          <div className="stat-content">
            <h3>Votes total</h3>
            <p className="stat-value">{stats.totalVotes}</p>
            <span className="stat-label">Votes effectués</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Wallet />
          </div>
          <div className="stat-content">
            <h3>Montant total</h3>
            <p className="stat-value">{formatAmount(stats.totalSpent)}</p>
            <span className="stat-label">Dépensé</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Star />
          </div>
          <div className="stat-content">
            <h3>Classement</h3>
            <p className="stat-value">#{stats.ranking}</p>
            <span className="stat-label">Position</span>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="card">
          <div className="card-header">
            <h3>Compétitions actives</h3>
            <button 
              className="btn-link"
              onClick={() => navigate('/competitions')}
            >
              Voir tout
            </button>
          </div>
          <div className="card-content">
            {competitions.length > 0 ? (
              competitions.map((comp, index) => (
                <div key={index} className="list-item">
                  <div className="list-item-content">
                    <h4>{comp.title}</h4>
                    <p className="text-muted">
                      {comp.candidates?.length || 0} candidats • {comp.status}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/competitions/${comp.id}`)}
                    className="btn-icon"
                  >
                    <Vote size={16} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-muted">Aucune compétition active</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Activité récente</h3>
            <button 
              className="btn-link"
              onClick={() => setActivePage('transactions')}
            >
              Voir tout
            </button>
          </div>
          <div className="card-content">
            {transactions.slice(0, 5).map((transaction, index) => (
              <div key={index} className="list-item">
                <div className={`status-dot ${transaction.status}`}></div>
                <div className="list-item-content">
                  <h4>{transaction.description || 'Transaction'}</h4>
                  <p className="text-muted">{formatDate(transaction.createdAt)}</p>
                </div>
                <div className="list-item-value">
                  <span className={transaction.amount > 0 ? 'text-success' : 'text-error'}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount} XOF
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card full-width">
        <div className="card-header">
          <h3>Mes votes récents</h3>
          <button 
            className="btn-link"
            onClick={() => setActivePage('votes')}
          >
            Voir tout
          </button>
        </div>
        <div className="card-content">
          {votes.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Candidat</th>
                    <th>Compétition</th>
                    <th>Date</th>
                    <th>Votes</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {votes.slice(0, 5).map((vote, index) => (
                    <tr key={index}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-sm">
                            {vote.candidateName?.charAt(0) || '?'}
                          </div>
                          <span>{vote.candidateName}</span>
                        </div>
                      </td>
                      <td>{vote.competitionTitle}</td>
                      <td>{formatDate(vote.createdAt)}</td>
                      <td>{vote.voteCount || 1}</td>
                      <td>
                        <span className={`badge ${vote.status}`}>
                          {vote.status === 'success' ? '✅ Réussi' : '⏳ En attente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">Aucun vote effectué</p>
          )}
        </div>
      </div>
    </div>
  );

  const VotesPage = () => (
    <div className="page-content">
      <div className="page-header">
        <h1>Mes votes</h1>
        <p className="subtitle">Historique de tous vos votes</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Rechercher un vote..." />
          </div>
          <div className="filter-buttons">
            <button className="btn-secondary">
              <Filter size={16} />
              Filtrer
            </button>
          </div>
        </div>
        
        <div className="card-content">
          {votes.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Candidat</th>
                    <th>Compétition</th>
                    <th>Date</th>
                    <th>Votes</th>
                    <th>Montant</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {votes.map((vote, index) => (
                    <tr key={index}>
                      <td className="text-muted">#{vote.id?.substring(0, 8)}</td>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-sm">
                            {vote.candidateName?.charAt(0) || '?'}
                          </div>
                          <span>{vote.candidateName}</span>
                        </div>
                      </td>
                      <td>{vote.competitionTitle}</td>
                      <td>{formatDate(vote.createdAt)}</td>
                      <td>{vote.voteCount || 1}</td>
                      <td>{formatAmount(vote.totalAmount || (vote.voteCount || 1) * 100)}</td>
                      <td>
                        <span className={`badge ${vote.status}`}>
                          {vote.status === 'success' ? '✅ Réussi' : '⏳ En attente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <Vote size={48} />
              <h3>Aucun vote trouvé</h3>
              <p>Vous n'avez pas encore participé à des votes.</p>
              <button 
                className="btn-primary"
                onClick={() => navigate('/competitions')}
              >
                Voter maintenant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const TransactionsPage = () => (
    <div className="page-content">
      <div className="page-header">
        <h1>Transactions</h1>
        <p className="subtitle">Historique de vos paiements</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <h3>Total dépensé</h3>
            <p className="stat-value">{formatAmount(stats.totalSpent)}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <h3>Transactions</h3>
            <p className="stat-value">{stats.totalTransactions}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <h3>Taux de réussite</h3>
            <p className="stat-value">
              {transactions.length > 0 
                ? `${Math.round((transactions.filter(t => t.status === 'success').length / transactions.length) * 100)}%`
                : '0%'}
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Rechercher une transaction..." />
          </div>
          <div className="filter-buttons">
            <button className="btn-secondary">
              <Filter size={16} />
              Filtrer
            </button>
          </div>
        </div>
        
        <div className="card-content">
          {transactions.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Méthode</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td className="text-muted">#{transaction.id?.substring(0, 8)}</td>
                      <td>{transaction.description || 'Transaction'}</td>
                      <td>{formatDate(transaction.createdAt)}</td>
                      <td className={transaction.amount > 0 ? 'text-success' : 'text-error'}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount} XOF
                      </td>
                      <td>{transaction.paymentMethod || 'Mobile Money'}</td>
                      <td>
                        <span className={`badge ${transaction.status}`}>
                          {transaction.status === 'success' ? '✅ Réussi' : 
                           transaction.status === 'pending' ? '⏳ En attente' : '❌ Échoué'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <CreditCard size={48} />
              <h3>Aucune transaction</h3>
              <p>Vous n'avez effectué aucune transaction pour le moment.</p>
              <button 
                className="btn-primary"
                onClick={() => navigate('/competitions')}
              >
                Voter maintenant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const SettingsPage = () => (
    <div className="page-content">
      <div className="page-header">
        <h1>Paramètres</h1>
        <p className="subtitle">Gérez votre compte et préférences</p>
      </div>

      <div className="settings-grid">
        <div className="card">
          <div className="card-header">
            <h3>Informations personnelles</h3>
          </div>
          <div className="card-content">
            <div className="form-group">
              <label>Prénom</label>
              <input type="text" value={user?.firstName || ''} disabled />
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input type="text" value={user?.lastName || ''} disabled />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={user?.email || ''} disabled />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Sécurité</h3>
          </div>
          <div className="card-content">
            <button 
              className="btn-secondary full-width"
              onClick={() => setShowChangePassword(true)}
            >
              <Shield size={16} />
              Changer le mot de passe
            </button>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Authentification à deux facteurs</h4>
                <p className="text-muted">Ajoutez une sécurité supplémentaire</p>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Sessions actives</h4>
                <p className="text-muted">Gérez vos sessions de connexion</p>
              </div>
              <button className="btn-link">Voir</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Notifications</h3>
          </div>
          <div className="card-content">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Notifications par email</h4>
                <p className="text-muted">Recevez les mises à jour par email</p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Notifications push</h4>
                <p className="text-muted">Recevez des notifications en temps réel</p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Mises à jour compétitions</h4>
                <p className="text-muted">Suivez les compétitions que vous aimez</p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="card danger-zone">
          <div className="card-header">
            <h3>Zone dangereuse</h3>
          </div>
          <div className="card-content">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Supprimer le compte</h4>
                <p className="text-muted">Cette action est irréversible</p>
              </div>
              <button className="btn-danger">
                Supprimer
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Exporter mes données</h4>
                <p className="text-muted">Téléchargez toutes vos données</p>
              </div>
              <button className="btn-secondary">
                Exporter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading && !user) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className={`user-profile ${darkMode ? 'dark' : 'light'}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">K</div>
            {!sidebarCollapsed && <span className="logo-text">Klumer</span>}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="user-info">
          <div className="user-avatar">
            <User size={24} />
          </div>
          {!sidebarCollapsed && (
            <div className="user-details">
              <h4>{user?.firstName} {user?.lastName}</h4>
              <p className="user-email">{user?.email}</p>
              <span className="user-badge">Votant</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activePage === 'overview' ? 'active' : ''}`}
            onClick={() => setActivePage('overview')}
          >
            <BarChart3 size={20} />
            {!sidebarCollapsed && <span>Vue d'ensemble</span>}
          </button>
          
          <button 
            className={`nav-item ${activePage === 'votes' ? 'active' : ''}`}
            onClick={() => setActivePage('votes')}
          >
            <Vote size={20} />
            {!sidebarCollapsed && <span>Mes votes</span>}
            {!sidebarCollapsed && stats.totalVotes > 0 && (
              <span className="nav-badge">{stats.totalVotes}</span>
            )}
          </button>
          
          <button 
            className={`nav-item ${activePage === 'transactions' ? 'active' : ''}`}
            onClick={() => setActivePage('transactions')}
          >
            <CreditCard size={20} />
            {!sidebarCollapsed && <span>Transactions</span>}
          </button>
          
          <button 
            className={`nav-item ${activePage === 'settings' ? 'active' : ''}`}
            onClick={() => setActivePage('settings')}
          >
            <Settings size={20} />
            {!sidebarCollapsed && <span>Paramètres</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button 
            className="nav-item"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {!sidebarCollapsed && <span>{darkMode ? 'Mode clair' : 'Mode sombre'}</span>}
          </button>
          
          <button 
            className="nav-item logout"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-left">
            <h2>
              {activePage === 'overview' && 'Tableau de bord'}
              {activePage === 'votes' && 'Mes votes'}
              {activePage === 'transactions' && 'Transactions'}
              {activePage === 'settings' && 'Paramètres'}
            </h2>
          </div>
          
          <div className="top-bar-right">
            <button 
              className="btn-icon"
              onClick={refreshData}
              disabled={isLoading}
              title="Rafraîchir"
            >
              <RefreshCw className={isLoading ? 'spinning' : ''} size={20} />
            </button>
            
            <div className="notifications">
              <button className="btn-icon" title="Notifications">
                <Bell size={20} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="notification-dot"></span>
                )}
              </button>
            </div>
            
            <button 
              className="btn-primary"
              onClick={() => navigate('/competitions')}
            >
              <Vote size={16} />
              <span>Voter maintenant</span>
            </button>
          </div>
        </header>

        <div className="content-wrapper">
          {activePage === 'overview' && <OverviewPage />}
          {activePage === 'votes' && <VotesPage />}
          {activePage === 'transactions' && <TransactionsPage />}
          {activePage === 'settings' && <SettingsPage />}
        </div>
      </main>

      {/* Modal changement de mot de passe */}
      {showChangePassword && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Changer le mot de passe</h3>
              <button
                onClick={() => setShowChangePassword(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Mot de passe actuel</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ 
                    ...prev, 
                    currentPassword: e.target.value 
                  }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ 
                    ...prev, 
                    newPassword: e.target.value 
                  }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ 
                    ...prev, 
                    confirmPassword: e.target.value 
                  }))}
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Changer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification toast */}
      {notificationToast.show && (
        <div className={`toast ${notificationToast.type}`}>
          <div className="toast-icon">
            {notificationToast.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
          </div>
          <div className="toast-content">
            <h4>{notificationToast.title}</h4>
            <p>{notificationToast.message}</p>
          </div>
          <button
            onClick={() => setNotificationToast(prev => ({ ...prev, show: false }))}
            className="toast-close"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;