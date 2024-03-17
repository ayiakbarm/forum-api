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

  async getDetailReplyComment(thread) {
    const query = {
      text: `
      SELECT comment_replies.id, content, created_at as date, username, is_delete
      FROM comment_replies
      LEFT JOIN users ON users.id = comment_replies.owner
      WHERE thread = $1
      ORDER BY created_at ASC
      `,
      values: [thread],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CommentRepliesRepositoryPostgres;
