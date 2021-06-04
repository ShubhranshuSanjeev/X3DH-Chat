const express = require('express');
const chatController = require('../controllers/chat.js');
const isAuth = require('../middleware/is-auth');
const router = express.Router();


router.get('/:otherUserId', isAuth);
router.get('/keybundle/:userId', isAuth, chatController.getKeyBundle);
router.get('/initialMessages', isAuth, chatController.getInitialMessages);
router.get('/x3dhProtocolStatus/:userId', isAuth, chatController.getX3DHProtocolStatus);

router.post('/identityKey', isAuth, chatController.postIdentityKey);
router.post('/prekeybundle', isAuth, chatController.postPreKeyBundle);
router.post('/initialMessage', isAuth, chatController.postInitialMessage);

router.delete('/initialMessage/:userId', isAuth, chatController.deleteInitialMessage);

router.patch('/x3dhProtocolStatus/:userId', isAuth, chatController.updateReciverProtocolStatus);

module.exports = router;
