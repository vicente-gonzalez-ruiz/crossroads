const createTable = `CREATE TABLE IF NOT EXISTS channels (
	name	TEXT NOT NULL,
	password	INTEGER NOT NULL UNIQUE,
	url	TEXT NOT NULL UNIQUE,
	ip	TEXT NOT NULL,
	port	INTEGER NOT NULL,
  visible INTEGER NOT NULL DEFAULT 1
);`;

const selectAllChannels = `SELECT name, url, ip, port
  FROM channels
  WHERE VISIBLE = 1
  LIMIT @limit OFFSET @offset`;

const selectChannel = 'SELECT name, ip, port FROM channels WHERE url = (?)';

const insertChannel = `INSERT INTO channels VALUES (
  @name, @password, @url, @ip, @port, 1 )`;

const updateChannel = 'UPDATE channels SET name = @name WHERE url = @url';

const deleteChannel = 'DELETE FROM channels WHERE url = (?)';

const selectHash = 'SELECT password FROM channels WHERE url = (?)';

module.exports = {
  createTable,
  selectAllChannels,
  selectChannel,
  insertChannel,
  updateChannel,
  deleteChannel,
  selectHash
};
