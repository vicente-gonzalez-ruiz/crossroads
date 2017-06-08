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
  const req = { body: { channelUrl: 'url2' } };
  const res = { json: jest.fn() };

  cntrl.getChannel(req, res);
  expect(res.json.mock.calls.length).toBe(1);
  expect(res.json.mock.calls[0][0].password).toBe(undefined);
  expect(res.json.mock.calls[0][0].name).toBe('c2');
});

test('Get single channel - Not Found', () => {
  const req = { body: { channelUrl: 'nourlfound' } };
  const res = { status: jest.fn() };
  res.status.mockReturnValue({ end: () => {} });

  cntrl.getChannel(req, res);
  expect(res.status.mock.calls.length).toBe(1);
  expect(res.status.mock.calls[0][0]).toBe(400);
});

test('Add a channel - info provided', async () => {
  const req = { body: { channelName: 'newChannel' } };
  const res = { json: jest.fn() };

  await cntrl.addChannel(req, res);
  expect(res.json.mock.calls.length).toBe(1);
});

test('Add a channel - no info provided', async () => {
  const req = { body: { channelName: undefined } };
  const res = { status: jest.fn() };
  res.status.mockReturnValue({ end: () => {} });

  await cntrl.addChannel(req, res);
  expect(res.status.mock.calls.length).toBe(1);
  expect(res.status.mock.calls[0][0]).toBe(500);
});
