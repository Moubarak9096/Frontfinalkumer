import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import EventCard from "../../components/EventCard/EventCard";

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const response = await axios.get(
        "https://api-klumer-node-votings-dev.onrender.com/competitions"
      );

      console.log("Données API:", response.data);

      // ✅ Adapter les données API au format EventCard
      const formatted = response.data.map((c) => {
        // Gestion des images
        let imageUrl;
        
        if (c.coverImageUrl) {
          imageUrl = c.coverImageUrl.startsWith('http') 
            ? c.coverImageUrl 
            : `https://api-klumer-node-votings-dev.onrender.com${c.coverImageUrl}`;
        } 
        else if (c.category?.iconUrl) {
          imageUrl = c.category.iconUrl.startsWith('http')
            ? c.category.iconUrl
            : `https://api-klumer-node-votings-dev.onrender.com${c.category.iconUrl}`;
        }
        else {
          // Image par défaut basée sur la catégorie
          const defaultImages = {
            "Talent Show": "/assets/images/portfolio/portfolio-01.jpg",
            "Music": "/assets/images/portfolio/portfolio-02.jpg",
            "Sports": "/assets/images/portfolio/portfolio-03.jpg",
            "Education": "/assets/images/portfolio/portfolio-04.jpg",
            "Business": "/assets/images/portfolio/portfolio-05.jpg",
            "default": "/assets/images/portfolio/portfolio-01.jpg"
          };
          
          const categoryName = c.category?.name || "default";
          imageUrl = defaultImages[categoryName] || defaultImages.default;
        }

        return {
          id: c.id,
          title: c.title || "Sans titre",
          description: c.description || "Aucune description disponible",
          image: imageUrl,
          endDate: c.endDate || "Non spécifiée",
          participants: c.totalParticipants || 0,
          category: c.category?.name || "Non catégorisé",
          status: c.status === "active" || c.status === "published" ? "active" : "inactive",
        };
      });

      console.log("Données formatées:", formatted);
      setCompetitions(formatted);
    } catch (error) {
      console.error("Erreur lors du chargement des compétitions :", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les compétitions par catégorie
  const filteredCompetitions = selectedCategory
    ? competitions.filter(comp => comp.category === selectedCategory)
    : competitions;

  // Trier les compétitions
  const sortedCompetitions = [...filteredCompetitions].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.endDate) - new Date(a.endDate);
    } else if (sortBy === 'participants') {
      return b.participants - a.participants;
    } else if (sortBy === 'popular') {
      return b.participants - a.participants;
    }
    return 0;
  });

  // Extraire les catégories uniques pour le filtre
  const categories = [...new Set(competitions.map(comp => comp.category))].filter(Boolean);

  return (
    <div className="template-color-1 with-particles">
      <Header />

      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title-wrapper text-center mb-5">
              <h3 className="title text-white mb-4">Compétitions en cours</h3>
              <p className="text-white-50 mb-0">Découvrez toutes les compétitions disponibles et votez pour vos favoris</p>
            </div>
          </div>
        </div>

        {/* Filtres et tris - Comme sur la page principale */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <div className="filter-section">
              <label className="text-white mb-2 d-block">Filtrer par catégorie</label>
              <div className="d-flex flex-wrap gap-2">
                <button 
                  className={`btn btn-sm ${selectedCategory === '' ? 'btn-primary' : 'btn-outline-light'}`}
                  onClick={() => setSelectedCategory('')}
                >
                  Toutes
                </button>
                {categories.map(category => (
                  <button 
                    key={category}
                    className={`btn btn-sm ${selectedCategory === category ? 'btn-primary' : 'btn-outline-light'}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="col-md-6 mb-3">
            <div className="sort-section">
              <label className="text-white mb-2 d-block">Trier par</label>
              <select 
                className="form-select bg-dark text-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Les plus récents</option>
                <option value="popular">Les plus populaires</option>
                <option value="participants">Participants</option>
              </select>
            </div>
          </div>
        </div>

        {/* Affichage des compétitions - 3 cartes par ligne */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
            <p className="mt-3 text-white">Chargement des compétitions...</p>
          </div>
        ) : sortedCompetitions.length === 0 ? (
          <div className="text-center py-5">
            <div className="alert alert-info">
              <i className="feather-calendar me-2"></i>
              Aucune compétition disponible {selectedCategory && `dans la catégorie "${selectedCategory}"`}
            </div>
            {selectedCategory && (
              <button 
                className="btn btn-primary mt-3"
                onClick={() => setSelectedCategory('')}
              >
                Voir toutes les compétitions
              </button>
            )}
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {sortedCompetitions.map((competition) => (
              <EventCard key={competition.id} event={competition} />
            ))}
          </div>
        )}

        {/* Pagination ou indicateur de nombre */}
        {!loading && sortedCompetitions.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <div className="text-center text-white">
                <p>
                  <i className="feather-info me-2"></i>
                  Affichage de {sortedCompetitions.length} compétition{sortedCompetitions.length > 1 ? 's' : ''}
                  {selectedCategory && ` dans la catégorie "${selectedCategory}"`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}