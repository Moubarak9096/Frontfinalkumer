import React from 'react';
// import './EventCard.css';

const EventCard = ({ event }) => {
  const calculateDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="col-5 col-lg-4 col-md-6 col-sm-6 col-12">
      <div className="product-style-one no-overlay with-placeBid">
        <div className="card-thumbnail">
          <a href={`/event/${event.id}`}>
            <img src={event.image} alt={event.title} />
          </a>
          <a href={`/event/${event.id}`} className="btn btn-primary">
            Voter Maintenant
          </a>
        </div>
        
        <a href={`/event/${event.id}`}>
          <span className="product-name">{event.title}</span>
        </a>
        <span className="latest-bid">{event.category}</span>
        
        <div className="bid-react-area">
          <div className="last-bid">{event.participants.toLocaleString()} participants</div>
          <div className="react-area">
            <span className="number">{event.status === 'active' ? 'Actif' : 'Terminé'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;