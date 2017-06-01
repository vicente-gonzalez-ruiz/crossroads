const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('List of all channels.');
});

router.get('/:url', (req, res) => {
  res.send('Info about particular channel: ' + req.params.url);
});

router.post('/', (req, res) => {
  res.send('Channel added successfully.');
});

router.put('/:url', (req, res) => {
  res.send('Channel edited successfully.');
});

router.delete('/:url', (req, res) => {
  res.send('Channel deleted successfully.');
});

module.exports = router;
