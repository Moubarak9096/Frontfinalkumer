const User = require('../Models/User');
const Vote = require('../Models/Vote');
const Event = require('../Models/Event');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { 
        firstName,
        lastName,
        phone,
        ...(req.file && { avatar: req.file.filename })
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message
    });
  }
};

exports.getUserVotes = async (req, res) => {
  try {
    const votes = await Vote.find({ userId: req.userId })
      .populate('eventId', 'title category image endDate')
      .populate('candidateId', 'name image')
      .sort({ votedAt: -1 });

    res.json({
      success: true,
      votes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des votes',
      error: error.message
    });
  }
};

exports.getUserEvents = async (req, res) => {
  try {
    // Événements où l'utilisateur a voté
    const votes = await Vote.find({ userId: req.userId }).distinct('eventId');
    
    const events = await Event.find({ 
      _id: { $in: votes },
      status: 'active'
    }).sort({ endDate: 1 });

    res.json({
      success: true,
      events
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements',
      error: error.message
    });
  }
};