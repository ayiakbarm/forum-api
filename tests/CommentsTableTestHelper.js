/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'sebuah comment',
    is_delete = false,
    owner = 'user-123',
    thread = 'thread-123',
    date = '2024-03-23T05:44:14.624Z',
  }) {
    const query = {
      text: 'INSERT INTO comments(id, content, is_delete, owner, thread, created_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, is_delete, owner, thread, date],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
