const omit = require('lodash.omit');

// Add db stub for prototyping purpose
let db = undefined;

const setDB = database => {
  db = database;
};

const getAllChannels = () => {
  return db.map(channel => {
    return omit(channel, 'password');
  });
};

const getChannel = url => {
  const c = db.find(channel => channel.url === url);
  return c ? omit(c, ['password', 'url']) : false;
};

const addChannel = channel => {
  if (!channel.name || !channel.url || !channel.password) {
    return false;
  }
  db.push({
    name: channel.name,
    url: channel.url,
    ip: channel.ip,
    port: channel.port,
    password: channel.password
  });
  return true;
};

const getChannelHash = url => {
  const index = db.findIndex(channel => channel.url === url);
  return index === -1 ? null : db[index].password;
};

const editChannel = (url, newChannel) => {
  const index = db.findIndex(channel => channel.url === url);
  if (index !== -1) {
    db[index].name = newChannel.name;
    return true;
  } else {
    return false;
  }
};

const removeChannel = url => {
  const index = db.findIndex(channel => channel.url === url);
  if (index !== -1) {
    db.splice(index, 1);
    return true;
  } else {
    return false;
  }
};

module.exports = {
  setDB,
  getAllChannels,
  getChannel,
  addChannel,
  getChannelHash,
  editChannel,
  removeChannel
};
