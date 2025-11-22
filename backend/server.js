const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');

const app = express();

// Connexion à la base de données
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statics
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/events', require('./Routes/events'));
app.use('/api/agencies', require('./Routes/agencies'));
app.use('/api/users', require('./Routes/users'));
app.use('/api/admin', require('./Routes/admin'));

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'API Klumer fonctionne!',
    timestamp: new Date().toISOString()
  });
});

// Route pour servir les images
app.get('/api/images/:folder/:filename', (req, res) => {
  const { folder, filename } = req.params;
  res.sendFile(path.join(__dirname, 'uploads', folder, filename));
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  
  // Erreur Multer (fichiers)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Fichier trop volumineux. Taille maximale: 5MB'
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Type de fichier non autorisé'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API disponible: http://localhost:${PORT}/api`);
});