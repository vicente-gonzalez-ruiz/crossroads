const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('P2PSP rest_server implementation.');
});

app.listen(3000, () => {
  console.log('App started on port 3000!');
});
