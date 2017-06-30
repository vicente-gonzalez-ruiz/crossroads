const check = require('../../../controllers/validators/channelValidator');
const db = require('../../../models/channelModel');
const cntrl = require('../../../controllers/channelController');

describe('Add channel validator', () => {
  test('Success', () => {
    const req = { body: { channelName: 'channel1' } };
    const res = undefined;
    const next = jest.fn();

    check.add(req, res, next);
    expect(next.mock.calls.length).toBe(1);
  });

  test('Bad input #1', () => {
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

  test('Bad input #2', () => {
    const req = { body: { channelName: 4 } };
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
});

describe('Edit channel validator', () => {
  test('Success', () => {
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

  test('Bad input', () => {
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
});

describe('Remove channel validator', () => {
  test('Success', () => {
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

  test('Bad input', () => {
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
});

describe('Auth validator', () => {
  test('Authorized', async () => {
    const database = {
      prepare: () => database,
      get: jest.fn(),
      run: jest.fn()
    };
    db.setDB(database);
    const addReq = { body: { channelName: 'newChannel' } };
    const addRes = { json: jest.fn() };
    await cntrl.addChannel(addReq, addRes);
    const url = addRes.json.mock.calls[0][0].channelUrl;
    const password = addRes.json.mock.calls[0][0].channelPassword;
    database.get.mockReturnValueOnce({
      password: database.run.mock.calls[0][0].password
    });

    const req = { body: { channelUrl: url, channelPassword: password } };
    const res = { sendStatus: jest.fn() };
    const next = jest.fn();
    await check.auth(req, res, next);

    expect(next.mock.calls.length).toBe(1);
    db.setDB([]);
  });

  test('Bad input', async () => {
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

  test('Unauthorized', async () => {
    const database = {
      prepare: () => database,
      get: jest.fn(),
      run: jest.fn()
    };
    db.setDB(database);
    const addReq = { body: { channelName: 'newChannel' } };
    const addRes = { json: jest.fn() };
    await cntrl.addChannel(addReq, addRes);
    const url = addRes.json.mock.calls[0][0].channelUrl;
    const password = addRes.json.mock.calls[0][0].channelPassword;
    database.get.mockReturnValueOnce({
      password: database.run.mock.calls[0][0].password
    });

    const req = { body: { channelUrl: url, channelPassword: '007' } };
    const res = { sendStatus: jest.fn() };
    const next = jest.fn();
    await check.auth(req, res, next);

    expect(res.sendStatus.mock.calls.length).toBe(1);
    expect(res.sendStatus.mock.calls[0][0]).toBe(401);
    db.setDB([]);
  });

  test('Error thrown', async () => {
    const database = {
      prepare: () => database,
      get: jest.fn(),
      run: jest.fn()
    };
    db.setDB(database);
    const addReq = { body: { channelName: 'newChannel' } };
    const addRes = { json: jest.fn() };
    await cntrl.addChannel(addReq, addRes);
    const url = addRes.json.mock.calls[0][0].channelUrl;
    const password = addRes.json.mock.calls[0][0].channelPassword;
    database.get.mockReturnValueOnce({
      password: database.run.mock.calls[0][0].password
    });

    const req = { body: { channelUrl: url, channelPassword: undefined } };
    const res = { sendStatus: jest.fn() };
    const next = jest.fn();
    await check.auth(req, res, next);

    expect(res.sendStatus.mock.calls.length).toBe(1);
    expect(res.sendStatus.mock.calls[0][0]).toBe(500);
    db.setDB([]);
  });
});
