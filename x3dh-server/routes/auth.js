const express = require('express');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/', isAuth, authController.getUser);
router.get('/user', isAuth, authController.getUserByUsername);

module.exports = router;
