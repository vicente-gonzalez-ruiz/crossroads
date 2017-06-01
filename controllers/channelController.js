const db = require('../models/channelModel');


const listAllChannels = (req, res) => {
  return res.status(200).json(db);
};


const getChannel = (req, res) => {
  const result = db.find(channel => channel.url === req.params.channelUrl);
  if (result) {
    return res.status(200).json(result);
  } else {
    return res.status(400).end();
  }
};


const addChannel = (req, res) => {
  if (req.body.channelName && req.body.channelUrl) {
    db.push({
      name: req.body.channelName,
      url: req.body.channelUrl
    });
    return res.status(200).end();
  } else {
    return res.status(400).end();
  }
};


const editChannel = (req, res) => {
  if (req.body.channelName && req.body.channelUrl) {
    const index = db.findIndex(channel => channel.url === req.body.channelUrl);
    if (index !== -1) {
      db[index].name = req.body.channelName;
      return res.status(200).end();
    }
  }
  return res.status(400).end();
};


const deleteChannel = (req, res) => {
  if (req.body.channelName && req.body.channelUrl) {
    const index = db.findIndex(channel => channel.url === req.body.channelUrl);
    if (index !== -1) {
      db.splice(index, 1);
      return res.status(200).end();
    }
  }
  return res.status(400).end();
};


module.exports = {
  listAllChannels,
  getChannel,
  addChannel,
  editChannel,
  deleteChannel
};
