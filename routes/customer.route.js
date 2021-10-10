const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const isAuth = require('../middlewares/is-auth');

router.get('/balance', isAuth, customerController.checkBalance);

router.post('/add-balance', isAuth, customerController.addBalance);

router.get('/search/:search_query', isAuth, customerController.searchForParticularWallet);

router.post('/send-to-wallet', isAuth, customerController.sendMoneyToWallet)

router.post('/bill', isAuth, customerController.payBill);

router.get('/bill-summary', isAuth, customerController.getUtilities);

module.exports = router
