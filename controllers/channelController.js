const crypto = require('crypto');
const argon2 = require('argon2');
const db = require('../models/channelModel');
const promisify = require('util').promisify;
const generateApiKey = promisify(crypto.randomBytes);

const listAllChannels = (req, res) => {
  return res.json(db.getAllChannels());
};

const getChannel = (req, res) => {
  const result = db.getChannel(req.body.channelUrl);
  return result ? res.json(result) : res.status(400).end();
};

const addChannel = (req, res) => {
  let password = undefined;
  return generateApiKey(20)
    .then(buf => {
      password = buf.toString('hex');
      return argon2.hash(password);
    })
    .then(hash => {
      const channel = {
        name: req.body.channelName,
        url: req.body.channelName + 'URL',
        password: hash
      };
      if (db.addChannel(channel)) {
        res.json({ channelUrl: channel.url, channelPassword: password });
      } else {
        reject(new Error('Error adding new channel'));
      }
    })
    .catch(err => {
      res.status(500).end();
    });
};

const editChannel = (req, res) => {
  const newChannel = {
    name: req.body.channelNewName
  };

  return db.editChannel(req.body.channelUrl, newChannel)
    ? res.end()
    : res.status(500).end();
};

const removeChannel = (req, res) => {
  return db.removeChannel(req.body.channelUrl)
    ? res.end()
    : res.status(500).end();
};

module.exports = {
  listAllChannels,
  getChannel,
  addChannel,
  editChannel,
  removeChannel
};
