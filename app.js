const express = require('express');
const config = require('./config/config');
const channelApi = require('./routes/channelRoutes');

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to P2PSP rest_server.');
});

app.use('/channels', channelApi);

app.listen(config.port);
