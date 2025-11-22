const User = require('../Models/User');
const Agency = require('../Models/Agency');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'klumer_secret', {
    expiresIn: '30d'
  });
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, userType, agencyName } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Si c'est une agence, vérifier si le nom d'agence est déjà pris
    if (userType === 'agency') {
      const existingAgency = await Agency.findOne({ name: agencyName });
      if (existingAgency) {
        return res.status(400).json({
          success: false,
          message: 'Ce nom d\'agence est déjà utilisé'
        });
      }
    }

    // Créer l'utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      userType
    });

    let agency = null;

    // Si c'est une agence, créer le profil agence
    if (userType === 'agency') {
      agency = await Agency.create({
        name: agencyName,
        email,
        phone,
        address: 'À compléter',
        userId: user._id
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: userType === 'agency' ? 'Agence créée avec succès' : 'Compte créé avec succès',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        agencyId: agency ? agency._id : null
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du compte',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Si c'est une agence, récupérer les infos de l'agence
    let agency = null;
    if (user.userType === 'agency') {
      agency = await Agency.findOne({ userId: user._id });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        agencyId: agency ? agency._id : null
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};