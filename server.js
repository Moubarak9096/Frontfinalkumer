const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'klumer_admin_secret_key_2024';

// Middleware
app.use(cors());
app.use(express.json());

// Routes d'authentification
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Tentative de connexion:', { username, password });

    // Vérification des identifiants
    if (username === 'klumer' && password === 'klumermembre') {
      const token = jwt.sign(
        { username: 'klumer', role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        token,
        user: { username: 'klumer', role: 'admin' }
      });
    }

    res.status(401).json({
      success: false,
      message: 'Nom d\'utilisateur ou mot de passe incorrect'
    });

  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token requis' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Route protégée pour vérifier le token
app.get('/api/admin/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Routes protégées de l'admin
app.get('/api/admin/stats', authenticateToken, (req, res) => {
  res.json({
    totalEvents: 15,
    totalVotes: 23500,
    totalUsers: 50000,
    totalAgencies: 8
  });
});

app.get('/api/admin/events', authenticateToken, (req, res) => {
  const events = [
    {
      id: 1,
      title: "Élection Présidentielle Togo 2024",
      category: "Politique",
      createdBy: "Gouvernement Togolais",
      participants: 15000,
      endDate: "2024-12-31",
      status: "active"
    },
    {
      id: 2,
      title: "Concours Meilleur Artiste Togolais",
      category: "Culture", 
      createdBy: "Ministère de la Culture",
      participants: 8500,
      endDate: "2024-11-15",
      status: "active"
    }
  ];
  res.json(events);
});

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend Klumer fonctionne!' });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur backend Klumer démarré sur le port ${PORT}`);
  console.log(`🔐 Identifiants admin: klumer / klumermembre`);
  console.log(`🌐 URL admin: http://localhost:${PORT}/api/admin/login`);
});