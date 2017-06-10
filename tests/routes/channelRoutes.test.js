const request = require('supertest');
const express = require('express');
const db = require('../../models/channelModel');
const app = express();

const router = require('../../routes/channelRoutes');
app.use(router);

describe('[Integration]: List all channels', () => {
  test('Without setting db', () => {
    return request(app).get('/').expect(500);
  });
  test('With correct db', () => {
    db.setDB([]);
    return request(app).get('/').expect(200);
  });
});

describe('[Integration]: Get one channel', () => {
  test('Channel exists', () => {
    db.setDB([{ name: 'C1', url: 'url1' }]);
    return request(app).get('/url1').expect(200);
  });
  test('Channel does not exists', () => {
    db.setDB([{ name: 'C1', url: 'url1' }]);
    return request(app).get('/u4').expect(400);
  });
});
