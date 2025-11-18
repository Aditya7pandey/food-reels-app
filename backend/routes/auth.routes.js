const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.post('/user/register',userController.register);
router.post('/user/login',userController.login);
router.get('/user/logout',userController.logout);

router.post('/partner/register',userController.partnerRegister);
router.post('/partner/login',userController.partnerLogin);
router.get('/partner/logout',userController.partnerLogout);

module.exports = router;