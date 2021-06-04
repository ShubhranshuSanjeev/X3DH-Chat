const express = require('express');
const contactController = require('../controllers/contact');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/', isAuth, contactController.getContacts);
router.get('/chat/:userId', isAuth, contactController.getChat);
router.get('/requests', isAuth, contactController.getConnectionRequests);

router.post('/requests', isAuth, contactController.postConnectionRequest);

router.patch('/request/:requestId/accept', isAuth, contactController.acceptOrDeclineRequests);
router.patch('/request/:requestId/decline', isAuth, contactController.acceptOrDeclineRequests);
module.exports = router;
