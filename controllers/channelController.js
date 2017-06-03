const db = require('../models/channelModel');
const argon2 = require('argon2');


const listAllChannels = (req, res) => {
  // make sure to set password = undefined
  const result = db.map(channel => {
    channel.password = undefined;
    return channel;
  });
  return res.status(200).json(result);
};

const getChannel = (req, res) => {
  const result = db.find(channel => channel.url === req.params.channelUrl);
  if (result) {
    // make sure to set password = undefined
    result.password = undefined;
    return res.status(200).json(result);
  } else {
    return res.status(400).end();
  }
};

const addChannel = (req, res) => {
  if (req.body.channelName && req.body.channelUrl && req.body.channelPassword) {
    return argon2
      .hash(req.body.channelPassword, {
        type: argon2.argon2d
      })
      .then(hash => {
        db.push({
          name: req.body.channelName,
          url: req.body.channelUrl,
          password: hash
        });
        res.status(200).end();
      })
      .catch(err => {
        res.status(500).end();
      });
  } else {
    return res.status(400).end();
  }
};

const editChannel = (req, res) => {
  if (req.body.channelName && req.body.channelUrl && req.body.channelPassword) {
    const index = db.findIndex(channel => channel.url === req.body.channelUrl);
    if (index !== -1) {
      return argon2
        .verify(db[index].password, req.body.channelPassword)
        .then(match => {
          if (match) {
            db[index].name = req.body.channelName;
            res.status(200).end();
          }
        })
        .catch(err => {
          res.status(500).end();
        });
    }
  }
  return res.status(400).end();
};

const deleteChannel = (req, res) => {
  if (req.body.channelName && req.body.channelUrl && req.body.channelPassword) {
    const index = db.findIndex(channel => channel.url === req.body.channelUrl);
    if (index !== -1) {
      return argon2
        .verify(db[index].password, req.body.channelPassword)
        .then(match => {
          if (match) {
            db.splice(index, 1);
            res.status(200).end();
          }
        })
        .catch(err => {
          res.status(500).end();
        });
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
