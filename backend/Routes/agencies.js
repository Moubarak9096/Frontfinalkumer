const express = require('express');
const router = express.Router();
const agencyController = require('../Controllers/agencyController');
const { auth } = require('../Middleware/auth');
const { uploadSingle } = require('../Middleware/upload');

router.get('/profile', auth, agencyController.getAgencyProfile);
router.put('/profile', auth, uploadSingle, agencyController.updateAgencyProfile);
router.get('/stats', auth, agencyController.getAgencyStats);

module.exports = router;