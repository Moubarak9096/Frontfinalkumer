const Agency = require('../Models/Agency');
const Event = require('../Models/Event');

exports.getAgencyProfile = async (req, res) => {
  try {
    const agency = await Agency.findOne({ userId: req.userId })
      .populate('userId', 'firstName lastName email phone');

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: 'Agence non trouvée'
      });
    }

    // Récupérer les événements de l'agence
    const events = await Event.find({ agencyId: agency._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      agency: {
        ...agency.toObject(),
        user: agency.userId
      },
      events
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil agence',
      error: error.message
    });
  }
};

exports.updateAgencyProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const agency = await Agency.findOneAndUpdate(
      { userId: req.userId },
      { 
        name,
        phone,
        address,
        ...(req.file && { image: req.file.filename })
      },
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
      message: 'Profil agence mis à jour avec succès',
      agency
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message
    });
  }
};

exports.getAgencyStats = async (req, res) => {
  try {
    const agency = await Agency.findOne({ userId: req.userId });

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: 'Agence non trouvée'
      });
    }

    const events = await Event.find({ agencyId: agency._id });
    const activeEvents = events.filter(event => event.status === 'active').length;
    const totalParticipants = events.reduce((sum, event) => sum + event.participants, 0);
    const totalVotes = events.reduce((sum, event) => sum + event.totalVotes, 0);

    res.json({
      success: true,
      stats: {
        totalEvents: events.length,
        activeEvents,
        totalParticipants,
        totalVotes,
        eventsCreated: agency.eventsCreated
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