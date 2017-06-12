const crypto = require('crypto');
const argon2 = require('argon2');
const db = require('../models/channelModel');
const promisify = require('util').promisify;
const generateApiKey = promisify(crypto.randomBytes);

const listAllChannels = (req, res) => {
  return res.json(db.getAllChannels());
};

const getChannel = (req, res) => {
  const result = db.getChannel(req.params.channelUrl);
  return result ? res.json(result) : res.sendStatus(400);
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
        ip: '127.0.0.1',
        port: 5200,
        password: hash
      };
      if (db.addChannel(channel)) {
        res.json({ channelUrl: channel.url, channelPassword: password });
      } else {
        reject(new Error('Error adding new channel'));
      }
    })
    .catch(err => {
      res.sendStatus(500);
    });
};

const editChannel = (req, res) => {
  const newChannel = {
    name: req.body.channelNewName
  };

  return db.editChannel(req.body.channelUrl, newChannel)
    ? res.end()
    : res.sendStatus(500);
};

const removeChannel = (req, res) => {
  return db.removeChannel(req.body.channelUrl)
    ? res.end()
    : res.sendStatus(500);
};

module.exports = {
  listAllChannels,
  getChannel,
  addChannel,
  editChannel,
  removeChannel
};
