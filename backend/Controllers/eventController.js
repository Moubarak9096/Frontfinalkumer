const Event = require('../Models/Event');
const Candidate = require('../Models/Candidate');
const Agency = require('../Models/Agency');
const Vote = require('../Models/Vote');

exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      startDate,
      endDate,
      agencyName,
      agencyEmail,
      agencyPhone,
      agencyAddress,
      candidates
    } = req.body;

    // Vérifier et créer/mettre à jour l'agence
    let agency = await Agency.findOne({ email: agencyEmail });
    if (!agency) {
      agency = await Agency.create({
        name: agencyName,
        email: agencyEmail,
        phone: agencyPhone,
        address: agencyAddress,
        userId: req.userId
      });
    }

    // Créer l'événement
    const event = await Event.create({
      title,
      description,
      category,
      startDate,
      endDate,
      image: req.files?.eventImage ? req.files.eventImage[0].filename : null,
      agencyId: agency._id,
      createdBy: agencyName,
      status: 'active'
    });

    // Créer les candidats
    const candidatePromises = candidates.map(async (candidate, index) => {
      const candidateImage = req.files[`candidateImage${index}`] ? req.files[`candidateImage${index}`][0].filename : null;
      
      return await Candidate.create({
        name: candidate.name,
        description: candidate.description,
        image: candidateImage,
        eventId: event._id
      });
    });

    await Promise.all(candidatePromises);

    // Mettre à jour le compteur d'événements de l'agence
    await Agency.findByIdAndUpdate(agency._id, {
      $inc: { eventsCreated: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Événement créé avec succès',
      event
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'événement',
      error: error.message
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (status && status !== 'all') filter.status = status;

    const events = await Event.find(filter)
      .populate('agencyId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements',
      error: error.message
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('agencyId', 'name email phone address');
    
    const candidates = await Candidate.find({ eventId: req.params.id });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    // Vérifier si l'utilisateur a déjà voté
    let userVote = null;
    if (req.userId) {
      userVote = await Vote.findOne({ 
        userId: req.userId, 
        eventId: req.params.id 
      });
    }

    res.json({
      success: true,
      event: {
        ...event.toObject(),
        candidates,
        hasVoted: !!userVote,
        userVote: userVote ? userVote.candidateId : null
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'événement',
      error: error.message
    });
  }
};

exports.vote = async (req, res) => {
  try {
    const { eventId, candidateId } = req.body;
    const userId = req.userId;

    // Vérifier si l'événement existe et est actif
    const event = await Event.findById(eventId);
    if (!event || event.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Événement non disponible pour le vote'
      });
    }

    // Vérifier si la date est valide
    const now = new Date();
    if (now < event.startDate || now > event.endDate) {
      return res.status(400).json({
        success: false,
        message: 'La période de vote est terminée ou n\'a pas encore commencé'
      });
    }

    // Vérifier si le candidat existe
    const candidate = await Candidate.findOne({ _id: candidateId, eventId });
    if (!candidate) {
      return res.status(400).json({
        success: false,
        message: 'Candidat non valide'
      });
    }

    // Vérifier si l'utilisateur a déjà voté
    const existingVote = await Vote.findOne({ userId, eventId });
    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà voté pour cet événement'
      });
    }

    // Enregistrer le vote
    const vote = await Vote.create({
      userId,
      eventId,
      candidateId,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Mettre à jour les compteurs
    await Candidate.findByIdAndUpdate(candidateId, {
      $inc: { votes: 1 }
    });

    await Event.findByIdAndUpdate(eventId, {
      $inc: { 
        participants: 1,
        totalVotes: 1
      }
    });

    await Agency.findByIdAndUpdate(event.agencyId, {
      $inc: { totalParticipants: 1 }
    });

    // Mettre à jour le compteur de votes de l'utilisateur
    await require('../Models/User').findByIdAndUpdate(userId, {
      $inc: { votesCount: 1 }
    });

    res.json({
      success: true,
      message: 'Vote enregistré avec succès',
      vote
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement du vote',
      error: error.message
    });
  }
};

exports.getEventResults = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    const candidates = await Candidate.find({ eventId: req.params.id })
      .sort({ votes: -1 });

    const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);

    const results = candidates.map(candidate => ({
      ...candidate.toObject(),
      percentage: totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(2) : 0
    }));

    res.json({
      success: true,
      event: {
        title: event.title,
        totalVotes,
        endDate: event.endDate,
        status: event.status
      },
      results
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des résultats',
      error: error.message
    });
  }
};