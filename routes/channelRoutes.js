const router = require('express').Router();
const cntrl = require('../controllers/channelController');

router.get('/:channelUrl', cntrl.getChannel);
router.post('/', cntrl.addChannel);
router.put('/:channelUrl', cntrl.editChannel);
router.delete('/:channelUrl', cntrl.deleteChannel);
router.get('/', cntrl.listAllChannels);

module.exports = router;
