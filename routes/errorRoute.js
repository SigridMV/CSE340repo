const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');

// Route to trigger intentional error
router.get('/error-link', errorController.triggerError);

module.exports = router;