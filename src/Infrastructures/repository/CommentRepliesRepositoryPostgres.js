const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepliesRepository = require('../../Domains/comment_replies/CommentRepliesRepository');
const AddedReply = require('../../Domains/comment_replies/entities/AddedReply');

class CommentRepliesRepositoryPostgres extends CommentRepliesRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(payload) {
    const { content, owner, comment, thread } = payload;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO comment_replies VALUES($1, $2, $3, $4, $5, $6, $7, false) RETURNING id, content, owner',
      values: [id, content, owner, comment, thread, createdAt, updatedAt],
    };
    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async getDetailReplyComment(comment) {
    const query = {
      text: `
      SELECT comment_replies.id, content, created_at as date, username, is_delete
      FROM comment_replies
      LEFT JOIN users ON users.id = comment_replies.owner
      WHERE comment = $1
      ORDER BY created_at ASC
      `,
      values: [comment],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async checkAvailabilityReply(reply) {
    const query = {
      text: `SELECT * FROM comment_replies WHERE id = $1`,
      values: [reply],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) throw new NotFoundError('reply not found in database');
  }

  async verifyReplyOwner(reply, owner) {
    const query = {
      text: `SELECT * FROM comment_replies WHERE id = $1 AND owner = $2`,
      values: [reply, owner],
    };

    const result = await this._pool.query(query);
    if (result.rowCount === 0)
      throw new AuthorizationError('user not authorized to delete this reply');
  }

  async deleteReply(reply) {
    const query = {
      text: `UPDATE comment_replies SET is_delete = true WHERE id = $1`,
      values: [reply],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepliesRepositoryPostgres;
