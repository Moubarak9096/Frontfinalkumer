import React from 'react';
// import './Footer.css';

const Footer = () => {
  const paymentMethods = [
    { name: 'MixByYas', img: '/assets/images/payments/mixbyyas.jpg', speed: '3s' },
    { name: 'MoovMoney', img: '/assets/images/payments/moovmoney.png', speed: '4s' },
    { name: 'MTN', img: '/assets/images/payments/mtn.png', speed: '5s' },
    { name: 'Orange', img: '/assets/images/payments/orange.png', speed: '3.5s' },
    { name: 'Visa', img: '/assets/images/payments/visa.png', speed: '4.5s' },
    { name: 'PayPal', img: '/assets/images/payments/paypal.png', speed: '6s' },
    { name: 'Mastercard', img: '/assets/images/payments/mastercard.png', speed: '5.5s' }
  ];

  return (
    <>
      <div className="rn-footer-one rn-section-gap bg-color--1 mt--100 mt_md--80 mt_sm--80">
        <div className="container">
          <div className="row gx-5">
            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="footer-left">
                <div className="logo-thumbnail logo-custom-css mb-3">
                  <a className="logo-light" href="/">
                    <img src="/assets/images/logo/Klumer-logo-neutre.png" alt="Klumer Vote" />
                  </a>
                </div>
                <p className="rn-footer-describe mb-4">
                Simplifiez vos votes
en ligne en un clic !
                </p>
                
                {/* Section des moyens de paiement */}
                <div className="payment-methods mt-4 pt-3 border-top border-white-10">
                  <h6 className="widget-title mb-3 text-white"> </h6>
                  <div className="d-flex flex-wrap align-items-center justify-content-center gap-4 py-3">
                    {paymentMethods.map((method, index) => (
                      <div 
                        key={index} 
                        className="payment-logo-wrapper"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={method.name}
                      >
                        <div className="payment-logo-inner">
                          <img 
                            src={method.img} 
                            alt={method.name} 
                            className="payment-logo-img rotating-logo"
                            style={{ 
                              height: '45px',
                              animationDuration: method.speed
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/assets/images/payments/default-payment.png';
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Indicateur de sécurité */}
                  <div className="security-badge mt-3 text-center">
                 
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="footer-widget">
                <h6 className="widget-title">Liens rapides</h6>
                <ul className="footer-list-one">
                  <li><a href="/competitions">Événements</a></li>
                  <li><a href="/results">Résultats</a></li>
                  <li><a href="/about">À propos</a></li>
                  <li><a href="/contact">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="copy-right-one ptb--20 bg-color--1">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12">
              <div className="copyright-left">
                <span>© 2025 Klumer Togo. Tous droits réservés.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Animation de rotation complète et continue */
        @keyframes fullRotation {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
          @keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
        
        /* Styles pour les logos */
        .payment-logo-wrapper {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .payment-logo-inner {
          background: transparent;
          border-radius: 12px;
          padding: 5px;
          transition: all 0.3s ease;
          perspective: 1000px;
        }
        
        .rotating-logo {
          animation: fullRotation infinite linear;
          transform-style: preserve-3d;
          backface-visibility: visible;
        }
        
        /* Effets au survol */
        .payment-logo-wrapper:hover .rotating-logo {
          animation-play-state: paused;
          filter: brightness(1.3) drop-shadow(0 0 8px rgba(221, 27, 68, 0.5));
        }
        
        .payment-logo-wrapper:hover .payment-logo-inner {
          transform: scale(1.15);
        }
        
        /* Effet d'ombre portée pendant la rotation */
        .rotating-logo {
          box-shadow: 
            0 0 0 1px rgba(255, 255, 255, 0.1),
            0 0 10px rgba(255, 255, 255, 0.05);
        }
        
        /* Responsive */
        @media (max-width: 992px) {
          .rotating-logo {
            height: 40px !important;
          }
          
          .gap-4 {
            gap: 1rem !important;
          }
        }
        
        @media (max-width: 768px) {
          .rotating-logo {
            height: 35px !important;
          }
          
          .gap-4 {
            gap: 0.75rem !important;
          }
          
          .payment-logo-inner {
            padding: 4px;
          }
        }
        
        @media (max-width: 576px) {
          .rotating-logo {
            height: 30px !important;
          }
          
          .gap-4 {
            gap: 0.5rem !important;
          }
          
          .payment-logo-inner {
            padding: 3px;
          }
          
          .security-badge .badge {
            font-size: 0.8rem;
            padding: 4px 12px;
          }
        }
        
        /* Ajustement pour les très petits écrans */
        @media (max-width: 400px) {
          .rotating-logo {
            height: 25px !important;
          }
          
          .d-flex {
            gap: 0.4rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;