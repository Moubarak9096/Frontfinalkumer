const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  votedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  }
});

// Empêcher les votes multiples pour le même événement
voteSchema.index({ userId: 1, eventId: 1 }, { unique: true });

// Méthode statique pour vérifier si l'utilisateur a déjà voté
voteSchema.statics.hasVoted = async function(userId, eventId) {
  const vote = await this.findOne({ userId, eventId });
  return !!vote;
};

module.exports = mongoose.model('Vote', voteSchema);