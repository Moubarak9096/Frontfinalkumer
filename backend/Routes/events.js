const express = require('express');
const router = express.Router();
const eventController = require('../Controllers/eventController');  // CORRECTION ICI
const { auth } = require('../Middleware/auth');
const { uploadEventFiles } = require('../Middleware/upload');

router.post('/', auth, uploadEventFiles, eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.post('/vote', auth, eventController.vote);
router.get('/:id/results', eventController.getEventResults);

module.exports = router;