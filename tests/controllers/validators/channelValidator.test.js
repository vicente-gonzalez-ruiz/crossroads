const check = require('../../../controllers/validators/channelValidator');
const db = require('../../../models/channelModel');
const cntrl = require('../../../controllers/channelController');

test('Add-channel Validator', () => {
  const req = { body: { channelName: 'channel1' } };
  const res = undefined;
  const next = jest.fn();

  check.add(req, res, next);
  expect(next.mock.calls.length).toBe(1);
});

test('Add-channel Validator - bad', () => {
  const req = { body: { channelName: undefined } };
  const res = { status: jest.fn() };
  const jsonMethod = jest.fn();
  res.status.mockReturnValue({ json: jsonMethod });
  const next = undefined;

  check.add(req, res, next);
  expect(res.status.mock.calls.length).toBe(1);
  expect(res.status.mock.calls[0][0]).toBe(400);

  expect(jsonMethod.mock.calls.length).toBe(1);
  expect(jsonMethod.mock.calls[0][0]).toEqual({
    message: 'Incomplete information provided.'
  });
});

test('Edit-channel Validator', () => {
  const req = {
    body: {
      channelNewName: 'channel2',
      channelUrl: 'someUrl',
      channelPassword: '12345'
    }
  };
  const res = undefined;
  const next = jest.fn();

  check.edit(req, res, next);
  expect(next.mock.calls.length).toBe(1);
});

test('Edit-channel Validator - bad', () => {
  const req = { body: {} };
  const res = { status: jest.fn() };
  const jsonMethod = jest.fn();
  res.status.mockReturnValue({ json: jsonMethod });
  const next = undefined;

  check.edit(req, res, next);
  expect(res.status.mock.calls.length).toBe(1);
  expect(res.status.mock.calls[0][0]).toBe(400);

  expect(jsonMethod.mock.calls.length).toBe(1);
  expect(jsonMethod.mock.calls[0][0]).toEqual({
    message: 'Incomplete information provided.'
  });
});

test('Remove-channel Validator', () => {
  const req = {
    body: {
      channelUrl: 'someUrl',
      channelPassword: '12345'
    }
  };
  const res = undefined;
  const next = jest.fn();

  check.remove(req, res, next);
  expect(next.mock.calls.length).toBe(1);
});

test('Remove-channel Validator - bad', () => {
  const req = { body: {} };
  const res = { status: jest.fn() };
  const jsonMethod = jest.fn();
  res.status.mockReturnValue({ json: jsonMethod });
  const next = undefined;

  check.remove(req, res, next);
  expect(res.status.mock.calls.length).toBe(1);
  expect(res.status.mock.calls[0][0]).toBe(400);

  expect(jsonMethod.mock.calls.length).toBe(1);
  expect(jsonMethod.mock.calls[0][0]).toEqual({
    message: 'Incomplete information provided.'
  });
});

test('Auth Validator - authorized', async () => {
  const database = [];
  db.setDB(database);
  const addReq = { body: { channelName: 'newChannel' } };
  const addRes = { json: jest.fn() };
  await cntrl.addChannel(addReq, addRes);
  const url = addRes.json.mock.calls[0][0].channelUrl;
  const password = addRes.json.mock.calls[0][0].channelPassword;

  const req = { body: { channelUrl: url, channelPassword: password } };
  const res = undefined;
  const next = jest.fn();
  await check.auth(req, res, next);
  expect(next.mock.calls.length).toBe(1);
  db.setDB([]);
});

test('Auth Validator - bad', async () => {
  const req = { body: {} };
  const res = { status: jest.fn() };
  const jsonMethod = jest.fn();
  res.status.mockReturnValue({ json: jsonMethod });
  const next = undefined;

  check.auth(req, res, next);
  expect(res.status.mock.calls.length).toBe(1);
  expect(res.status.mock.calls[0][0]).toBe(400);

  expect(jsonMethod.mock.calls.length).toBe(1);
  expect(jsonMethod.mock.calls[0][0]).toEqual({
    message: 'No channel found with given url.'
  });
});

test('Auth Validator - unauthorized', async () => {
  const database = [];
  db.setDB(database);
  const addReq = { body: { channelName: 'newChannel' } };
  const addRes = { json: jest.fn() };
  await cntrl.addChannel(addReq, addRes);
  const url = addRes.json.mock.calls[0][0].channelUrl;
  const password = addRes.json.mock.calls[0][0].channelPassword;

  const req = { body: { channelUrl: url, channelPassword: '007' } };
  const res = { sendStatus: jest.fn() };
  await check.auth(req, res, undefined);
  expect(res.sendStatus.mock.calls.length).toBe(1);
  expect(res.sendStatus.mock.calls[0][0]).toBe(401);

  db.setDB([]);
});

test('Auth Validator - error', async () => {
  const database = [];
  db.setDB(database);
  const addReq = { body: { channelName: 'newChannel' } };
  const addRes = { json: jest.fn() };
  await cntrl.addChannel(addReq, addRes);
  const url = addRes.json.mock.calls[0][0].channelUrl;
  const password = addRes.json.mock.calls[0][0].channelPassword;

  const req = { body: { channelUrl: url, channelPassword: undefined } };
  const res = { sendStatus: jest.fn() };
  await check.auth(req, res, undefined);
  expect(res.sendStatus.mock.calls.length).toBe(1);
  expect(res.sendStatus.mock.calls[0][0]).toBe(500);

  db.setDB([]);
});
