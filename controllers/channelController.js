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
const db = require('../models/channelModel');
const logger = require('kaho');
const promisify = require('util').promisify;
const generateApiKey = promisify(crypto.randomBytes);

/**
 * Main controller method for listing out all channels currently present in
 * database. Response is sent in JSON format.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} JSON encoded array of objects containing channel information
 */
const listAllChannels = (req, res) => {
  return res.json(db.getAllChannels());
};

/**
 * Controller method for getting information about a single channel with given
 * channel url. Response is sent in JSON format, HTTP 400 for wrong url.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} JSON encoded object containing channel information
 */
const getChannel = (req, res) => {
  const result = db.getChannel(req.params.channelUrl);
  return result ? res.json(result) : res.sendStatus(400);
};

/**
 * Controller method for adding a new channel with given channel name. Newly
 * created channel's password and url are returned along with HTTP 200, on error
 * HTTP 500 is returned instead. For every server error, logger is fed with err
 * stack which shall be printed on attached [process.stdout].
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns HTTP status 200 for success, 500 for error
 */
const addChannel = async (req, res) => {
  try {
    const buf = await generateApiKey(20);
    const hash = await argon2.hash(buf.toString('hex'));
    const channel = {
      name: req.body.channelName,
      url: req.body.channelName + 'URL',
      ip: '127.0.0.1',
      port: 5200,
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
 * @returns HTTP status 200 for success, 500 for error
 */
const editChannel = (req, res) => {
  const newChannel = {
    name: req.body.channelNewName
  };

  return db.editChannel(req.body.channelUrl, newChannel)
    ? res.end()
    : res.sendStatus(500);
};

/**
 * Controller method for removing a single channel with given channel url and
 * its corresponding password. HTTP 200 is returned if successful, otherwise
 * HTTP 500 for error.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns HTTP status 200 for success, 500 for error
 */
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
