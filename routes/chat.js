var express = require('express');
var router = express.Router();
var chatController = require('../app/chat/controllers/ChatController');

router.post('/',chatController.send);

router.get('/member/all',chatController.getAllMembers);
router.get('/member/online',chatController.getOnlineMembers);
/*router.get('/member/offline',chatController.getOnlineMembers);
router.put('/:id',chatController.update);
router.delete('/:id',chatController.delete); */

module.exports = router;
