const listAllChannels = (req, res) => {
  res.send('List of all channels.');
};

const getChannel = (req, res) => {
  res.send('Info about particular channel: ' + req.params.channelUrl);
};

const addChannel = (req, res) => {
  res.send('Channel added successfully.');
};

const editChannel = (req, res) => {
  res.send('Channel edited successfully.');
};

const deleteChannel = (req, res) => {
  res.send('Channel deleted successfully.');
};

module.exports = {
  listAllChannels,
  getChannel,
  addChannel,
  editChannel,
  deleteChannel
};
