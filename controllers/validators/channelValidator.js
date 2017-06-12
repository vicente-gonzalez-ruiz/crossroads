const argon2 = require('argon2');
const db = require('../../models/channelModel');
const logger = require('../../utils/logger');

const add = (req, res, next) => {
  if (!req.body.channelName) {
    return res.status(400).json({
      message: 'Incomplete information provided.'
    });
  } else {
    next();
  }
};

const edit = (req, res, next) => {
  if (
    !req.body.channelNewName ||
    !req.body.channelUrl ||
    !req.body.channelPassword
  ) {
    return res.status(400).json({
      message: 'Incomplete information provided.'
    });
  } else {
    next();
  }
};

const remove = (req, res, next) => {
  if (!req.body.channelUrl || !req.body.channelPassword) {
    return res.status(400).json({
      message: 'Incomplete information provided.'
    });
  } else {
    next();
  }
};

const auth = async (req, res, next) => {
  const hash = db.getChannelHash(req.body.channelUrl);
  if (hash === null) {
    return res.status(400).json({
      message: 'No channel found with given url.'
    });
  }

  try {
    const matched = await argon2.verify(hash, req.body.channelPassword);
    if (matched) {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    logger('ERROR', err.toString());
    res.sendStatus(500);
  }
};

module.exports = {
  add,
  edit,
  remove,
  auth
};
