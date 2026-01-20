import React, { useState } from 'react';
import './EventCard.css';

const EventCard = ({ event }) => {
  const [imgError, setImgError] = useState(false);
  const [imageSrc, setImageSrc] = useState(event.image);

  const handleImageError = () => {
    console.log(`Image non chargée: ${event.image}`);
    
    // Image de fallback basée sur la catégorie
    const fallbackImages = {
      "Talent Show": "/assets/images/portfolio/portfolio-01.jpg",
      "Music": "/assets/images/portfolio/portfolio-02.jpg",
      "Sports": "/assets/images/portfolio/portfolio-03.jpg",
      "Education": "/assets/images/portfolio/portfolio-04.jpg",
      "Business": "/assets/images/portfolio/portfolio-05.jpg",
      "default": "/assets/images/portfolio/portfolio-01.jpg"
    };
    
    const fallback = fallbackImages[event.category] || fallbackImages.default;
    setImageSrc(fallback);
    setImgError(true);
  };

  const calculateDaysLeft = (endDate) => {
    try {
      const end = new Date(endDate);
      const now = new Date();
      const diffTime = end - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      return 0;
    }
  };

  const daysLeft = calculateDaysLeft(event.endDate);

  return (
    <div className="event-card">
      <div className="product-style-one no-overlay with-placeBid">
        <div className="card-thumbnail">
          <a href={`/event/${event.id}`}>
            <img 
              src={imageSrc} 
              alt={event.title}
              onError={handleImageError}
              loading="lazy"
              className="img-fluid"
            />
          </a>
          <div className="card-thumbnail-overlay">
            <a href={`/event/${event.id}`} className="btn btn-primary btn-sm">
              <i className="feather-eye me-1"></i> Voir détails
            </a>
          </div>
          {daysLeft > 0 && event.status === 'active' && (
            <div className="days-left-badge">
              <i className="feather-clock me-1"></i> {daysLeft} jours
            </div>
          )}
        </div>
        
        <div className="card-body">
          <a href={`/event/${event.id}`} className="text-decoration-none">
            <h5 className="card-title">{event.title}</h5>
          </a>
          
          <div className="card-meta mb-2">
            <span className="badge bg-light text-dark">
              <i className="feather-tag me-1"></i> {event.category}
            </span>
            <span className={`badge ${event.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
              {event.status === 'active' ? 'Actif' : 'Terminé'}
            </span>
          </div>
          
          <p className="card-text small text-muted">
            {event.description && event.description.length > 100 
              ? `${event.description.substring(0, 100)}...` 
              : event.description || "Aucune description disponible"}
          </p>
          
          <div className="card-stats d-flex justify-content-between align-items-center mt-3">
            <div className="participants">
              <i className="feather-users text-primary"></i>
              <span className="ms-1">{event.participants.toLocaleString()}</span>
            </div>
            <a href={`/event/${event.id}`} className="btn btn-outline-primary btn-sm">
              Voter maintenant
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;