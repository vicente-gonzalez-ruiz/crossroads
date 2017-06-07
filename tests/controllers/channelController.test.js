const cntrl = require('../../controllers/channelController');

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
  const req = { params: { channelUrl: 'someurl1' } };
  const res = { json: jest.fn(), status: jest.fn() };

  cntrl.getChannel(req, res);
  expect(res.json.mock.calls.length).toBe(1);
  expect(res.json.mock.calls[0][0].password).toBe(undefined);
});

test('Get single channel - Not Found', () => {
  const req = { params: { channelUrl: 'nourlfound' } };
  const res = { json: jest.fn(), status: jest.fn() };
  res.status.mockReturnValue({ end: () => {} });

  cntrl.getChannel(req, res);
  expect(res.json.mock.calls.length).toBe(0);
  expect(res.status.mock.calls.length).toBe(1);
  expect(res.status.mock.calls[0][0]).toBe(400);
});

test('Add a channel - No info provided', () => {
  const req1 = { body: {} };
  const res1 = { status: jest.fn() };
  const jsonMethod1 = jest.fn();
  res1.status.mockReturnValue({ json: jsonMethod1 });

  cntrl.addChannel(req1, res1);
  expect(res1.status.mock.calls.length).toBe(1);
  expect(res1.status.mock.calls[0][0]).toBe(400);
  expect(jsonMethod1.mock.calls.length).toBe(1);
  expect(jsonMethod1.mock.calls[0][0]).toEqual({
    message: 'Incomplete information provided.'
  });

  const req2 = { body: { channelName: 'name' } };
  const res2 = { status: jest.fn() };
  const jsonMethod2 = jest.fn();
  res2.status.mockReturnValue({ json: jsonMethod2 });

  cntrl.addChannel(req2, res2);
  expect(res2.status.mock.calls.length).toBe(1);
  expect(res2.status.mock.calls[0][0]).toBe(400);
  expect(jsonMethod2.mock.calls.length).toBe(1);
  expect(jsonMethod2.mock.calls[0][0]).toEqual({
    message: 'Incomplete information provided.'
  });
});
