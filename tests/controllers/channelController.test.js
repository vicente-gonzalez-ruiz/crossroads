const cntrl = require('../../controllers/channelController');
const setDatabase = require('../../models/channelModel').setDB;

// setup mock database for each test
beforeEach(() => {
  const database = [
    {
      name: 'c1',
      url: 'url1',
      password: '12345'
    },
    {
      name: 'c2',
      url: 'url2',
      password: '56789'
    },
    {
      name: 'c3',
      url: 'url3',
      password: 'abcde'
    }
  ];
  setDatabase(database);
});

afterEach(() => {
  setDatabase([]);
});

afterAll(() => {
  setDatabase(undefined);
});

// Tests begin here

test('Lists all channels', () => {
  const res = { json: jest.fn() };
  const req = undefined;

  cntrl.listAllChannels(req, res);
  expect(res.json.mock.calls.length).toBe(1);
  expect(res.json.mock.calls[0][0].length).toBe(3);

  res.json.mock.calls[0][0].forEach(channel => {
    expect(channel.password).toBe(undefined);
  });
});

test('Get single channel - Found', () => {
  const req = { params: { channelUrl: 'url2' } };
  const res = { json: jest.fn() };

  cntrl.getChannel(req, res);
  expect(res.json.mock.calls.length).toBe(1);
  expect(res.json.mock.calls[0][0].password).toBe(undefined);
  expect(res.json.mock.calls[0][0].name).toBe('c2');
});

test('Get single channel - Not Found', () => {
  const req = { params: { channelUrl: 'nourlfound' } };
  const res = { sendStatus: jest.fn() };

  cntrl.getChannel(req, res);
  expect(res.sendStatus.mock.calls.length).toBe(1);
  expect(res.sendStatus.mock.calls[0][0]).toBe(400);
});

test('Add a channel', async () => {
  const req = { body: { channelName: 'newChannel' } };
  const res = { json: jest.fn() };

  await cntrl.addChannel(req, res);
  expect(res.json.mock.calls.length).toBe(1);
});

test('Add a channel - bad', async () => {
  const req = { body: { channelName: undefined } };
  const res = { sendStatus: jest.fn() };

  await cntrl.addChannel(req, res);
  expect(res.sendStatus.mock.calls.length).toBe(1);
  expect(res.sendStatus.mock.calls[0][0]).toBe(500);
});

test('Edit a channel', async () => {
  const addReq = { body: { channelName: 'newChannel' } };
  const addRes = { json: jest.fn() };
  await cntrl.addChannel(addReq, addRes);
  const url = addRes.json.mock.calls[0][0].channelUrl;

  const req = {
    body: {
      channelNewName: 'newChannel',
      channelUrl: url
    }
  };
  const res = { end: jest.fn() };

  cntrl.editChannel(req, res);
  expect(res.end.mock.calls.length).toBe(1);
});

test('Edit a channel - bad', () => {
  const req = { body: { channelNewName: undefined } };
  const res = { sendStatus: jest.fn() };

  cntrl.editChannel(req, res);
  expect(res.sendStatus.mock.calls.length).toBe(1);
  expect(res.sendStatus.mock.calls[0][0]).toBe(500);
});

test('Remove a channel', () => {
  const req = { body: { channelUrl: 'url1' } };
  const res = { end: jest.fn() };

  cntrl.removeChannel(req, res);
  expect(res.end.mock.calls.length).toBe(1);
});

test('Remove a channel - bad', () => {
  const req = { body: { channelUrl: 'someNonExistingURL' } };
  const res = { sendStatus: jest.fn() };

  cntrl.removeChannel(req, res);
  expect(res.sendStatus.mock.calls.length).toBe(1);
  expect(res.sendStatus.mock.calls[0][0]).toBe(500);
});
