/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentRepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    content = 'sebuah balasan komen',
    owner = 'user-123',
    comment = 'comment-123',
    createdAt = new Date().toISOString(),
    thread = 'thread-123',
  }) {
    const query = {
      text: 'INSERT INTO comment_replies(id, content, owner, comment, created_at, is_delete, thread) VALUES($1, $2, $3, $4, $5, false, $6) RETURNING id, content, owner',
      values: [id, content, owner, comment, createdAt, thread],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_replies WHERE 1=1');
  },
};

module.exports = CommentRepliesTableTestHelper;
