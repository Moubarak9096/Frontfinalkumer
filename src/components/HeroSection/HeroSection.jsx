import React from 'react';

const HeroSection = () => {
  return (
    <div className="slider-style-5 rn-section-gapTop">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6 order-2 order-lg-1 mt_md--30 mt_sm--30">
            <div className="banner-left-content">
              <span className="title-badge">Plateforme de Vote Klumer</span>
              <h2 className="title">
                Découvrez les meilleurs <br />
                Événements sur notre plateforme
              </h2>
              <p className="banner-disc-one">
                Klumer révolutionne le processus de vote démocratique.
              </p>
              <div className="button-group">
                <a className="btn btn-large btn-primary" href="/create-event">
                  Créer un Événement
                </a>
                <a className="btn btn-large btn-primary-alta" href="/#events">
                  Voir les Événements
                </a>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6 order-1 order-lg-2">
            <div className="row g-5">
              <div className="col-lg-6 col-md-6">
                <div className="single-slide-product">
                  <div className="product-style-one">
                    <div className="card-thumbnail">
                      <a href="/create-event">
                        <img src="/assets/images/portfolio/portfolio-01.jpg" alt="Créer Événement" />
                      </a>
                    </div>
                    <a href="/create-event">
                      <span className="product-name">Créer un Vote</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-6 col-md-6">
                <div className="single-slide-product">
                  <div className="product-style-one">
                    <div className="card-thumbnail">
                      <a href="/#events">
                        <img src="/assets/images/portfolio/portfolio-02.jpg" alt="Voter" />
                      </a>
                    </div>
                    <a href="/#events">
                      <span className="product-name">Participer aux Votes</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;