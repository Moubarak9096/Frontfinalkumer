// backend/controllers/adminController.js
const User = require('../Models/User');
const Event = require('../Models/Event');
const Agency = require('../Models/Agency');
const Vote = require('../Models/Vote');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');

// Compte admin par défaut
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants administrateur incorrects'
      });
    }

    const token = jwt.sign(
      { userId: 'admin', username: ADMIN_CREDENTIALS.username, role: 'admin' },
      process.env.JWT_SECRET || 'klumer_secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Connexion admin réussie',
      token,
      user: {
        username: ADMIN_CREDENTIALS.username,
        role: 'admin'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion admin',
      error: error.message
    });
  }
};

exports.verifyAdmin = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        username: 'admin',
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur de vérification',
      error: error.message
    });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalVotes = await Vote.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalAgencies = await Agency.countDocuments();
    const activeEvents = await Event.countDocuments({ status: 'active' });
    const pendingEvents = await Event.countDocuments({ status: 'pending' });

    // Statistiques temporelles
    const today = moment().startOf('day');
    const weekAgo = moment().subtract(7, 'days').startOf('day');
    const monthAgo = moment().subtract(30, 'days').startOf('day');

    const todayEvents = await Event.countDocuments({
      createdAt: { $gte: today.toDate() }
    });

    const weekEvents = await Event.countDocuments({
      createdAt: { $gte: weekAgo.toDate() }
    });

    const monthEvents = await Event.countDocuments({
      createdAt: { $gte: monthAgo.toDate() }
    });

    res.json({
      success: true,
      stats: {
        totalEvents,
        totalVotes,
        totalUsers,
        totalAgencies,
        activeEvents,
        pendingEvents,
        todayEvents,
        weekEvents,
        monthEvents
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('agencyId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      events: events.map(event => ({
        id: event._id,
        title: event.title,
        description: event.description,
        category: event.category,
        createdBy: event.createdBy,
        participants: event.participants,
        createdAt: event.createdAt,
        endDate: event.endDate,
        status: event.status
      }))
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements',
      error: error.message
    });
  }
};

exports.getAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find()
      .populate('userId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      agencies: agencies.map(agency => ({
        id: agency._id,
        name: agency.name,
        email: agency.email,
        phone: agency.phone,
        address: agency.address,
        eventsCreated: agency.eventsCreated,
        totalParticipants: agency.totalParticipants,
        createdAt: agency.createdAt,
        status: agency.status
      }))
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des agences',
      error: error.message
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    // Compter les votes par utilisateur
    const usersWithVotes = await Promise.all(
      users.map(async (user) => {
        const votesCount = await Vote.countDocuments({ userId: user._id });
        return {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          userType: user.userType,
          createdAt: user.createdAt,
          status: user.status,
          votesCount
        };
      })
    );

    res.json({
      success: true,
      users: usersWithVotes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message
    });
  }
};

exports.updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Statut de l\'événement mis à jour',
      event
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
};

exports.updateAgencyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const agency = await Agency.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: 'Agence non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Statut de l\'agence mis à jour',
      agency
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    // Supprimer les candidats associés
    await Candidate.deleteMany({ eventId: req.params.id });

    // Supprimer les votes associés
    await Vote.deleteMany({ eventId: req.params.id });

    res.json({
      success: true,
      message: 'Événement supprimé avec succès'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'événement',
      error: error.message
    });
  }
};

exports.deleteAgency = async (req, res) => {
  try {
    const agency = await Agency.findByIdAndDelete(req.params.id);

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: 'Agence non trouvée'
      });
    }

    // Supprimer les événements de l'agence
    const events = await Event.find({ agencyId: req.params.id });
    const eventIds = events.map(event => event._id);

    await Event.deleteMany({ agencyId: req.params.id });
    await Candidate.deleteMany({ eventId: { $in: eventIds } });
    await Vote.deleteMany({ eventId: { $in: eventIds } });

    res.json({
      success: true,
      message: 'Agence supprimée avec succès'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'agence',
      error: error.message
    });
  }
};