const router = require('express').Router();
const bodyParser = require('body-parser');
const cntrl = require('../controllers/channelController');

router.use(bodyParser.json());

router.get('/:channelUrl', cntrl.getChannel);
router.post('/', cntrl.addChannel);
router.put('/', cntrl.editChannel);
router.delete('/', cntrl.deleteChannel);
router.get('/', cntrl.listAllChannels);

module.exports = router;
