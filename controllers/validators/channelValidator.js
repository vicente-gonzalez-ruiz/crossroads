const argon2 = require('argon2');
const db = require('../../models/channelModel');

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

const auth = (req, res, next) => {
  const hash = db.getChannelHash(req.body.channelUrl);
  if (hash === null) {
    return res.status(400).json({
      message: 'No channel found with given url.'
    });
  }
  return argon2
    .verify(hash, req.body.channelPassword)
    .then(match => {
      if (match) {
        next();
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
  add,
  edit,
  remove,
  auth
};
