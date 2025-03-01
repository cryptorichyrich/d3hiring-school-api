const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');

router.post('/register', schoolController.register);
router.get('/commonstudents', schoolController.getCommonStudents);
router.post('/suspend', schoolController.suspend);
router.post('/retrievefornotifications', schoolController.retrieveForNotifications);

module.exports = router;