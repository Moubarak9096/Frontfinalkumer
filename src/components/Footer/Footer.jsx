import React from 'react';
// import './Footer.css';

const Footer = () => {
  return (
    <>
      <div className="rn-footer-one rn-section-gap bg-color--1 mt--100 mt_md--80 mt_sm--80">
        <div className="container">
          <div className="row gx-5">
            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="footer-left">
                <div className="logo-thumbnail logo-custom-css">
                  <a className="logo-light" href="/">
                    <img src="/assets/images/logo/logo-white.png" alt="Klumer Vote" />
                  </a>
                </div>
                <p className="rn-footer-describe">
                  Plateforme de vote démocratique et transparente pour le Togo.
                </p>
              </div>
            </div>
            
            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="footer-widget">
                <h6 className="widget-title">Liens rapides</h6>
                <ul className="footer-list-one">
                  <li><a href="/about">À propos</a></li>
                  <li><a href="/contact">Contact</a></li>
                  <li><a href="/privacy">Confidentialité</a></li>
                  <li><a href="/terms">Conditions</a></li>
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
                <span>© 2024 Klumer Togo. Tous droits réservés.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;