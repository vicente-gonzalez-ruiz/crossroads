const express = require('express');
const config = require('./config/config');
const channelApi = require('./api/channel');

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to P2PSP rest_server.');
});

app.use('/channels', channelApi);

app.listen(config.port);
