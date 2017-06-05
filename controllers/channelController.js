const argon2 = require('argon2');
const crypto = require('crypto');
const omit = require('lodash.omit');
const db = require('../models/channelModel');

const listAllChannels = (req, res) => {
  // make sure to set password = undefined
  const result = db.map(channel => {
    return omit(channel, 'password');
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
  if (!req.body.channelName || !req.body.channelUrl) {
    return res.status(400).json({
      message: 'Incomplete information provided.'
    });
  }

  crypto.randomBytes(20, (err, buf) => {
    if (err) {
      return res.status(500).end();
    }

    const password = buf.toString('hex');
    return argon2
      .hash(password, { type: argon2.argon2d })
      .then(hash => {
        db.push({
          name: req.body.channelName,
          url: req.body.channelUrl,
          password: hash
        });
        res.status(200).json({ channelPassword: password });
      })
      .catch(err => {
        console.log(err);
        res.status(500).end();
      });
  });
};

const editChannel = (req, res) => {
  if (
    !req.body.channelName ||
    !req.body.channelUrl ||
    !req.body.channelPassword
  ) {
    return res.status(400).json({
      message: 'Incomplete information provided.'
    });
  }

  const index = db.findIndex(channel => channel.url === req.body.channelUrl);
  if (index === -1) {
    return res.status(400).json({
      message: 'No channel found with given url.'
    });
  }

  return argon2
    .verify(db[index].password, req.body.channelPassword)
    .then(match => {
      if (match) {
        db[index].name = req.body.channelName;
        res.status(200).end();
      } else {
        res.status(401).end();
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
};

const deleteChannel = (req, res) => {
  if (!req.body.channelUrl || !req.body.channelPassword) {
    return res.status(400).json({
      message: 'Incomplete information provided.'
    });
  }

  const index = db.findIndex(channel => channel.url === req.body.channelUrl);
  if (index === -1) {
    return res.status(400).json({
      message: 'No channel found with given url.'
    });
  }
  return argon2
    .verify(db[index].password, req.body.channelPassword)
    .then(match => {
      if (match) {
        db.splice(index, 1);
        res.status(200).end();
      } else {
        res.status(401).end();
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
};

module.exports = {
  listAllChannels,
  getChannel,
  addChannel,
  editChannel,
  deleteChannel
};
