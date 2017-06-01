const express = require('express');
const morgan = require('morgan');
const config = require('./config/config');
const channelApi = require('./routes/channelRoutes');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Welcome to P2PSP rest_server.');
});

app.use('/channels', channelApi);

app.listen(config.port);
