/**
 * ChannelValidator module - Contains various middlewares for validating
 * presence of appropriate data in req object and/or authorization process for
 * modifying exisiting data. Should be called before actual controller methods.
 *
 * Exports methods
 *  - add
 *  - edit
 *  - remove
 *  - auth
 *
 * @module controllers/validators/channelValidator
 */

const argon2 = require('argon2');
const db = require('../../models/channelModel');
const logger = require('kaho');

/**
 * Request body validator for adding a new channel route. Checks for channelName
 * is sent with the request, denies the request otherwise by returning HTTP 400.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
const add = (req, res, next) => {
  if (!req.body.channelName) {
    res.status(400).json({
      message: 'Incomplete information provided.'
    });
  } else {
    next();
  }
};

/**
 * Request body validator for editing channel route. Checks for channelNewName,
 * channelUrl and channelPassword are sent with the request, denies the request
 * otherwise by returning HTTP 400.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
const edit = (req, res, next) => {
  if (
    !req.body.channelNewName ||
    !req.body.channelUrl ||
    !req.body.channelPassword
  ) {
    res.status(400).json({
      message: 'Incomplete information provided.'
    });
  } else {
    next();
  }
};

/**
 * Request body validator for removing an existing channel route. Checks for
 * channelUrl and channelPassword are sent with the request, denies the request
 * otherwise by returning HTTP 400. Does not performs any kind of authorization.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
const remove = (req, res, next) => {
  if (!req.body.channelUrl || !req.body.channelPassword) {
    res.status(400).json({
      message: 'Incomplete information provided.'
    });
  } else {
    next();
  }
};

/**
 * Authorization middleware - assumes channelUrl is already present in request
 * and tries to locate and authorize appropirate channel if possible, otherwise
 * denies the request and returns HTTP 401.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
const auth = async (req, res, next) => {
  const hash = db.getChannelHash(req.body.channelUrl);
  if (hash === null) {
    res.status(400).json({
      message: 'No channel found with given url.'
    });
    return;
  }

  try {
    const matched = await argon2.verify(hash, req.body.channelPassword);
    if (matched) {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    logger('ERROR', err.toString(), err);
    res.sendStatus(500);
  }
};

module.exports = {
  add,
  edit,
  remove,
  auth
};
