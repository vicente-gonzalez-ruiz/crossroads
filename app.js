const express = require('express');
const morgan = require('morgan');
const config = require('./configs/config');
const channelApi = require('./routes/channelRoutes');
const db = require('./models/channelModel');
const logger = require('kaho');

// set database stub
db.setDB([]);

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Welcome to P2PSP rest_server.');
});

app.use('/channels', channelApi);

app.listen(config.port, () => {
  logger('INFO', 'Starting P2PSP server');
});
