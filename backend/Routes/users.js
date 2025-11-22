const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { auth } = require('../Middleware/auth');
const { uploadSingle } = require('../Middleware/upload');

router.get('/profile', auth, userController.getUserProfile);
router.put('/profile', auth, uploadSingle, userController.updateUserProfile);
router.get('/votes', auth, userController.getUserVotes);
router.get('/events', auth, userController.getUserEvents);

module.exports = router;