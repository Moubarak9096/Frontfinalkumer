// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const { adminAuth } = require('../Middleware/auth');

router.post('/login', adminController.adminLogin);
router.get('/verify', adminAuth, adminController.verifyAdmin);
router.get('/stats', adminAuth, adminController.getStats);
router.get('/events', adminAuth, adminController.getEvents);
router.get('/agencies', adminAuth, adminController.getAgencies);
router.get('/users', adminAuth, adminController.getUsers);
router.put('/events/:id/status', adminAuth, adminController.updateEventStatus);
router.put('/agencies/:id/status', adminAuth, adminController.updateAgencyStatus);
router.delete('/events/:id', adminAuth, adminController.deleteEvent);
router.delete('/agencies/:id', adminAuth, adminController.deleteAgency);

module.exports = router;