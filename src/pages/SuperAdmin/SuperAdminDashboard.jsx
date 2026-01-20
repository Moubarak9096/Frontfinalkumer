import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
} from 'chart.js';
import './SuperAdminDashboard.css';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
);

const SuperAdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('today');
  const [superAdmin, setSuperAdmin] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // États pour les données de la plateforme
  const [systemOverview, setSystemOverview] = useState({
    totalUsers: 18452,
    activeUsers: 15423,
    newUsersToday: 342,
    totalRevenue: 48562300,
    revenueToday: 452300,
    platformFee: 30,
    totalCompetitions: 845,
    activeCompetitions: 156,
    pendingApproval: 42,
    systemHealth: 98.7,
    serverLoad: 24.5,
    apiCalls: 452123,
    averageResponseTime: 124,
    errorRate: 0.2
  });

  const [realTimeStats, setRealTimeStats] = useState({
    onlineUsers: 2456,
    activeVotes: 1234,
    transactionsPerMinute: 45,
    newRegistrations: 12,
    pendingWithdrawals: 8,
    systemAlerts: 3
  });

  const [financialMetrics, setFinancialMetrics] = useState({
    totalPlatformEarnings: 14562300,
    totalPayouts: 34000000,
    pendingPayouts: 4523000,
    averageTransactionValue: 24500,
    dailyRevenue: 452300,
    weeklyRevenue: 3124500,
    monthlyRevenue: 12542300,
    revenueGrowth: 15.7,
    topEarningCompetitions: [
      { id: 1, title: 'Élection Présidentielle', revenue: 12500000 },
      { id: 2, title: 'Meilleur Artiste', revenue: 8500000 },
      { id: 3, title: 'Sportif de l\'Année', revenue: 7200000 }
    ]
  });

  const [systemAdmins, setSystemAdmins] = useState([
    { id: 1, name: 'Jean Dupont', email: 'jean@klumer.tg', role: 'super_admin', lastActive: 'Maintenant', status: 'active', permissions: 'Full Access' },
    { id: 2, name: 'Marie Konate', email: 'marie@klumer.tg', role: 'admin_finance', lastActive: '2h ago', status: 'active', permissions: 'Finances & Paiements' },
    { id: 3, name: 'Kofi Amevi', email: 'kofi@klumer.tg', role: 'admin_content', lastActive: '5h ago', status: 'active', permissions: 'Contenu & Compétitions' },
    { id: 4, name: 'Aicha Bello', email: 'aicha@klumer.tg', role: 'admin_support', lastActive: '1 jour', status: 'inactive', permissions: 'Support Utilisateurs' },
    { id: 5, name: 'David Mensah', email: 'david@klumer.tg', role: 'admin_analytics', lastActive: 'Maintenant', status: 'active', permissions: 'Analytics & Rapports' }
  ]);

  const [systemLogs, setSystemLogs] = useState([
    { id: 1, timestamp: '2024-01-08 14:30:22', user: 'system', action: 'Backup automatique réussi', level: 'info', details: 'Backup de la base de données complété' },
    { id: 2, timestamp: '2024-01-08 14:15:10', user: 'admin_finance', action: 'Paiement traité', level: 'success', details: 'Paiement #45879 de 500,000 FCFA' },
    { id: 3, timestamp: '2024-01-08 13:45:33', user: 'API Gateway', action: 'Taux de requêtes élevé', level: 'warning', details: '1500 requêtes/minute détectées' },
    { id: 4, timestamp: '2024-01-08 12:20:15', user: 'security', action: 'Tentative de connexion suspecte', level: 'danger', details: '5 tentatives échouées depuis IP 192.168.1.100' },
    { id: 5, timestamp: '2024-01-08 11:05:42', user: 'system', action: 'Mise à jour système', level: 'info', details: 'Version 2.3.1 déployée avec succès' }
  ]);

  const [systemAlerts, setSystemAlerts] = useState([
    { id: 1, type: 'server', message: 'Charge serveur élevée (85%)', severity: 'high', time: '10 min' },
    { id: 2, type: 'security', message: 'Tentative de force brute détectée', severity: 'critical', time: '25 min' },
    { id: 3, type: 'payment', message: 'Échec du webhook de paiement', severity: 'medium', time: '1h' },
    { id: 4, type: 'database', message: 'Temps de réponse BD augmenté', severity: 'low', time: '2h' }
  ]);

  const [apiUsage, setApiUsage] = useState({
    totalRequests: 452123,
    successRate: 99.8,
    averageLatency: 124,
    endpoints: [
      { name: 'GET /api/competitions', requests: 125000, avgTime: 89 },
      { name: 'POST /api/votes', requests: 98000, avgTime: 120 },
      { name: 'GET /api/users', requests: 75000, avgTime: 67 },
      { name: 'POST /api/payments', requests: 32000, avgTime: 210 },
      { name: 'GET /api/analytics', requests: 15000, avgTime: 145 }
    ]
  });

  const [platformSettings, setPlatformSettings] = useState({
    platformFee: 30,
    organizerFee: 70,
    minVoteAmount: 100,
    maxVoteAmount: 10000,
    defaultCurrency: 'FCFA',
    autoApproveCompetitions: false,
    maintenanceMode: false,
    enableEmailNotifications: true,
    enableSMSNotifications: true,
    requireIdentityVerification: false,
    maxDailyWithdrawal: 5000000,
    voteVerificationRequired: true,
    competitionCreationFee: 50000,
    payoutThreshold: 100000
  });

  useEffect(() => {
    const checkSuperAdminPermissions = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSuperAdmin = {
        id: 1,
        firstName: 'Super',
        fullName: 'Super Administrateur',
        role: 'super_admin',
        permissions: ['all'],
        lastLogin: new Date().toISOString()
      };
      
      setSuperAdmin(mockSuperAdmin);
      setIsLoading(false);
    };

    checkSuperAdminPermissions();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('superAdminToken');
    navigate('/login');
  };

  const handleAddAdmin = () => {
    console.log('Ajouter un administrateur');
  };

  const handleSystemRestart = () => {
    if (window.confirm('Êtes-vous sûr de vouloir redémarrer le système ?')) {
      console.log('Redémarrage du système...');
    }
  };

  const handleForcePayout = () => {
    if (window.confirm('Forcer le traitement de tous les paiements en attente ?')) {
      console.log('Traitement forcé des paiements...');
    }
  };

  const handleClearCache = () => {
    if (window.confirm('Vider le cache système ?')) {
      console.log('Cache vidé...');
    }
  };

  // Données pour les graphiques
  const revenueChartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Revenus (Millions FCFA)',
        data: [8.5, 9.2, 12.5, 15.8, 18.2, 20.5, 22.8, 25.1, 28.5, 32.2, 36.8, 42.5],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const systemHealthChartData = {
    labels: ['CPU', 'Mémoire', 'Disque', 'Réseau', 'Base de données'],
    datasets: [
      {
        label: 'Utilisation (%)',
        data: [24.5, 68.2, 42.3, 15.8, 32.1],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(234, 179, 8, 0.6)',
          'rgba(168, 85, 247, 0.6)',
          'rgba(239, 68, 68, 0.6)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(234, 179, 8)',
          'rgb(168, 85, 247)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 1
      }
    ]
  };

  const userGrowthChartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Nouveaux utilisateurs',
        data: [1250, 1420, 1680, 1950, 2340, 2850, 3420],
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      }
    ]
  };

  // CORRECTION ICI : Problème de syntaxe résolu
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (isLoading) {
    return (
      <div className="super-admin-loading">
        <div className="loading-content">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <h4>Chargement du Panneau SuperAdmin...</h4>
          <p>Vérification des permissions de niveau supérieur</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`super-admin-dashboard ${theme} ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Barre latérale */}
      <div className="super-admin-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <i className="feather-shield"></i>
            </div>
            <div className="logo-text">
              <h2>Klumer</h2>
              <small>Super Admin</small>
            </div>
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className="feather-chevron-left"></i>
          </button>
        </div>

        <div className="sidebar-menu">
          <div className="user-info">
            <div className="avatar super-admin-avatar">
              <i className="feather-crown"></i>
            </div>
            <div>
              <h6>{superAdmin?.firstName || 'Super Admin'}</h6>
              <small>Full System Access</small>
              <div className="user-status">
                <span className="status-indicator active"></span>
                <span>Connecté</span>
              </div>
            </div>
          </div>

          <nav>
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="feather-home"></i>
              <span>Vue d'ensemble</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'financial' ? 'active' : ''}`}
              onClick={() => setActiveTab('financial')}
            >
              <i className="feather-dollar-sign"></i>
              <span>Finances Globales</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'system' ? 'active' : ''}`}
              onClick={() => setActiveTab('system')}
            >
              <i className="feather-server"></i>
              <span>Monitoring Système</span>
              {systemAlerts.length > 0 && (
                <span className="badge badge-danger">{systemAlerts.length}</span>
              )}
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'admins' ? 'active' : ''}`}
              onClick={() => setActiveTab('admins')}
            >
              <i className="feather-users"></i>
              <span>Administrateurs</span>
              <span className="badge">{systemAdmins.length}</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <i className="feather-shield"></i>
              <span>Sécurité</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              <i className="feather-file-text"></i>
              <span>Logs Système</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'api' ? 'active' : ''}`}
              onClick={() => setActiveTab('api')}
            >
              <i className="feather-code"></i>
              <span>API & Intégrations</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <i className="feather-settings"></i>
              <span>Configuration Avancée</span>
            </button>

            <div className="nav-divider"></div>

            <button 
              className={`nav-item ${activeTab === 'backup' ? 'active' : ''}`}
              onClick={() => setActiveTab('backup')}
            >
              <i className="feather-database"></i>
              <span>Sauvegarde & Restauration</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveTab('audit')}
            >
              <i className="feather-eye"></i>
              <span>Audit & Conformité</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            <i className={`feather-${theme === 'light' ? 'moon' : 'sun'}`}></i>
            <span>Mode {theme === 'light' ? 'Sombre' : 'Clair'}</span>
          </button>
          
          <button className="logout-btn" onClick={handleLogout}>
            <i className="feather-power"></i>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="super-admin-main">
        <div className="top-bar">
          <div className="top-bar-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <i className="feather-menu"></i>
            </button>
            
            <div className="breadcrumb">
              <span>Super Admin</span>
              <i className="feather-chevron-right"></i>
              <span className="current-page">
                {activeTab === 'overview' && 'Vue d\'ensemble'}
                {activeTab === 'financial' && 'Finances Globales'}
                {activeTab === 'system' && 'Monitoring Système'}
                {activeTab === 'admins' && 'Administrateurs'}
                {activeTab === 'security' && 'Sécurité'}
                {activeTab === 'logs' && 'Logs Système'}
                {activeTab === 'api' && 'API & Intégrations'}
                {activeTab === 'settings' && 'Configuration Avancée'}
                {activeTab === 'backup' && 'Sauvegarde & Restauration'}
                {activeTab === 'audit' && 'Audit & Conformité'}
              </span>
            </div>
          </div>
          
          <div className="top-bar-right">
            <div className="system-controls">
              <button className="btn btn-sm btn-outline-warning" onClick={handleClearCache}>
                <i className="feather-refresh-cw"></i>
                <span>Vider Cache</span>
              </button>
              
              <button className="btn btn-sm btn-outline-danger" onClick={handleSystemRestart}>
                <i className="feather-refresh-cw"></i>
                <span>Redémarrer Système</span>
              </button>
              
              <button className="btn btn-sm btn-outline-success" onClick={handleForcePayout}>
                <i className="feather-dollar-sign"></i>
                <span>Forcer Paiements</span>
              </button>
            </div>
            
            <div className="quick-stats">
              <div className="stat-item">
                <i className="feather-users"></i>
                <span>{realTimeStats.onlineUsers.toLocaleString()} en ligne</span>
              </div>
              <div className="stat-item">
                <i className="feather-activity"></i>
                <span>{systemOverview.systemHealth}% santé</span>
              </div>
              <div className="stat-item">
                <i className="feather-alert-circle"></i>
                <span className="alert-count">{systemAlerts.length} alertes</span>
              </div>
            </div>
            
            <div className="user-actions">
              <button className="notification-btn">
                <i className="feather-bell"></i>
                <span className="notification-count">{systemAlerts.length}</span>
              </button>
              
              <div className="user-dropdown">
                <div className="user-avatar">
                  <i className="feather-user"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-area">
          {activeTab === 'overview' && (
            <OverviewContent 
              systemOverview={systemOverview}
              realTimeStats={realTimeStats}
              financialMetrics={financialMetrics}
              systemAlerts={systemAlerts}
              revenueChartData={revenueChartData}
              userGrowthChartData={userGrowthChartData}
              chartOptions={chartOptions}
            />
          )}
          
          {activeTab === 'financial' && (
            <FinancialContent 
              financialMetrics={financialMetrics}
              systemOverview={systemOverview}
            />
          )}
          
          {activeTab === 'system' && (
            <SystemContent 
              systemOverview={systemOverview}
              systemAlerts={systemAlerts}
              apiUsage={apiUsage}
              systemHealthChartData={systemHealthChartData}
              chartOptions={chartOptions}
            />
          )}
          
          {activeTab === 'admins' && (
            <AdminsContent 
              systemAdmins={systemAdmins}
              onAddAdmin={handleAddAdmin}
            />
          )}
          
          {activeTab === 'security' && (
            <SecurityContent 
              systemLogs={systemLogs}
            />
          )}
          
          {activeTab === 'logs' && (
            <LogsContent 
              systemLogs={systemLogs}
            />
          )}
          
          {activeTab === 'api' && (
            <ApiContent 
              apiUsage={apiUsage}
            />
          )}
          
          {activeTab === 'settings' && (
            <SettingsContent 
              platformSettings={platformSettings}
              setPlatformSettings={setPlatformSettings}
            />
          )}
          
          {activeTab === 'backup' && (
            <BackupContent />
          )}
          
          {activeTab === 'audit' && (
            <AuditContent />
          )}
        </div>
      </div>
    </div>
  );
};

// Composants de contenu
const OverviewContent = ({ systemOverview, realTimeStats, financialMetrics, systemAlerts, revenueChartData, userGrowthChartData, chartOptions }) => {
  return (
    <div className="overview-content">
      {/* Cartes principales */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="stat-card primary">
            <div className="stat-icon">
              <i className="feather-globe"></i>
            </div>
            <div className="stat-content">
              <h3>{systemOverview.totalUsers.toLocaleString()}</h3>
              <p>Utilisateurs totaux</p>
              <div className="stat-trend up">
                <i className="feather-trending-up"></i>
                <span>+{systemOverview.newUsersToday} aujourd'hui</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6">
          <div className="stat-card success">
            <div className="stat-icon">
              <i className="feather-dollar-sign"></i>
            </div>
            <div className="stat-content">
              <h3>{(systemOverview.totalRevenue / 1000000).toFixed(1)}M FCFA</h3>
              <p>Revenu total</p>
              <div className="stat-trend up">
                <i className="feather-trending-up"></i>
                <span>+{financialMetrics.revenueGrowth}% croissance</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6">
          <div className="stat-card warning">
            <div className="stat-icon">
              <i className="feather-server"></i>
            </div>
            <div className="stat-content">
              <h3>{systemOverview.systemHealth}%</h3>
              <p>Santé système</p>
              <div className="stat-trend">
                <i className="feather-check-circle"></i>
                <span>{realTimeStats.onlineUsers} utilisateurs en ligne</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6">
          <div className="stat-card danger">
            <div className="stat-icon">
              <i className="feather-alert-circle"></i>
            </div>
            <div className="stat-content">
              <h3>{systemAlerts.length}</h3>
              <p>Alertes actives</p>
              <div className="stat-trend down">
                <i className="feather-alert-triangle"></i>
                <span>Nécessite attention</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques et statistiques */}
      <div className="row mb-4">
        <div className="col-lg-8">
          <div className="chart-card">
            <div className="chart-header">
              <h5>Revenus annuels</h5>
              <div className="revenue-summary">
                <span className="revenue-total">Total: {(financialMetrics.totalPlatformEarnings / 1000000).toFixed(1)}M FCFA</span>
              </div>
            </div>
            <div className="chart-container">
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="chart-card">
            <div className="chart-header">
              <h5>Statistiques temps réel</h5>
            </div>
            <div className="chart-container">
              <div className="real-time-stats">
                {Object.entries(realTimeStats).map(([key, value]) => (
                  <div key={key} className="real-time-stat">
                    <div className="stat-label">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</div>
                    <div className="stat-value">{value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes et compétitions */}
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5>Alertes système</h5>
              <button className="btn btn-sm btn-outline-danger">
                <i className="feather-alert-triangle"></i>
                Tout résoudre
              </button>
            </div>
            <div className="card-body">
              <div className="alerts-list">
                {systemAlerts.map(alert => (
                  <div key={alert.id} className={`alert-item alert-${alert.severity}`}>
                    <div className="alert-icon">
                      <i className={`feather-${alert.severity === 'critical' ? 'alert-triangle' : 'alert-circle'}`}></i>
                    </div>
                    <div className="alert-content">
                      <h6>{alert.message}</h6>
                      <div className="alert-meta">
                        <span className="alert-type">{alert.type}</span>
                        <span className="alert-time">{alert.time}</span>
                      </div>
                    </div>
                    <button className="alert-action">
                      <i className="feather-x"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5>Top compétitions par revenus</h5>
              <button className="btn btn-sm btn-link">Voir tout</button>
            </div>
            <div className="card-body">
              <div className="competitions-list">
                {financialMetrics.topEarningCompetitions.map(competition => (
                  <div key={competition.id} className="competition-item">
                    <div className="competition-rank">#{competition.id}</div>
                    <div className="competition-info">
                      <h6>{competition.title}</h6>
                      <div className="competition-revenue">
                        {(competition.revenue / 1000000).toFixed(2)}M FCFA
                      </div>
                    </div>
                    <div className="competition-actions">
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="feather-eye"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinancialContent = ({ financialMetrics, systemOverview }) => {
  return (
    <div className="financial-content">
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5>Détails financiers</h5>
              <div className="header-actions">
                <button className="btn btn-primary btn-sm">
                  <i className="feather-download"></i> Exporter rapport
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="financial-details">
                <div className="detail-row">
                  <span className="detail-label">Gains totaux plateforme:</span>
                  <span className="detail-value">{(financialMetrics.totalPlatformEarnings / 1000000).toFixed(2)}M FCFA</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Paiements traités:</span>
                  <span className="detail-value">{(financialMetrics.totalPayouts / 1000000).toFixed(2)}M FCFA</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Paiements en attente:</span>
                  <span className="detail-value text-warning">{(financialMetrics.pendingPayouts / 1000000).toFixed(2)}M FCFA</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Taux de commission:</span>
                  <span className="detail-value">{systemOverview.platformFee}%</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Valeur moyenne transaction:</span>
                  <span className="detail-value">{financialMetrics.averageTransactionValue.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5>Actions financières</h5>
            </div>
            <div className="card-body">
              <div className="action-buttons-vertical">
                <button className="btn btn-primary">
                  <i className="feather-dollar-sign"></i>
                  Générer rapport fiscal
                </button>
                <button className="btn btn-success">
                  <i className="feather-check-circle"></i>
                  Approuver tous les paiements
                </button>
                <button className="btn btn-warning">
                  <i className="feather-settings"></i>
                  Ajuster les commissions
                </button>
                <button className="btn btn-danger">
                  <i className="feather-alert-triangle"></i>
                  Audit financier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SystemContent = ({ systemOverview, systemAlerts, apiUsage, systemHealthChartData, chartOptions }) => {
  return (
    <div className="system-content">
      <div className="row mb-4">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5>Santé système</h5>
            </div>
            <div className="card-body">
              <div className="system-health">
                <div className="health-score">
                  <div className="score-circle">
                    <span className="score-value">{systemOverview.systemHealth}%</span>
                  </div>
                  <div className="score-label">Score de santé</div>
                </div>
                <div className="health-metrics">
                  <div className="metric">
                    <span className="metric-label">Charge CPU:</span>
                    <span className="metric-value">{systemOverview.serverLoad}%</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Temps réponse API:</span>
                    <span className="metric-value">{systemOverview.averageResponseTime}ms</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Taux d'erreur:</span>
                    <span className="metric-value">{systemOverview.errorRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5>Statistiques API</h5>
            </div>
            <div className="card-body">
              <div className="api-stats">
                <div className="api-stat">
                  <div className="stat-value">{apiUsage.totalRequests.toLocaleString()}</div>
                  <div className="stat-label">Requêtes totales</div>
                </div>
                <div className="api-stat">
                  <div className="stat-value">{apiUsage.successRate}%</div>
                  <div className="stat-label">Taux de succès</div>
                </div>
                <div className="api-stat">
                  <div className="stat-value">{apiUsage.averageLatency}ms</div>
                  <div className="stat-label">Latence moyenne</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h5>Endpoints API les plus utilisés</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Endpoint</th>
                      <th>Requêtes</th>
                      <th>Temps moyen</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiUsage.endpoints.map(endpoint => (
                      <tr key={endpoint.name}>
                        <td>
                          <code>{endpoint.name}</code>
                        </td>
                        <td>{endpoint.requests.toLocaleString()}</td>
                        <td>{endpoint.avgTime}ms</td>
                        <td>
                          <span className={`status-badge ${endpoint.avgTime < 100 ? 'success' : 'warning'}`}>
                            {endpoint.avgTime < 100 ? 'Optimal' : 'À surveiller'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminsContent = ({ systemAdmins, onAddAdmin }) => {
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'admin_content',
    permissions: []
  });

  const handleAddAdmin = () => {
    console.log('Ajouter admin:', newAdmin);
    setShowAddAdminModal(false);
  };

  return (
    <div className="admins-content">
      <div className="card">
        <div className="card-header">
          <h5>Administrateurs système</h5>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddAdminModal(true)}>
            <i className="feather-user-plus"></i> Ajouter un admin
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Permissions</th>
                  <th>Dernière activité</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {systemAdmins.map(admin => (
                  <tr key={admin.id}>
                    <td>
                      <div className="admin-info">
                        <div className="admin-avatar">
                          <i className="feather-user"></i>
                        </div>
                        <div>
                          <strong>{admin.name}</strong>
                          <br />
                          <small>ID: #{admin.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>{admin.email}</td>
                    <td>
                      <span className={`role-badge ${admin.role}`}>
                        {admin.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{admin.permissions}</td>
                    <td>{admin.lastActive}</td>
                    <td>
                      <span className={`status-badge ${admin.status}`}>
                        {admin.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="feather-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-warning">
                          <i className="feather-lock"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="feather-trash-2"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddAdminModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h5>Ajouter un nouvel administrateur</h5>
              <button className="close-btn" onClick={() => setShowAddAdminModal(false)}>
                <i className="feather-x"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nom complet</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  className="form-control"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Rôle</label>
                <select 
                  className="form-control"
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                >
                  <option value="admin_content">Admin Contenu</option>
                  <option value="admin_finance">Admin Finance</option>
                  <option value="admin_support">Admin Support</option>
                  <option value="admin_analytics">Admin Analytics</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddAdminModal(false)}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={handleAddAdmin}>
                Ajouter l'administrateur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SecurityContent = ({ systemLogs }) => {
  return (
    <div className="security-content">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h5>Événements de sécurité</h5>
              <button className="btn btn-danger btn-sm">
                <i className="feather-shield"></i> Scanner la sécurité
              </button>
            </div>
            <div className="card-body">
              <div className="security-events">
                {systemLogs.filter(log => log.level === 'danger').map(log => (
                  <div key={log.id} className="security-event">
                    <div className="event-timestamp">{log.timestamp}</div>
                    <div className="event-content">
                      <div className="event-message">{log.action}</div>
                      <div className="event-details">{log.details}</div>
                    </div>
                    <div className="event-level">
                      <span className={`level-badge ${log.level}`}>
                        {log.level.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogsContent = ({ systemLogs }) => {
  const [filterLevel, setFilterLevel] = useState('all');
  
  const filteredLogs = filterLevel === 'all' 
    ? systemLogs 
    : systemLogs.filter(log => log.level === filterLevel);
  
  return (
    <div className="logs-content">
      <div className="card">
        <div className="card-header">
          <h5>Logs système</h5>
          <div className="filter-controls">
            <select 
              className="form-select form-select-sm"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              <option value="all">Tous les niveaux</option>
              <option value="info">Info</option>
              <option value="success">Succès</option>
              <option value="warning">Avertissement</option>
              <option value="danger">Danger</option>
            </select>
            <button className="btn btn-sm btn-outline-primary">
              <i className="feather-download"></i> Exporter logs
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="logs-list">
            {filteredLogs.map(log => (
              <div key={log.id} className={`log-entry log-${log.level}`}>
                <div className="log-timestamp">{log.timestamp}</div>
                <div className="log-user">{log.user}</div>
                <div className="log-action">{log.action}</div>
                <div className="log-details">{log.details}</div>
                <div className="log-level">
                  <span className={`level-badge ${log.level}`}>
                    {log.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ApiContent = ({ apiUsage }) => {
  const [apiKey, setApiKey] = useState('sk_live_klumer_*****');
  
  return (
    <div className="api-content">
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5>Clés API</h5>
              <button className="btn btn-primary btn-sm">
                <i className="feather-plus"></i> Générer nouvelle clé
              </button>
            </div>
            <div className="card-body">
              <div className="api-keys">
                <div className="api-key-item">
                  <div className="key-info">
                    <h6>Clé principale</h6>
                    <code className="api-key">{apiKey}</code>
                    <small>Dernière utilisation: 5 min</small>
                  </div>
                  <div className="key-actions">
                    <button className="btn btn-sm btn-outline-primary">
                      <i className="feather-copy"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="feather-trash-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5>Limites API</h5>
            </div>
            <div className="card-body">
              <div className="api-limits">
                <div className="limit-item">
                  <span className="limit-label">Requêtes par minute:</span>
                  <span className="limit-value">1000</span>
                </div>
                <div className="limit-item">
                  <span className="limit-label">Requêtes par jour:</span>
                  <span className="limit-value">100,000</span>
                </div>
                <div className="limit-item">
                  <span className="limit-label">Taille max payload:</span>
                  <span className="limit-value">10MB</span>
                </div>
                <div className="limit-item">
                  <span className="limit-label">Temps réponse max:</span>
                  <span className="limit-value">30s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsContent = ({ platformSettings, setPlatformSettings }) => {
  const handleSaveSettings = () => {
    console.log('Sauvegarde des paramètres:', platformSettings);
    alert('Paramètres sauvegardés avec succès!');
  };

  const handleResetSettings = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      setPlatformSettings({
        platformFee: 30,
        organizerFee: 70,
        minVoteAmount: 100,
        maxVoteAmount: 10000,
        defaultCurrency: 'FCFA',
        autoApproveCompetitions: false,
        maintenanceMode: false,
        enableEmailNotifications: true,
        enableSMSNotifications: true,
        requireIdentityVerification: false,
        maxDailyWithdrawal: 5000000,
        voteVerificationRequired: true,
        competitionCreationFee: 50000,
        payoutThreshold: 100000
      });
    }
  };

  return (
    <div className="settings-content">
      <div className="card">
        <div className="card-header">
          <h5>Configuration avancée de la plateforme</h5>
          <div className="header-actions">
            <button className="btn btn-danger btn-sm" onClick={handleResetSettings}>
              <i className="feather-refresh-cw"></i> Réinitialiser
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSaveSettings}>
              <i className="feather-save"></i> Sauvegarder
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="settings-grid">
            <div className="setting-group">
              <h6>Frais et commissions</h6>
              <div className="form-group">
                <label>Commission plateforme (%)</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={platformSettings.platformFee}
                  onChange={(e) => setPlatformSettings({...platformSettings, platformFee: parseInt(e.target.value)})}
                  min="0"
                  max="100"
                />
              </div>
              <div className="form-group">
                <label>Commission organisateur (%)</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={platformSettings.organizerFee}
                  onChange={(e) => setPlatformSettings({...platformSettings, organizerFee: parseInt(e.target.value)})}
                  min="0"
                  max="100"
                />
              </div>
              <div className="form-group">
                <label>Frais création compétition (FCFA)</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={platformSettings.competitionCreationFee}
                  onChange={(e) => setPlatformSettings({...platformSettings, competitionCreationFee: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="setting-group">
              <h6>Limites de votes</h6>
              <div className="form-group">
                <label>Montant vote minimum (FCFA)</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={platformSettings.minVoteAmount}
                  onChange={(e) => setPlatformSettings({...platformSettings, minVoteAmount: parseInt(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label>Montant vote maximum (FCFA)</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={platformSettings.maxVoteAmount}
                  onChange={(e) => setPlatformSettings({...platformSettings, maxVoteAmount: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="setting-group">
              <h6>Sécurité et vérification</h6>
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input"
                  checked={platformSettings.voteVerificationRequired}
                  onChange={(e) => setPlatformSettings({...platformSettings, voteVerificationRequired: e.target.checked})}
                />
                <label className="form-check-label">Vérification requise pour les votes</label>
              </div>
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input"
                  checked={platformSettings.requireIdentityVerification}
                  onChange={(e) => setPlatformSettings({...platformSettings, requireIdentityVerification: e.target.checked})}
                />
                <label className="form-check-label">Vérification identité requise</label>
              </div>
            </div>

            <div className="setting-group">
              <h6>Paramètres système</h6>
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input"
                  checked={platformSettings.autoApproveCompetitions}
                  onChange={(e) => setPlatformSettings({...platformSettings, autoApproveCompetitions: e.target.checked})}
                />
                <label className="form-check-label">Approbation automatique des compétitions</label>
              </div>
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input"
                  checked={platformSettings.maintenanceMode}
                  onChange={(e) => setPlatformSettings({...platformSettings, maintenanceMode: e.target.checked})}
                />
                <label className="form-check-label">Mode maintenance</label>
              </div>
            </div>

            <div className="setting-group">
              <h6>Notifications</h6>
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input"
                  checked={platformSettings.enableEmailNotifications}
                  onChange={(e) => setPlatformSettings({...platformSettings, enableEmailNotifications: e.target.checked})}
                />
                <label className="form-check-label">Notifications email</label>
              </div>
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input"
                  checked={platformSettings.enableSMSNotifications}
                  onChange={(e) => setPlatformSettings({...platformSettings, enableSMSNotifications: e.target.checked})}
                />
                <label className="form-check-label">Notifications SMS</label>
              </div>
            </div>

            <div className="setting-group">
              <h6>Limites financières</h6>
              <div className="form-group">
                <label>Retrait maximum quotidien (FCFA)</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={platformSettings.maxDailyWithdrawal}
                  onChange={(e) => setPlatformSettings({...platformSettings, maxDailyWithdrawal: parseInt(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label>Seuil de paiement (FCFA)</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={platformSettings.payoutThreshold}
                  onChange={(e) => setPlatformSettings({...platformSettings, payoutThreshold: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BackupContent = () => {
  return (
    <div className="backup-content">
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5>Sauvegarde système</h5>
            </div>
            <div className="card-body">
              <div className="backup-info">
                <div className="backup-status">
                  <div className="status-indicator success"></div>
                  <span>Dernière sauvegarde: Aujourd'hui 02:00</span>
                </div>
                <div className="backup-actions">
                  <button className="btn btn-primary">
                    <i className="feather-database"></i>
                    Sauvegarde manuelle
                  </button>
                  <button className="btn btn-outline-primary">
                    <i className="feather-download"></i>
                    Télécharger backup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5>Restauration</h5>
            </div>
            <div className="card-body">
              <div className="restore-actions">
                <div className="form-group">
                  <label>Sélectionner un backup</label>
                  <select className="form-control">
                    <option>backup_2024_01_08_020000.zip</option>
                    <option>backup_2024_01_07_020000.zip</option>
                    <option>backup_2024_01_06_020000.zip</option>
                  </select>
                </div>
                <button className="btn btn-danger">
                  <i className="feather-refresh-cw"></i>
                  Restaurer système
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuditContent = () => {
  return (
    <div className="audit-content">
      <div className="card">
        <div className="card-header">
          <h5>Journal d'audit</h5>
          <button className="btn btn-primary btn-sm">
            <i className="feather-file-text"></i> Générer rapport
          </button>
        </div>
        <div className="card-body">
          <div className="audit-log">
            <div className="audit-entry">
              <div className="audit-timestamp">2024-01-08 14:30:22</div>
              <div className="audit-action">Modification paramètres système</div>
              <div className="audit-user">super_admin</div>
              <div className="audit-details">Commission plateforme changée de 25% à 30%</div>
            </div>
            <div className="audit-entry">
              <div className="audit-timestamp">2024-01-08 13:15:10</div>
              <div className="audit-action">Ajout administrateur</div>
              <div className="audit-user">super_admin</div>
              <div className="audit-details">Nouvel admin: marie@klumer.tg</div>
            </div>
            <div className="audit-entry">
              <div className="audit-timestamp">2024-01-08 10:45:33</div>
              <div className="audit-action">Force des paiements</div>
              <div className="audit-user">super_admin</div>
              <div className="audit-details">42 paiements traités manuellement</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;