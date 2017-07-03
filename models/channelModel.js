const logger = require('kaho');
const Q = require('./Q');

let db = undefined;

const setDB = database => {
  db = database;
};

const start = () => {
  db.prepare(Q.createTable).run();
};

const getAllChannels = (limit = 20, offset = 0) => {
  try {
    return db.prepare(Q.selectAllChannels).all({ limit, offset });
  } catch (e) {
    logger('ERROR', 'getAllChannels() crash', e);
    return false;
  }
};

const getChannel = url => {
  try {
    return db.prepare(Q.selectChannel).get(url);
  } catch (e) {
    logger('ERROR', 'getChannel() crash', e);
    return false;
  }
};

const addChannel = channel => {
  try {
    db.prepare(Q.insertChannel).run(channel);
    return true;
  } catch (e) {
    logger('ERROR', 'addChannel() crash', e);
    return false;
  }
};

const getChannelHash = url => {
  try {
    return db.prepare(Q.selectHash).get(url);
  } catch (e) {
    logger('ERROR', 'getChannelHash() crash', e);
    return null;
  }
};

const editChannel = (url, newChannel) => {
  try {
    newChannel.url = url;
    db.prepare(Q.updateChannel).run(newChannel);
    return true;
  } catch (e) {
    logger('ERROR', 'editChannel() crash', e);
    return false;
  }
};

const removeChannel = url => {
  try {
    db.prepare(Q.deleteChannel).run(url);
    return true;
  } catch (e) {
    logger('ERROR', 'removeChannel() crash', e);
    return false;
  }
};

module.exports = {
  setDB,
  start,
  getAllChannels,
  getChannel,
  addChannel,
  getChannelHash,
  editChannel,
  removeChannel
};
