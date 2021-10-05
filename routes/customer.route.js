const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const isAuth = require('../middlewares/is-auth');

router.get('/balance', isAuth, customerController.checkBalance);

router.post('/add-balance', isAuth,customerController.addBalance);

module.exports = router
