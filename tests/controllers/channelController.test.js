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

test('Get single channel', () => {
  const req1 = { params: { channelUrl: 'someurl1' } };
  const req2 = { params: { channelUrl: 'nourlfound' } };
  const res1 = { json: jest.fn(), status: jest.fn() };
  const res2 = { json: jest.fn(), status: jest.fn() };

  res2.status.mockReturnValue({ end: () => {} });

  cntrl.getChannel(req1, res1);
  expect(res1.json.mock.calls.length).toBe(1);
  expect(res1.json.mock.calls[0][0].password).toBe(undefined);

  cntrl.getChannel(req2, res2);
  expect(res2.json.mock.calls.length).toBe(0);
  expect(res2.status.mock.calls.length).toBe(1);
  expect(res2.status.mock.calls[0][0]).toBe(400);
});
