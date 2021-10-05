const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/signup', authController.postRegisterCustomer);

router.post('/login', authController.postLogin);

module.exports = router;