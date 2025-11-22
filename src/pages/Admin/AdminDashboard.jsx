// Fichier: src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AdminLogin from './AdminLogin';
import './AdminLogin.css';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filters, setFilters] = useState({
    dateRange: 'today',
    category: 'all',
    status: 'all'
  });
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalVotes: 0,
    totalUsers: 0,
    totalAgencies: 0,
    activeEvents: 0,
    pendingEvents: 0,
    todayEvents: 0,
    weekEvents: 0,
    monthEvents: 0
  });

  const checkAuthentication = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUser(data.user);
        loadDashboardData();
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      console.error('Erreur de vérification:', error);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Charger les statistiques
      const statsResponse = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      // Charger les événements
      const eventsResponse = await fetch('http://localhost:5000/api/admin/events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.events);
      }

      // Charger les agences
      const agenciesResponse = await fetch('http://localhost:5000/api/admin/agencies', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (agenciesResponse.ok) {
        const agenciesData = await agenciesResponse.json();
        setAgencies(agenciesData.agencies);
      }

      // Charger les utilisateurs
      const usersResponse = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      }

    } catch (error) {
      console.error('Erreur chargement données:', error);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    loadDashboardData();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Filtrer les événements
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.createdAt);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    if (filters.dateRange === 'today' && eventDate < today) return false;
    if (filters.dateRange === 'week' && eventDate < weekAgo) return false;
    if (filters.dateRange === 'month' && eventDate < monthAgo) return false;
    if (filters.category !== 'all' && event.category !== filters.category) return false;
    if (filters.status !== 'all' && event.status !== filters.status) return false;

    return true;
  });

  const deleteEvent = async (eventId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`http://localhost:5000/api/admin/events/${eventId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setEvents(events.filter(event => event.id !== eventId));
        }
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const deleteAgency = async (agencyId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette agence ?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`http://localhost:5000/api/admin/agencies/${agencyId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setAgencies(agencies.filter(agency => agency.id !== agencyId));
        }
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const toggleEventStatus = async (eventId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const event = events.find(e => e.id === eventId);
      const newStatus = event.status === 'active' ? 'inactive' : 'active';
      
      const response = await fetch(`http://localhost:5000/api/admin/events/${eventId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setEvents(events.map(event => 
          event.id === eventId 
            ? { ...event, status: newStatus }
            : event
        ));
      }
    } catch (error) {
      console.error('Erreur changement statut:', error);
    }
  };

  const toggleAgencyStatus = async (agencyId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const agency = agencies.find(a => a.id === agencyId);
      const newStatus = agency.status === 'active' ? 'inactive' : 'active';
      
      const response = await fetch(`http://localhost:5000/api/admin/agencies/${agencyId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setAgencies(agencies.map(agency => 
          agency.id === agencyId 
            ? { ...agency, status: newStatus }
            : agency
        ));
      }
    } catch (error) {
      console.error('Erreur changement statut:', error);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="text-center text-white">
          <div className="spinner-border mb-3" role="status"></div>
          <p>Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="template-color-1">
      <Header />
      
      {/* Barre d'admin */}
      <div className="admin-bar bg-primary text-white py-2">
        <div className="container">
          <div className="row align-items-center">
            <div className="col">
              <small>
                <i className="feather-user me-1"></i>
                Connecté en tant que <strong>{user?.username}</strong> 
                <span className="badge bg-light text-dark ms-2">{user?.role}</span>
              </small>
            </div>
            <div className="col-auto">
              <button 
                onClick={handleLogout}
                className="btn btn-sm btn-light"
              >
                <i className="feather-log-out me-1"></i>
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rn-section-gapTop">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="title text-center mb-5">
                <i className="feather-settings me-3"></i>
                Tableau de Bord Administrateur
                <small className="d-block text-muted mt-2">
                  Gestion complète de la plateforme Klumer
                </small>
              </h1>
            </div>
          </div>

          {/* Navigation par onglets */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="admin-tabs">
                <button 
                  className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <i className="feather-home me-2"></i>
                  Tableau de bord
                </button>
                <button 
                  className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab('events')}
                >
                  <i className="feather-calendar me-2"></i>
                  Événements ({events.length})
                </button>
                <button 
                  className={`btn ${activeTab === 'agencies' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab('agencies')}
                >
                  <i className="feather-users me-2"></i>
                  Agences ({agencies.length})
                </button>
                <button 
                  className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab('users')}
                >
                  <i className="feather-user me-2"></i>
                  Utilisateurs ({users.length})
                </button>
              </div>
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="row">
            <div className="col-12">
              {activeTab === 'dashboard' && <DashboardTab stats={stats} events={events} agencies={agencies} />}
              {activeTab === 'events' && <EventsTab events={filteredEvents} filters={filters} onFilterChange={handleFilterChange} onToggleStatus={toggleEventStatus} onDelete={deleteEvent} />}
              {activeTab === 'agencies' && <AgenciesTab agencies={agencies} onToggleStatus={toggleAgencyStatus} onDelete={deleteAgency} />}
              {activeTab === 'users' && <UsersTab users={users} />}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Composants pour chaque onglet
const DashboardTab = ({ stats, events, agencies }) => (
  <div className="admin-content">
    <h3 className="mb-4">
      <i className="feather-activity me-2"></i>
      Aperçu général
    </h3>
    
    {/* Statistiques détaillées */}
    <div className="row g-4 mb-5">
      <div className="col-lg-2 col-md-4 col-sm-6">
        <div className="stat-card text-center p-3 border rounded">
          <h3 className="text-primary mb-1">{stats.totalEvents}</h3>
          <small className="text-muted">Événements totaux</small>
        </div>
      </div>
      <div className="col-lg-2 col-md-4 col-sm-6">
        <div className="stat-card text-center p-3 border rounded">
          <h3 className="text-success mb-1">{stats.totalVotes?.toLocaleString()}</h3>
          <small className="text-muted">Votes totaux</small>
        </div>
      </div>
      <div className="col-lg-2 col-md-4 col-sm-6">
        <div className="stat-card text-center p-3 border rounded">
          <h3 className="text-info mb-1">{stats.totalUsers?.toLocaleString()}</h3>
          <small className="text-muted">Utilisateurs</small>
        </div>
      </div>
      <div className="col-lg-2 col-md-4 col-sm-6">
        <div className="stat-card text-center p-3 border rounded">
          <h3 className="text-warning mb-1">{stats.totalAgencies}</h3>
          <small className="text-muted">Agences</small>
        </div>
      </div>
      <div className="col-lg-2 col-md-4 col-sm-6">
        <div className="stat-card text-center p-3 border rounded">
          <h3 className="text-success mb-1">{stats.activeEvents}</h3>
          <small className="text-muted">Événements actifs</small>
        </div>
      </div>
      <div className="col-lg-2 col-md-4 col-sm-6">
        <div className="stat-card text-center p-3 border rounded">
          <h3 className="text-secondary mb-1">{stats.pendingEvents}</h3>
          <small className="text-muted">En attente</small>
        </div>
      </div>
    </div>

    {/* Statistiques temporelles */}
    <div className="row g-4 mb-5">
      <div className="col-lg-3 col-md-6">
        <div className="stat-card text-center p-3 border rounded">
          <h4 className="text-primary mb-1">{stats.todayEvents}</h4>
          <small className="text-muted">Aujourd'hui</small>
        </div>
      </div>
      <div className="col-lg-3 col-md-6">
        <div className="stat-card text-center p-3 border rounded">
          <h4 className="text-success mb-1">{stats.weekEvents}</h4>
          <small className="text-muted">Cette semaine</small>
        </div>
      </div>
      <div className="col-lg-3 col-md-6">
        <div className="stat-card text-center p-3 border rounded">
          <h4 className="text-info mb-1">{stats.monthEvents}</h4>
          <small className="text-muted">Ce mois</small>
        </div>
      </div>
      <div className="col-lg-3 col-md-6">
        <div className="stat-card text-center p-3 border rounded">
          <h4 className="text-warning mb-1">{stats.totalEvents}</h4>
          <small className="text-muted">Cette année</small>
        </div>
      </div>
    </div>

    {/* Derniers événements et agences */}
    <div className="row">
      <div className="col-lg-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">
              <i className="feather-calendar me-2"></i>
              Derniers événements créés
            </h5>
          </div>
          <div className="card-body">
            {events.slice(0, 5).map(event => (
              <div key={event.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                  <h6 className="mb-1">{event.title}</h6>
                  <small className="text-muted">{event.category} • {event.participants} participants</small>
                </div>
                <span className={`badge ${event.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                  {event.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="col-lg-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">
              <i className="feather-users me-2"></i>
              Agences récentes
            </h5>
          </div>
          <div className="card-body">
            {agencies.slice(0, 5).map(agency => (
              <div key={agency.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                  <h6 className="mb-1">{agency.name}</h6>
                  <small className="text-muted">{agency.eventsCreated} événements</small>
                </div>
                <span className={`badge ${agency.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                  {agency.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EventsTab = ({ events, filters, onFilterChange, onToggleStatus, onDelete }) => (
  <div className="admin-content">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h3 className="mb-0">
        <i className="feather-calendar me-2"></i>
        Gestion des Événements
      </h3>
      <span className="badge bg-secondary">{events.length} événements</span>
    </div>

    {/* Filtres */}
    <div className="row mb-4">
      <div className="col-md-4">
        <label className="form-label">Période</label>
        <select 
          className="form-select"
          value={filters.dateRange}
          onChange={(e) => onFilterChange('dateRange', e.target.value)}
        >
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="all">Tous</option>
        </select>
      </div>
      <div className="col-md-4">
        <label className="form-label">Catégorie</label>
        <select 
          className="form-select"
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <option value="all">Toutes catégories</option>
          <option value="politique">Politique</option>
          <option value="culture">Culture</option>
          <option value="sport">Sport</option>
          <option value="education">Éducation</option>
          <option value="innovation">Innovation</option>
        </select>
      </div>
      <div className="col-md-4">
        <label className="form-label">Statut</label>
        <select 
          className="form-select"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
          <option value="pending">En attente</option>
        </select>
      </div>
    </div>

    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Titre</th>
            <th>Catégorie</th>
            <th>Créé par</th>
            <th>Participants</th>
            <th>Date de création</th>
            <th>Date de fin</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td>
                <strong>{event.title}</strong>
                <br />
                <small className="text-muted">{event.description}</small>
              </td>
              <td>
                <span className="badge bg-info">{event.category}</span>
              </td>
              <td>{event.createdBy}</td>
              <td>
                <span className="fw-bold">{event.participants?.toLocaleString()}</span>
              </td>
              <td>{new Date(event.createdAt).toLocaleDateString('fr-FR')}</td>
              <td>{new Date(event.endDate).toLocaleDateString('fr-FR')}</td>
              <td>
                <span className={`badge ${event.status === 'active' ? 'bg-success' : event.status === 'pending' ? 'bg-warning' : 'bg-secondary'}`}>
                  {event.status === 'active' ? 'Actif' : event.status === 'pending' ? 'En attente' : 'Inactif'}
                </span>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => onToggleStatus(event.id)}
                    title={event.status === 'active' ? 'Désactiver' : 'Activer'}
                  >
                    <i className={`feather-${event.status === 'active' ? 'pause' : 'play'}`}></i>
                  </button>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={() => onDelete(event.id)}
                    title="Supprimer"
                  >
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
);

const AgenciesTab = ({ agencies, onToggleStatus, onDelete }) => (
  <div className="admin-content">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h3 className="mb-0">
        <i className="feather-users me-2"></i>
        Gestion des Agences
      </h3>
      <span className="badge bg-secondary">{agencies.length} agences</span>
    </div>

    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Nom</th>
            <th>Contact</th>
            <th>Événements créés</th>
            <th>Participants totaux</th>
            <th>Date d'inscription</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agencies.map(agency => (
            <tr key={agency.id}>
              <td>
                <strong>{agency.name}</strong>
                <br />
                <small className="text-muted">{agency.address}</small>
              </td>
              <td>
                <div>
                  <small>{agency.email}</small>
                  <br />
                  <small>{agency.phone}</small>
                </div>
              </td>
              <td>
                <span className="fw-bold">{agency.eventsCreated}</span>
              </td>
              <td>
                <span className="fw-bold text-primary">{agency.totalParticipants?.toLocaleString()}</span>
              </td>
              <td>
                {new Date(agency.createdAt).toLocaleDateString('fr-FR')}
              </td>
              <td>
                <span className={`badge ${agency.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                  {agency.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => onToggleStatus(agency.id)}
                    title={agency.status === 'active' ? 'Désactiver' : 'Activer'}
                  >
                    <i className={`feather-${agency.status === 'active' ? 'pause' : 'play'}`}></i>
                  </button>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={() => onDelete(agency.id)}
                    title="Supprimer"
                  >
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
);

const UsersTab = ({ users }) => (
  <div className="admin-content">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h3 className="mb-0">
        <i className="feather-user me-2"></i>
        Gestion des Utilisateurs
      </h3>
      <span className="badge bg-secondary">{users.length} utilisateurs</span>
    </div>

    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Type</th>
            <th>Date d'inscription</th>
            <th>Votes</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <strong>{user.firstName} {user.lastName}</strong>
              </td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <span className={`badge ${user.userType === 'agency' ? 'bg-warning' : 'bg-info'}`}>
                  {user.userType === 'agency' ? 'Agence' : 'Électeur'}
                </span>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
              <td>
                <span className="fw-bold">{user.votesCount}</span>
              </td>
              <td>
                <span className={`badge ${user.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                  {user.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminDashboard;