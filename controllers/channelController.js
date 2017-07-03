/**
 * ChannelController module - Contains various methods for acting as controller
 * layer between models and routes. Proper validators must be placed before them
 * to validate/authorize requests.
 *
 * Exports methods
 *  - listAllChannels
 *  - getChannel
 *  - addChannel
 *  - editChannel
 *  - removeChannel
 *
 * @module controllers/validators/channelController
 */

const crypto = require('crypto');
const argon2 = require('argon2');
const logger = require('kaho');
const shortid = require('shortid');
const promisify = require('util').promisify;
const generateApiKey = promisify(crypto.randomBytes);
const db = require('../models/channelModel');

/**
 * Main controller method for listing out all channels currently present in
 * database. Response is sent in JSON encoded array of objects containing
 * channel information, HTTP 500 for server error.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const listAllChannels = (req, res) => {
  let result = db.getAllChannels(req.query.limit, req.query.offset);
  result = result === undefined ? [] : result;
  if (result) {
    result.forEach(channel => {
      channel.splitterList = channel.splitterList.split(',');
    });
    res.json(result);
  } else {
    res.sendStatus(500);
  }
};

/**
 * Controller method for getting information about a single channel with given
 * channel url. Response is sent in JSON JSON encoded object containing channel
 * information, HTTP 400 for wrong url, HTTP 500 for server error.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getChannel = (req, res) => {
  const result = db.getChannel(req.params.channelUrl);
  if (result) {
    result.splitterList = result.splitterList.split(',');
    res.json(result);
  } else if (result === undefined) {
    res.sendStatus(400);
  } else {
    res.sendStatus(500);
  }
};

/**
 * Controller method for adding a new channel with given channel name. Newly
 * created channel's password and url are returned along with HTTP 200, on error
 * HTTP 500 is returned instead. For every server error, logger is fed with err
 * stack which shall be printed on attached [process.stdout].
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addChannel = async (req, res) => {
  try {
    const buf = await generateApiKey(20);
    const hash = await argon2.hash(buf.toString('hex'));
    const channel = {
      name: req.body.channelName,
      url: shortid.generate(),
      splitterList: '127.0.0.1:33244,127.0.0.1:8001',
      description: req.body.channelDescription,
      password: hash
    };
    if (db.addChannel(channel)) {
      const response = {
        channelUrl: channel.url,
        channelPassword: buf.toString('hex')
      };
      res.json(response);
    } else {
      throw new Error('Error adding new channel');
    }
  } catch (err) {
    res.sendStatus(500);
    logger('ERROR', err.toString(), err);
  }
};

/**
 * Controller method for editing a single channel with given channel url and its
 * corresponding password. HTTP 200 is returned if successful, otherwise HTTP
 * 500 for error.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const editChannel = (req, res) => {
  const newChannel = {
    name: req.body.channelNewName,
    description: req.body.channelNewDescription
  };

  if (db.editChannel(req.body.channelUrl, newChannel)) {
    res.end();
  } else {
    res.sendStatus(500);
  }
};

/**
 * Controller method for removing a single channel with given channel url and
 * its corresponding password. HTTP 200 is returned if successful, otherwise
 * HTTP 500 for error.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const removeChannel = (req, res) => {
  if (db.removeChannel(req.body.channelUrl)) {
    res.end();
  } else {
    res.sendStatus(500);
  }
};

module.exports = {
  listAllChannels,
  getChannel,
  addChannel,
  editChannel,
  removeChannel
};
