const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(payload) {
    const { content, owner, thread } = payload;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, false, $6) RETURNING id, content, owner',
      values: [id, content, owner, createdAt, updatedAt, thread],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async checkAvailabilityComment(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) throw new NotFoundError('comment not found in database');
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0)
      throw new AuthorizationError('user not authorized to delete this comment');
  }

  async getDetailCommentThread(thread) {
    const query = {
      text: `
      SELECT comments.id, username, created_at as date, content, is_delete
      FROM comments
      LEFT JOIN users ON users.id = comments.owner
      WHERE thread = $1
      ORDER BY created_at ASC`,
      values: [thread],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteComment(comment) {
    const query = {
      text: 'UPDATE comments SET is_delete=true WHERE id = $1',
      values: [comment],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
