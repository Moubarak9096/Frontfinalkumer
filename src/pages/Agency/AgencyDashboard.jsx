// Fichier: src/pages/Agency/AgencyDashboard.jsx
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const AgencyDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalVotes: 0,
    totalParticipants: 0
  });

  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        title: "Élection Présidentielle Togo 2024",
        status: 'active',
        participants: 15000,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        candidates: 5
      }
    ];

    setEvents(mockEvents);
    setStats({
      totalEvents: 12,
      activeEvents: 3,
      totalVotes: 45000,
      totalParticipants: 25000
    });
  }, []);

  return (
    <div className="template-color-1">
      <Header />
      
      <div className="rn-breadcrumb-inner ptb--30">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <h5 className="title text-center text-md-start">Dashboard Agence</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="rn-section-gapTop">
        <div className="container">
          
          {/* Statistiques */}
          <div className="row g-4 mb-5">
            <div className="col-lg-3 col-md-6">
              <div className="stat-card text-center p-4 border rounded">
                <h3 className="text-primary mb-2">{stats.totalEvents}</h3>
                <p className="text-muted mb-0">Événements totaux</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stat-card text-center p-4 border rounded">
                <h3 className="text-success mb-2">{stats.activeEvents}</h3>
                <p className="text-muted mb-0">Événements actifs</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stat-card text-center p-4 border rounded">
                <h3 className="text-info mb-2">{stats.totalVotes.toLocaleString()}</h3>
                <p className="text-muted mb-0">Votes totaux</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stat-card text-center p-4 border rounded">
                <h3 className="text-warning mb-2">{stats.totalParticipants.toLocaleString()}</h3>
                <p className="text-muted mb-0">Participants</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="agency-tabs">
                <button 
                  className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab('events')}
                >
                  Mes Événements
                </button>
                <button 
                  className={`btn ${activeTab === 'create' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab('create')}
                >
                  Créer un Événement
                </button>
                <button 
                  className={`btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab('analytics')}
                >
                  Analytics
                </button>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div className="row">
            <div className="col-12">
              {activeTab === 'events' && (
                <div className="events-list">
                  <h4 className="mb-4">Mes Événements</h4>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Titre</th>
                          <th>Statut</th>
                          <th>Participants</th>
                          <th>Date de fin</th>
                          <th>Candidats</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map(event => (
                          <tr key={event.id}>
                            <td>{event.title}</td>
                            <td>
                              <span className={`badge ${event.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                                {event.status === 'active' ? 'Actif' : 'Terminé'}
                              </span>
                            </td>
                            <td>{event.participants.toLocaleString()}</td>
                            <td>{new Date(event.endDate).toLocaleDateString('fr-FR')}</td>
                            <td>{event.candidates}</td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-2">
                                Voir
                              </button>
                              <button className="btn btn-sm btn-outline-danger">
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'create' && (
                <div className="create-event">
                  <h4 className="mb-4">Créer un Nouvel Événement</h4>
                  <div className="text-center py-5">
                    <p>Créez un nouvel événement de vote</p>
                    <a href="/create-event" className="btn btn-primary">
                      Créer un Événement
                    </a>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="analytics">
                  <h4 className="mb-4">Analytics</h4>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">Performance des événements</h5>
                          {/* Graphiques à implémenter */}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">Statistiques des votes</h5>
                          {/* Graphiques à implémenter */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AgencyDashboard;