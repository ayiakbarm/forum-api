const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread({ title, body, owner }) {
    const id = `thread-${this._idGenerator()}`;
    const created_at = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, created_at],
    };

    const result = await this._pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }

  async checkAvailabilityThread(thread) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [thread],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) throw new NotFoundError('thread not found in database');
  }

  async getDetailThread(thread) {
    const query = {
      text: `
      SELECT threads.id, title, body, threads.created_at as date, username,
      json_agg(json_build_object(
        'id', comments.id,
        'username', username,
        'date', comments.created_at,
        'content', comments.content
      )) as comments
      FROM threads 
      LEFT JOIN users ON users.id = threads.owner
      LEFT JOIN comments ON comments.thread = threads.id
      WHERE threads.id = $1
      GROUP BY threads.id, title, body, threads.created_at, username
  `,
      values: [thread],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
